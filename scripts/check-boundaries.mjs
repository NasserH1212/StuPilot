import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"]);
const ignoredDirectories = new Set([
  ".git",
  ".next",
  "coverage",
  "node_modules",
  "playwright-report",
  "test-results",
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(target);
  }

  return files;
}

function normalize(value) {
  return value.split(path.sep).join("/");
}

function resolveImport(root, importer, source) {
  if (source.startsWith("@/")) return normalize(path.resolve(root, source.slice(2)));
  if (source.startsWith("."))
    return normalize(path.resolve(path.dirname(importer), source));
  return source;
}

function importSources(contents) {
  const matches = contents.matchAll(
    /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|require\s*\(\s*["']([^"']+)["']\s*\)/g,
  );
  return [...matches].map((match) => match[1] ?? match[2] ?? match[3]);
}

function isExternal(target, packageName) {
  return target === packageName || target.startsWith(`${packageName}/`);
}

export function boundaryViolations(root, importer, imports) {
  const file = normalize(path.relative(root, importer));
  const violations = [];

  for (const source of imports) {
    const target = resolveImport(root, importer, source);
    const targetInRepository = target.startsWith(normalize(root))
      ? normalize(path.relative(root, target))
      : target;
    const targetsPrototype = targetInRepository.startsWith("research-prototype/");
    const targetsPersistence =
      targetInRepository.includes("/persistence/") ||
      targetInRepository.startsWith("src/infrastructure/persistence");
    const targetsInfrastructure = targetInRepository.startsWith("src/infrastructure/");
    const targetsPresentation = targetInRepository.includes("/presentation/");
    const targetsTransport = targetInRepository.includes("/transport/");
    const targetsNext = isExternal(target, "next");
    const targetsPrisma =
      isExternal(target, "@prisma/client") || target.includes("generated/prisma");
    const targetsAuthenticationProviderSdk =
      isExternal(target, "@supabase/ssr") ||
      isExternal(target, "@supabase/supabase-js");
    const isDomain = /^src\/modules\/[^/]+\/domain\//.test(file);
    const isApplication = /^src\/modules\/[^/]+\/application\//.test(file);
    const isPresentation =
      /^src\/modules\/[^/]+\/presentation\//.test(file) || file.startsWith("app/");
    const isTransport = /^src\/modules\/[^/]+\/transport\//.test(file);
    const isInfrastructure = file.startsWith("src/infrastructure/");

    if (targetsPrototype) {
      violations.push(
        `${file}: importing the research prototype is prohibited (${source})`,
      );
    }
    if (isDomain && (targetsNext || targetsPrisma || targetsInfrastructure)) {
      violations.push(
        `${file}: domain cannot depend on framework or infrastructure (${source})`,
      );
    }
    if (
      isApplication &&
      (targetsNext ||
        targetsPrisma ||
        targetsInfrastructure ||
        targetsPresentation ||
        targetsTransport)
    ) {
      violations.push(
        `${file}: application cannot depend on delivery or infrastructure (${source})`,
      );
    }
    if (isPresentation && (targetsPersistence || targetsPrisma)) {
      violations.push(
        `${file}: presentation cannot access persistence directly (${source})`,
      );
    }
    if (isTransport && (targetsPersistence || targetsPrisma)) {
      violations.push(
        `${file}: transport must call application services, not persistence (${source})`,
      );
    }
    if (isInfrastructure && (targetsPresentation || targetsTransport)) {
      violations.push(
        `${file}: infrastructure cannot depend on delivery layers (${source})`,
      );
    }
    if (targetsAuthenticationProviderSdk && !isInfrastructure) {
      violations.push(
        `${file}: authentication provider SDKs belong only in infrastructure (${source})`,
      );
    }
  }

  return violations;
}

export async function checkRepositoryBoundaries(root = process.cwd()) {
  const files = await walk(root);
  const violations = [];

  for (const file of files) {
    if (normalize(path.relative(root, file)).startsWith("research-prototype/"))
      continue;
    const contents = await readFile(file, "utf8");
    violations.push(...boundaryViolations(root, file, importSources(contents)));
  }

  return violations;
}

const invokedDirectly =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  const violations = await checkRepositoryBoundaries();
  if (violations.length > 0) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Architecture boundary check passed.");
  }
}
