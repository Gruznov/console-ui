# Open Decisions

## Public package distribution

The repository is public, but that alone does not migrate npm package access or
publishing identity. Confirm registry access, publisher configuration, and a
validated release before documenting public installation as available. See the
[release process](release-process.md).

## License and support policy

Repository visibility does not establish reuse terms. A license and any external
support or compatibility commitments require an explicit maintainer decision.
Do not infer them from the presence of source code or examples.

## Browser support

Automated browser checks exercise the configured Playwright Chromium build.
A broader browser support matrix needs explicit targets and validation before
it can be promised to consumers.

## Service switching

Service and environment identity are required. A shared cross-service switcher
requires a demonstrated contract for destinations, independent deployments,
sessions, and authorization. Keep those decisions in consumer applications until
that contract is established.

## Further component extraction

Promote patterns from real use only when a reusable API and accessibility
contract are clear. The reference console is a synthetic fixture and does not,
by itself, demonstrate adoption by multiple applications.
