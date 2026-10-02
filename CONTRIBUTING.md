# Contributing

Console UI develops through small changes validated by real product use.

## Before proposing a shared component

Confirm which category the work belongs to:

1. **Foundation** — token, typography, focus, layout, or accessibility behavior.
2. **Primitive** — reusable interaction such as a button, input, dialog, or tab.
3. **Console pattern** — operational composition such as a filter bar, metric
   card, job status, data table, or log viewer.
4. **Product component** — an application-specific workflow or domain view.

Product components stay in their product repositories. Foundations and
primitives may be shared immediately when their contract is clear. Console
patterns normally need either two real consumers or a documented reason they
are fundamental to every console.

## Component maturity

Shared components move through:

```text
experimental -> stable -> deprecated -> removed
```

### Experimental

- API may change.
- Has a named owner and at least one real consumer.
- Has representative stories and basic accessibility coverage.
- Is exported from an explicit experimental entry point.

### Stable

- Has been validated by two products, unless it is a foundational primitive.
- Has documented behavior, variants, and failure or empty states.
- Has unit or interaction tests.
- Has visual coverage for supported themes and density.
- Has an accessible name, keyboard behavior, and focus behavior where relevant.

### Deprecated

- Remains available for a documented migration window.
- Emits a development warning when practical.
- Includes a replacement and migration note.

## Pull requests

Each pull request should describe:

- the user or developer problem;
- why the change belongs in Console UI;
- affected packages and public interfaces;
- known consumer impact;
- validation performed;
- migration requirements;
- screenshots or Storybook links for visual changes.

Do not combine a component extraction with unrelated product behavior changes.

Package-facing changes also include a Changesets release intent:

```sh
npm run changeset
```

Select only `@gruznov/design-tokens` and/or `@gruznov/console-ui`. Choose the
semantic bump from the consumer-visible impact and commit the generated
Markdown file with the implementation. Documentation-only, Storybook-only,
test-only, and repository-maintenance changes normally do not need a changeset.
See the [release process](docs/release-process.md) for the complete policy and
the registry gate.

## Consumer adoption

Products consume versioned releases. Updating a component in this repository
must not silently change an application that has not upgraded its dependency.

Consumer-specific adapters, data transformations, and routing remain local to
the consumer repository.
