# StuPilot rebrand handoff

## Repository scope completed

The active public product name is `StuPilot` in Arabic and English. The owner has purchased `stupilot.com`. This repository change does not claim that the domain is live, connected, deployed, or serving the application.

No DNS, hosting, deployment, Supabase resource, external account, provider application, Git remote, or repository folder was changed.

## Separately authorized external follow-up

- Configure Namecheap DNS only after a hosting target, verification records, rollback plan, and owner approval exist.
- Create or select hosting, then connect `stupilot.com` and verify HTTPS, canonical origins, authentication callbacks, email links, and rollback behavior.
- Review the GitHub repository display name and remote URL together so clones, CI, links, and automation remain consistent.
- Review Supabase organization/project display names separately. Keep the project reference, URL, keys, identity subjects, and database identifiers stable unless a provider migration is explicitly approved.
- Configure an approved email service and StuPilot sender identity only after domain verification and deliverability/security review.
- Use StuPilot as the future public display name for Apple and Google applications. Treat bundle IDs, package IDs, signing identities, store records, and OAuth client IDs as stable identifiers once created.
- Review package publishing accounts only if publishing is later authorized; the current npm package remains private.

## Identifiers that remain stable

- Existing PostgreSQL database/user names, Compose volume names, tables, columns, enums, migrations, and recovery references.
- Environment-variable names and their validation contracts.
- Authentication cookie/session names and behavior.
- Internal user UUIDs, provider keys/subjects, generated IDs, and test identity prefixes.
- Historical branch names, commits, repository paths, audit evidence, archived research, and the disposable historical prototype.
