# ADR 0005: Ship ready-to-import component CSS

Status: accepted

Date: 2026-08-06

## Context

Applications may combine utility CSS, existing global stylesheets, or no CSS
framework. A shared package needs an explicit delivery contract that supports
those combinations.

Shipping Tailwind component source would require each consumer to register the
external package with `@source`. Tailwind excludes dependencies from automatic
source detection by default. That contract would couple Console UI output to
every consumer's Tailwind version, scanning configuration, theme, and build
pipeline.

The delivery spike compiled equivalent source successfully with Tailwind 4.2.1
and 4.3.0, but the explicit consumer configuration was required in both cases.
The ready-to-import fixture required no consumer Tailwind processing and could
keep all component selectors package-scoped.

## Decision

`@gruznov/console-ui` ships ready-to-import component CSS through:

```text
@gruznov/console-ui/styles.css
```

`@gruznov/design-tokens` independently ships:

```text
@gruznov/design-tokens/tokens.css
```

The styling contract is:

- consumers import tokens before component styles once at the application root;
- distributed CSS contains no Tailwind directives and requires no `@source`;
- component selectors use a package-owned `console` prefix or
  `data-console-ui` attribute; internal StyleX output may also use generated
  atomic classes contained in the package-owned component layer;
- shared visual values are read from `--console-*` semantic variables;
- package CSS contains no reset, Preflight, unscoped element typography, or
  product selector;
- token and component rules declare the `console.tokens` and
  `console.components` cascade layers;
- product overrides are deliberate and live in the consumer repository;
- Tailwind may be used to author or build the library, but is not part of the
  consumer runtime contract.

Component JavaScript must not silently inject global CSS. Each consumer owns the
root import location and can therefore control layer order during incremental
migration.

### Internal StyleX authoring — 2026-09-23

The Badge and Button pilots are accepted for integration. This covers
`Badge`/`StatusBadge` and `Button`/`ActionLink`/`IconButton`; it does not mandate
migration of other components.

StyleX is an internal build-time authoring tool. The package build must emit
ready-to-import CSS under `console.components`, preserve semantic tokens and
the existing component API, and reject any retained StyleX runtime code.
Consumers need no StyleX compiler, runtime dependency, or public `xstyle` prop.
Relational selectors and platform overrides may remain in automatically
collected `*.escape.css` files under the same component layer. Package tests
and visual regression checks must cover the compiled consumer artifacts.

The isolated authoring fixture remains research evidence, outside the shipped
packages. Its measured runtime residue is not permitted in production output.
Further component migrations require their own focused PR and checks.

Tailwind consumers must declare the complete cascade before tokens, component
styles, or Tailwind register an individual layer. An example integration order
is:

```css
@layer theme, base, console.tokens, components, console.components, utilities, console.product;
```

This is a consumer integration contract, not package CSS: Tailwind reset stays
below Console UI components, Tailwind utilities can still customize shared
compositions, and explicit product overrides retain the highest precedence.

## Consequences

### Positive

- the same artifact works in Tailwind and non-Tailwind consumers;
- upgrades do not depend on consumer content scanning;
- consumers can adopt components alongside existing stylesheets;
- consumers are not forced to choose Tailwind;
- package styles can be inspected and tested as a release artifact;
- tokens remain reusable by future public UI without React components.

### Negative

- the package build must generate, minify, and validate CSS;
- consumers must make one explicit root-level import;
- intentional consumer overrides require documented cascade-layer ordering;
- unused component CSS may initially be delivered together until evidence
  justifies per-component entry points.

## Alternatives considered

### Ship Tailwind source

Rejected as the default because every consumer must register package source and
share compatible Tailwind build behavior.

### Ship source and compiled CSS as equal public contracts

Rejected because two styling contracts double the support and regression
surface. Source fixtures may remain internal for build validation.

### CSS-in-JS runtime injection

Rejected because it adds runtime behavior, complicates server rendering, and
makes consumer cascade control less explicit.

### Copy shadcn-style component source into consumers

Rejected because fixes and visual changes would no longer propagate through a
versioned shared dependency.

## Evidence

See the [package and CSS delivery spike](../spikes/2026-08-06-package-css-delivery.md)
and its [reproducible fixture](../../spikes/css-delivery/README.md).

## Reference

- [Tailwind CSS: Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
