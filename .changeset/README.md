# Changesets

Changeset files record package-facing changes before versions and changelogs
are generated.

Run `npm run changeset` for a public token, component, CSS, export, or package
contract change. Documentation, Storybook-only, test-only, and repository
maintenance changes do not require a package release intent unless they alter
the shipped artifact or its supported behavior.

Do not run or add a publish command while CUI-001A remains incomplete. Package
manifests stay `private: true`, and the repository intentionally has no publish
workflow.

See [the release process](../docs/release-process.md) for bump policy, release
gates, and maintainer steps.
