import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "coverage",
  "node_modules",
  "playwright-report",
  "src/generated",
  "test-results",
]);
const ignoredFileNames = new Set(["package-lock.json"]);
const forbiddenCredentialExtensions = new Set([".key", ".p12", ".pfx", ".pem"]);
const patterns = [
  {
    name: "private key",
    expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  { name: "AWS access key", expression: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub token", expression: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
  { name: "OpenAI-style token", expression: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: "Supabase secret key", expression: /sb_secret_[A-Za-z0-9_-]{20,}/ },
];

async function walk(directory, root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    const relative = path.relative(root, target).split(path.sep).join("/");
    if (entry.isDirectory() && ignoredDirectories.has(relative)) continue;
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    if (entry.isDirectory()) files.push(...(await walk(target, root)));
    else files.push(target);
  }

  return files;
}

const root = process.cwd();
const files = await walk(root, root);
const committableFiles = new Set(
  execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root, encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean),
);
const findings = [];
let inspectedFileCount = 0;

for (const file of files) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  if (!committableFiles.has(relative)) continue;
  inspectedFileCount += 1;
  const baseName = path.basename(file);
  const extension = path.extname(file).toLowerCase();

  if (ignoredFileNames.has(baseName)) continue;
  if (forbiddenCredentialExtensions.has(extension)) {
    findings.push(`${relative}: credential-like file extension`);
    continue;
  }
  if (/^\.env(?:\..+)?$/.test(baseName) && !baseName.endsWith(".example")) {
    findings.push(`${relative}: local environment file must not be committed`);
    continue;
  }

  let contents;
  try {
    contents = await readFile(file, "utf8");
  } catch {
    continue;
  }

  for (const pattern of patterns) {
    if (pattern.expression.test(contents)) {
      findings.push(`${relative}: possible ${pattern.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Secret scan passed (${inspectedFileCount} files inspected).`);
}
