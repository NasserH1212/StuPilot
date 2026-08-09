# StuPilot architecture decision records

ADRs record decisions for the production application. `Accepted` decisions govern current work; `Proposed` decisions define an evaluation path but do not authorize a vendor or implementation.

| ADR                                                             | Decision                             | Status                                   |
| --------------------------------------------------------------- | ------------------------------------ | ---------------------------------------- |
| [0001](0001-production-repository-structure.md)                 | Production repository structure      | Accepted                                 |
| [0002](0002-nextjs-modular-monolith.md)                         | Next.js modular monolith             | Accepted                                 |
| [0003](0003-runtime-and-package-manager.md)                     | Runtime and package manager          | Accepted                                 |
| [0004](0004-localization-routing.md)                            | Localization and locale routing      | Accepted                                 |
| [0005](0005-css-and-design-tokens.md)                           | CSS and design tokens                | Accepted                                 |
| [0006](0006-postgresql-and-prisma.md)                           | PostgreSQL and Prisma                | Accepted                                 |
| [0007](0007-migration-workflow.md)                              | Migration workflow                   | Accepted                                 |
| [0008](0008-testing-stack.md)                                   | Testing stack                        | Accepted                                 |
| [0009](0009-environment-and-secret-separation.md)               | Environment and secret separation    | Accepted                                 |
| [0010](0010-provider-adapter-strategy.md)                       | Provider adapter strategy            | Accepted                                 |
| [0011](0011-hosting-evaluation-plan.md)                         | Hosting evaluation plan              | Proposed                                 |
| [0012](0012-managed-authentication-evaluation.md)               | Authentication provider direction    | Proposed                                 |
| [0013](0013-uuid-strategy.md)                                   | UUID strategy                        | Accepted                                 |
| [0014](0014-week-start-and-time-zone.md)                        | Week start and time-zone baseline    | Accepted                                 |
| [0015](0015-research-prototype-isolation.md)                    | Research-prototype isolation         | Accepted                                 |
| [0016](0016-production-authentication-and-identity-boundary.md) | Authentication and identity boundary | Accepted architecture / provider pending |

Superseded decisions remain in this directory with their status and replacement link; accepted records are not silently rewritten when the decision changes.
