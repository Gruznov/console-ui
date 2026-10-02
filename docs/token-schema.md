# Semantic Token Schema

Machine-readable source:
[`packages/design-tokens/src/token-inventory.json`](../packages/design-tokens/src/token-inventory.json)

## Purpose

Console UI names visual decisions by their operational role. Consumers should
be able to change theme, service identity, or environment without components
knowing a raw color or product-specific brand name.

This schema defines names and ownership. Values are documented in
[Theme foundations](theme-foundations.md),
[Status and focus semantics](status-focus-semantics.md), and
[Service and environment identity](context-identity.md).

## Contract

- Every public CSS custom property begins with `--console-`.
- A token name describes a role such as `surface-canvas`, not a visual value
  such as `gray-950` or a product such as `product-blue`.
- The JSON inventory is versioned independently from package releases through
  `schemaVersion`.
- A public CSS name is derived as
  `cssPrefix + group.name + "-" + token.name`.
- `type` describes the kind of value the token will accept.
- `valueScope` states where a value may vary:
  - `theme` varies between light and dark themes;
  - `foundation` is shared by themes and services;
  - `context` is supplied by a service or environment descriptor.
- `valuesMilestone` identifies the roadmap item that is responsible for adding
  and validating values. A token may override its group's milestone when a
  safety-sensitive subset needs separate validation.

The inventory is available to tools and consumers through the package export
`@gruznov/design-tokens/token-inventory.json`. Components consume the CSS
variables rather than importing JSON at runtime.

## Families

| Family | Intended use |
|---|---|
| `surface-*` | workspace, panels, quiet regions, selections, and overlays |
| `text-*` | primary, supporting, muted, disabled, inverse, and link text |
| `border-*` | separators and structural or interactive boundaries |
| `action-*` | neutral, primary, and destructive action states |
| `status-*` | neutral, informational, successful, warning, and danger states |
| `focus-*` | keyboard-focus visibility |
| `service-*` | current product identity without product-specific token names |
| `environment-*` | runtime context reinforced by visible text |
| `font-*`, `line-height-*` | compact console typography and numeric scanning |
| `space-*`, sizing tokens | a restrained spacing scale and scan-first sizing |
| `radius-*`, `shadow-*` | surface shape and elevation |
| motion and opacity tokens | consistent feedback and disabled treatment |

Status families contain separate text, surface, and border roles. A component
must not derive one from another or use a status color as the only signal.

## Density baseline

The schema records `compact` as the baseline density. It is the normal Console
UI grammar for dashboards with many rows, metrics, filters, and identifiers,
not an optional miniature mode.

Compact does not mean cramped:

- `control-height` and `row-min-height` govern visible density;
- `hit-target-min` preserves a larger interactive hit area where needed;
- typography remains readable instead of being reduced to fit more content;
- hierarchy comes from alignment, weight, and quiet separators before cards
  and padding are added;
- tabular numeric settings support column scanning.

The schema does not expose density selectors or named alternatives. A second
density profile should become public only after a real consumer demonstrates
the need.

## Consumer and component rules

Shared components:

1. consume semantic variables from this inventory;
2. may compose foundation scale tokens internally;
3. must not publish raw palette names as component props;
4. must not silently fall back to product-owned variables;
5. keep unavailable, stale, synthetic, and missing states distinct from
   success.

Products may override theme or context values at their application boundary.
They should not redefine token meaning inside individual screens.

Service and environment attributes are required context boundaries. The token
package does not invent a default identity when a boundary is missing.

## Deliberate omissions

The first inventory does not include chart-series palettes, public-site brand
tokens, layout widths, or component-specific aliases. Those should be added
only with a real Console UI consumer and the same naming and validation rules.
