# Console UI Architecture

## Package boundaries

Console UI is a versioned design-system dependency. Shared packages must never
import from a consumer application.

| Package | Owns | Must not own |
| --- | --- | --- |
| `@gruznov/design-tokens` | Semantic CSS variables, theme values, token metadata | React, application configuration, domain models |
| `@gruznov/console-ui` | React components, accessible interactions, shell and layout presentation | Routing, authorization, API clients, polling, deployments |

React and React DOM are peer dependencies of the component package. Next.js is
not a package dependency. Applications supply router adapters, data, commands,
and providers through ordinary React composition.

The repository lives at `Gruznov/console-ui`. Repository ownership and the
`@gruznov` package namespace are separate contracts. See
[ADR 0001](decisions/0001-repository-and-ownership.md).

## Workspace

The root uses npm workspaces and one lockfile:

- `packages/design-tokens`: semantic token sources and metadata;
- `packages/console-ui`: shared component sources;
- `apps/storybook`: isolated stories and deterministic visual fixtures;
- `examples/reference-console`: a synthetic application fixture;
- `scripts`: build and artifact validation;
- `tests`: package, behavior, and boundary contracts;
- `docs`: component guidance and architecture decisions.

Only the two packages form the distribution surface. Examples and stories do
not form stable component APIs. See
[ADR 0006](decisions/0006-workspace-tooling.md).

## Components and application state

Components accept display-oriented values and small neutral state contracts.
An application maps domain states to labels, status tones, and disabled or
pending controls. Console UI must not infer health or permissions from raw
records, perform mutations, or access application runtime files.

A shared component belongs here when its presentation or interaction contract
is reusable. Domain views remain in applications. The component maturity and
review rules are documented in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Shell and navigation

`ConsoleShell` composes service identity, navigation, a workspace, and optional
application-owned slots. `ConsolePageHeader` provides page title, description,
status, and action regions. Neither component loads application data.

Navigation receives explicit URLs and current-item state. The default renderer
uses native anchors; a framework adapter can supply links while preserving the
provided accessibility attributes. Product providers wrap the shell or are
composed inside its slots. See [Console shell](console-shell.md) for the current
API rather than treating architecture examples as additional exports.

The shell always exposes service and environment identity as visible text.
Color and marks reinforce that identity. The Storybook fixtures use
fictional Atlas, Beacon, and Compass descriptors to exercise the same shared
contract with different service tones. These are demonstration data, not
package presets or real integrations.

## Styling and tokens

Components use role-based `--console-*` variables. Theme and context values
remain independent from application branding and domain state. The token
inventory is documented in [Semantic token schema](token-schema.md).

Consumers import compiled styles once:

```css
@import "@gruznov/design-tokens/tokens.css";
@import "@gruznov/console-ui/styles.css";
```

The artifact contains no reset, Preflight, Tailwind directives, or unscoped
application styles. Selectors belong to the package and use the
`console.tokens` and `console.components` cascade layers. Internal StyleX
compilation is a build concern, with no consumer compiler configuration.

A Tailwind application should declare its full layer order before either
stylesheet registers a layer. An example integration order is:

```css
@layer theme, base, console.tokens, components, console.components, utilities, console.product;
```

This places reset styles below shared components, utility overrides above them,
and deliberate application overrides last. Non-Tailwind applications can
use only the layers they need. See
[ADR 0005](decisions/0005-css-delivery.md).

## Releases

The source snapshot retains existing package names and source versions. A public
repository does not make existing registry packages public. Registry migration
and trusted-publisher setup are separate work, as described in
[ADR 0004](decisions/0004-package-distribution.md) and the
[release process](release-process.md).

Releases use explicit versions, Changesets, reproducible builds, package-content
validation, and migration notes for breaking changes. Consumers choose when to
upgrade. Publishing a package must never deploy an application implicitly.

## Validation

Shared contracts are checked with TypeScript, Node tests, package artifact
checks, Storybook builds, the reference application, and deterministic Playwright
screenshots. Applications retain their own integration and smoke tests.

Icons remain React composition slots. Heavy visualization dependencies,
application-specific branding, and backend workflows stay outside the core
package.
