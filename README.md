# Console UI

React components and framework-independent design tokens for dense operational
consoles. Console UI provides accessible controls, table presentation, feedback
states, and a composable application shell. Applications retain their own
routing, authentication, APIs, domain models, and deployment.

## Status

This repository prepares public packages `@gruznov/console-ui@0.7.1` and
`@gruznov/design-tokens@0.2.1`. Publication remains disabled until the first
public canary and npm trusted publishers are configured. These source versions
are release candidates, not a claim that they are already available on npm.

Existing consumers of `@polyconsole/*` must update dependencies and imports.
The old registry packages remain separate and private. See the
[release process](docs/release-process.md) for first publication and migration.

Storybook is the component workbench. The examples use fictional service
identities and synthetic operational data. Atlas, Beacon, and Compass in the
stories do not identify supported integrations or external users. The reference
console validates package consumption through a synthetic worker interface.

## Development

Use Node.js 22.12 and npm 10.9 for the pinned development baseline:

```sh
git clone https://github.com/Gruznov/console-ui.git
cd console-ui
npm ci
npm run check
```

Start either development surface:

```sh
npm run storybook
npm run reference
```

The workspace resolves its own packages locally. Generated package files live in
each package's `dist/` directory and are not committed. Focused commands cover
formatting, linting, typechecking, tests, package builds, and artifact validation.
See [visual regression](docs/visual-regression.md) for browser setup and checks.

Package-facing changes use `npm run changeset`. `npm run release:status`
inspects pending version changes; `npm run release:check` validates built
artifacts without publishing them.

## Packages and examples

| Directory | Role |
| --- | --- |
| [`packages/design-tokens`](packages/design-tokens/README.md) | Semantic CSS variables and token metadata, with no React dependency |
| [`packages/console-ui`](packages/console-ui/README.md) | React controls, shell, navigation, tables, forms, and feedback |
| [`apps/storybook`](apps/storybook/README.md) | Isolated component stories and visual fixtures |
| [`examples/reference-console`](examples/reference-console/README.md) | A synthetic application fixture using public package entry points |

Consumers import the two compiled stylesheets once at their application root:

```css
@import "@gruznov/design-tokens/tokens.css";
@import "@gruznov/console-ui/styles.css";
```

No consumer-side StyleX or Tailwind compilation is required.

## Documentation

- [Product requirements](docs/product-requirements.md)
- [Design principles](docs/design-principles.md)
- [Architecture](docs/architecture.md)
- [Semantic token schema](docs/token-schema.md)
- [Theme foundations](docs/theme-foundations.md)
- [Status and focus semantics](docs/status-focus-semantics.md)
- [Service and environment identity](docs/context-identity.md)
- [Button primitives](docs/button-primitives.md)
- [Badge primitives](docs/badge-primitives.md)
- [Card primitives](docs/card-primitives.md)
- [Separator primitive](docs/separator-primitive.md)
- [Table primitives](docs/table-primitives.md)
- [Data table frame](docs/data-table-frame.md)
- [Tabs primitives](docs/tabs-primitives.md)
- [Form primitives](docs/form-primitives.md)
- [Selection and progress](docs/selection-and-progress.md)
- [Feedback states](docs/feedback-states.md)
- [Console shell and page grammar](docs/console-shell.md)
- [Release process](docs/release-process.md)
- [Package and CSS delivery spike](docs/spikes/2026-08-06-package-css-delivery.md)
- [Open decisions](docs/open-decisions.md)
- [Architecture decisions](docs/decisions/README.md)
- [Contribution workflow](CONTRIBUTING.md)

## Design boundaries

Share presentation and interaction behavior while keeping application state and
business logic local to each consumer. Use semantic tokens, visible service and
environment labels, keyboard-accessible controls, and explicit loading, stale,
unavailable, and error states. Prefer a small documented API over speculative
wrappers. Applications upgrade released dependencies explicitly and remain
independently buildable and deployable.

Console UI is not a backend, authentication service, microfrontend host, or
deployment platform.
