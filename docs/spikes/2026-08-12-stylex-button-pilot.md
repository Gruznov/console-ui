# StyleX Button production pilot

Date: 2026-08-12

Status: historical implementation pilot; accepted in ADR 0005

Measurements below describe the pilot fixture and are not current package metrics.

## Purpose

This is the second production StyleX pilot for Console UI, layered on the
generalized StyleX package build established by the Badge pilot.

It tests the two questions Badge intentionally left open:

1. can the generalized build handle multiple StyleX-authored production entry
   points at the same time?;
2. can a substantially more interaction-heavy component family preserve its
   existing behavior and visual contract when authored with StyleX?

The migrated family is `Button`, `ActionLink`, and `IconButton`.

## Experimental controls

The public contract is unchanged:

- the same React component APIs and TypeScript types;
- the same `data-console-*` DOM attributes;
- the same semantic `--console-*` tokens;
- the same consumer `className` and inline `style` escape hatches;
- the same ready-to-import package `styles.css`;
- no StyleX compiler or runtime requirement for consumers.

The existing full light/dark Button screenshot remains in the visual suite.
Before changing the implementation, the pilot also captured dedicated legacy
screenshots for three interaction states after a normal package build:

- pointer hover;
- pointer active/pressed;
- keyboard `:focus-visible`.

Those baselines were committed before the production Button source was migrated,
so the final StyleX implementation cannot define its own acceptance images.

## Authoring pattern

Button has more runtime variants than Badge. To preserve the zero-runtime
property, the source precomputes every size / variant / expanded combination
with static `stylex.props()` calls.

The matrix covers:

- sizes: `sm`, `md`, `lg`;
- variants: `primary`, `secondary`, `ghost`, `danger`;
- collapsed and expanded presentation.

That yields 24 statically compiled combinations. Runtime rendering only indexes
an already-compiled props object based on `size`, `variant`, and
`aria-expanded`; it does not call `stylex.props()`.

The implementation also preserves the old interaction selector semantics with
same-file constants such as `:hover:not(:disabled)` and
`:active:not(:disabled)`.

## Plain-CSS escape hatch

`button.escape.css` deliberately retains rules that are clearer as structural or
accessibility CSS:

- sizing arbitrary consumer-provided child SVGs;
- IconButton descendant sizing and pending-content suppression;
- pending cursor behavior;
- `prefers-reduced-motion` overrides;
- forced-colors borders and focus treatment.

The generalized build discovers this file automatically; there is no
Button-specific build configuration.

## Multi-entry build result

The generalized package build successfully discovered Badge and Button together
and reported:

- StyleX production entries: **2**;
- aggregate StyleX CSS: **7,581 raw bytes**;
- discovered `*.escape.css` files: **2**;
- StyleX runtime contribution to emitted component JavaScript: **0 bytes**.

For comparison, the Badge-only build emitted 2,514 raw bytes of StyleX CSS. The
second, substantially more stateful component therefore increases the aggregate
atomic output while preserving the same runtime-free distribution boundary.

The package-level zero-runtime guard remains global: if any discovered
StyleX-authored module leaves a StyleX runtime contribution or an
`@stylexjs/stylex` / `stylex.create` / `stylex.props` reference in emitted JS,
the build fails.

## Package validation result

The migration finalization run passed the generalized multi-entry build and the
complete workspace check:

- **52 / 52** Node/package tests pass;
- Button and IconButton native semantics pass;
- ActionLink native/router composition passes;
- the Button StyleX artifact test passes;
- generalized StyleX discovery/runtime/escape-hatch guardrails pass;
- package contents validate;
- release metadata and tarballs validate;
- Storybook builds;
- the reference console builds.

Legacy Button component rules were removed from source `styles.css`; they
were not retained to mask missing StyleX output.

## Final acceptance gate

The acceptance criterion was a normal pull-request CI run passing the
Playwright suite against the pre-migration screenshots. The pilot exercised five
visual scenarios, including the dedicated Button interaction-state test.

Passing the full light/dark Button baseline plus hover, active, and keyboard-focus
baselines without updating screenshots establishes both
multi-entry build viability and interaction-state parity for the hardest
representative primitive tested so far.

Package build success alone does not establish visual parity. See
[ADR 0005](../decisions/0005-css-delivery.md) for the retained architecture contract.
