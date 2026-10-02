# ADR 0001: Repository and package ownership

Status: accepted for the public source snapshot

## Decision

Maintain shared source in `Gruznov/console-ui`, independently from consumer
applications. Preserve the package names `@gruznov/design-tokens` and
`@gruznov/console-ui` so the repository move does not also require changing
consumer imports.

GitHub repository ownership and npm package identity are separate. Public source
visibility does not automatically change registry access or publishing identity.
See [Package distribution](0004-package-distribution.md).

## Consequences

- No consumer application owns the shared source tree or controls its runtime.
- Applications adopt explicit versions and keep independent deployments.
- The public repository contains neutral code, examples, and technical guidance.
- Demo service names and synthetic data make no claim about real integrations.
- Registry administration and repository administration remain separate tasks.
