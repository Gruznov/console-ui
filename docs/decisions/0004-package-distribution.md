# ADR 0004: Package distribution

Status: new public identities selected; first registry publication pending

## Decision

Use the new package names `@gruznov/design-tokens` and
`@gruznov/console-ui` and keep the npm registry as the intended distribution
channel. Build versioned artifacts from this repository with explicit public
exports and package-content validation.

The public source snapshot does not change existing npm package visibility or
trusted-publisher settings. Do not assume a version can be installed publicly
until registry access and publication have been verified. The new source
versions are release candidates until publication is verified.

## Release boundary

Changesets records semantic-version intent. The repository can build and validate
artifacts without publishing them. Registry migration and release activation are
separate operations described in the [release process](../release-process.md).

An enabled publisher should use a narrowly scoped identity, explicit releases,
and reviewed package contents. Publishing must not alter consumer applications
or their deployments automatically.

## Consequences

- Consumers must migrate dependencies and imports from `@polyconsole/*` to
  `@gruznov/*`; existing private registry history stays private.
- Public source visibility and npm package access are managed separately.
- Applications adopt explicit versions through their own dependency updates.
- A release needs registry and publisher verification in addition to passing
  local build checks.
