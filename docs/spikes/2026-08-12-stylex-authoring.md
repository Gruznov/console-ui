# StyleX as an internal Console UI authoring layer

Date: 2026-08-12
Status: historical authoring experiment; followed by the Badge and Button pilots

This report describes an isolated fixture. Its measurements are not current
production bundle benchmarks. See the subsequent [Badge pilot](2026-08-12-stylex-badge-pilot.md)
and [Button pilot](2026-08-12-stylex-button-pilot.md) for the runtime-free build pattern.

## Hypothesis

StyleX may be useful for Console UI without becoming part of the consumer build
contract.

ADR 0005 already made a strong distribution decision: Console UI consumers get
ready-to-import CSS and should not have to share the library's authoring
pipeline. The StyleX experiment therefore tests **internal authoring and static
extraction** while preserving the consumer build contract.

A successful result should preserve all of these:

- `@gruznov/design-tokens` remains framework-independent;
- existing `--console-*` semantic variables remain the theming surface;
- consumers still import a compiled stylesheet once;
- consumers do not configure a StyleX compiler;
- `className` and `style` remain usable integration escape hatches;
- CSS can remain CSS where it is clearer than manufacturing React state/context
  solely for styling.

Meta's Astryx design system uses a related distribution shape: components are
authored with StyleX and ship compiled CSS, while StyleX itself remains a
runtime/peer dependency where composition still needs it.

## Representative scope

The reproducible fixture in `spikes/stylex-authoring/` ports five families from
the real package:

- Button / ActionLink / IconButton;
- Badge / StatusBadge;
- Card and its sections;
- Separator;
- DataTableFrame and table primitives.

The fixture uses current Console UI semantic tokens rather than inventing a
parallel theme.

## Execution results

`npm run verify` completed all of the following:

- TypeScript typecheck against StyleX 0.19.0;
- StyleX extraction with `@stylexjs/unplugin` and esbuild;
- standalone `dist/styles.css` generation;
- verification of existing `--console-*` semantic tokens;
- verification that compiled JS does not import the stylesheet as a side
  effect;
- verification that StyleX priority layers are nested inside the existing
  `console.components` cascade boundary;
- verification of the explicit plain-CSS escape hatch.

### Measured fixture output

These are raw, non-minified fixture numbers and should not be treated as
production bundle benchmarks:

| Metric | Result |
| --- | ---: |
| Compiled JS | 24,204 bytes |
| Compiled CSS | 11,583 bytes |
| Plain-CSS escape hatch | 2,424 bytes |
| Escape-hatch share of CSS | 20.9% |
| Unique atomic classes | 154 |
| Relational-selector signals in escape hatch | 10 |
| StyleX runtime bytes in JS | 4,982 bytes |
| StyleX runtime share of JS | 20.6% |

The runtime contribution comes from
`node_modules/@stylexjs/stylex/lib/es/stylex.mjs` in this bundle.

## Findings

### 1. Distribution architecture is compatible with ADR 0005

Nothing in ADR 0005 requires the source authoring format itself to be CSS. The
important contract is the artifact boundary: a ready-to-import stylesheet,
semantic CSS variables, and no component-side stylesheet injection.

The spike compiles StyleX internally and wraps StyleX's priority layers inside
the existing `console.components` layer. The structural escape hatch is emitted
as `console.components.escape`, a later sibling in the same namespace.

Consumers therefore do **not** need StyleX compiler configuration. This is the
strongest argument for continuing the experiment.

### 2. Co-location is materially clearer on variants

Button sizes/variants, badge tones, card sizes, and separator orientation read
more directly when the variant map and its style declarations live beside the
component implementation. This removes a class of navigation between TSX and a
large selector file.

This is a maintainability benefit, not a performance claim.

### 3. The plain-CSS remainder is meaningful but not alarming

The first implementation leaves 20.9% of generated CSS in
`src/escape-hatch.css`.

It currently contains:

- arbitrary child icon sizing (`> svg`);
- `CardHeader:has(CardAction)`;
- card-size propagation into child sections;
- table body/row relationships;
- ancestor-controlled sticky headers.

This 20.9% should be treated as an **upper bound**, not an expected final ratio.
Current StyleX supports relational conditions via `stylex.when.*`, and same-file
selector constants can express selectors such as `:not(:has(...))`. Meta's
Astryx uses that technique in production source.

A second pass should migrate only the cases that become clearer in StyleX and
keep genuinely CSS-shaped rules in CSS. Reaching 0% plain CSS is not a goal.

### 4. Existing `className` / `style` escape hatches are feasible, but need a contract

StyleX's general authoring guidance discourages casually mixing `className` and
`style` with `stylex.props()`. Console UI intentionally exposes these as
integration escape hatches.

This is not a blocker. Astryx solves the same problem with an explicit
`mergeProps` helper that combines stable classes, StyleX output, consumer
classes, and consumer inline styles in a defined order. The spike currently has
a smaller equivalent helper.

If Console UI adopts StyleX, this merging behavior should become a tested
library primitive rather than repeated ad hoc in components.

### 5. StyleX surfaced an existing visual contract that is easy to lose

The current Button CSS uses `:hover:not(:disabled)` and
`:active:not(:disabled)`. A naive StyleX port using independent `:hover` and
`:active` conditions changes disabled-button visuals even though the component
looks correct in its default state.

The spike preserves the current contract using statically evaluated same-file
selector constants. This is exactly the kind of edge case that argues for
visual parity tests before any production migration.

### 6. StyleX is not zero-runtime in this fixture

This is the most important negative result.

The compiled fixture contains 4,982 raw bytes from the StyleX runtime, 20.6% of
the non-minified JS bundle. Dynamic variant composition and remaining
`stylex.props()` work prevent StyleX from disappearing completely.

The absolute cost is small in this five-family fixture, but it changes the
architectural claim: StyleX can remain hidden from the **consumer build
pipeline**, but it is not currently a purely build-time implementation detail.

Before production adoption we should test whether a slightly different authoring
shape can reduce or eliminate runtime composition without making component
source worse. If not, the runtime should be accepted explicitly as a library
cost rather than assumed away.

## Decision rule

Do **not** migrate Console UI merely because the experiment compiles.

Proceed to a production pilot only if all of the following hold:

1. the current consumer CSS contract survives unchanged;
2. the plain-CSS escape hatch stays clearly minority-sized;
3. Button/Badge/Card/Table source is easier to navigate, not merely more typed;
4. visual parity can be demonstrated with existing Storybook/Playwright
   fixtures;
5. StyleX compiler configuration stays package-internal;
6. the remaining runtime cost is either reduced or explicitly judged acceptable.

If those conditions hold, the next step should be **one production component
family**, probably Badge first and Button second, not a repository-wide
migration. Badge is the safer pilot because it exercises semantic variants
without Button's larger interaction-state surface.

## Current recommendation

**Continue to a Badge production pilot, but do not adopt StyleX repository-wide.**

The experiment is stronger than a source-only prototype: StyleX 0.19.0 really
compiled the representative components, produced standalone CSS compatible with
Console UI's existing layer/token contract, and passed its dedicated verifier.
The authoring model is noticeably clearer for variant-heavy components.

The two costs are now concrete rather than theoretical: roughly one fifth of
this first-cut CSS remains in the explicit CSS escape hatch, and the current
fixture carries about 5 KB raw of StyleX runtime. Neither is a blocker by
itself, but both should be tested against a single real component before making
an architectural decision.
