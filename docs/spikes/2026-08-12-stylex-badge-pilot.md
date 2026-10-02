# StyleX Badge production pilot

Date: 2026-08-12

Status: historical pilot, followed by the Button pilot

Measurements and check counts below describe that experiment, not the current
workspace. The accepted build contract is recorded in
[ADR 0005](../decisions/0005-css-delivery.md).

## Purpose

This work tests StyleX on one real stable Console UI component family and then
asks whether the successful component experiment can become a reusable package
build architecture. `Badge` and `StatusBadge` keep their existing public API,
semantic tokens, DOM data attributes, `className` / `style` escape hatches, and
package-level `styles.css` delivery contract.

No consumer is asked to configure StyleX.

## Experimental controls

The visual comparison is anchored to the pre-migration implementation. An
initial baseline attempt was discarded after review showed that it had been
captured after `npm ci` but before `npm run build`; comparing that artifact state
with the normal CI lifecycle produced a misleading large pixel diff.

The corrected baseline was generated in a separate worktree from clean
`origin/main`, after both `npm ci` and `npm run build`. The StyleX Badge pilot
passes that corrected legacy baseline.

Two CSS-shaped Badge rules intentionally remain outside StyleX in
`badge.escape.css`:

- sizing arbitrary consumer-provided child SVGs;
- the forced-colors system border.

## Static-composition result

The first multi-component StyleX spike retained about 5 KB of raw StyleX runtime
because dynamic component variants called `stylex.props()` at runtime.

Badge uses a stricter pattern: all generic and tone-specific compositions are
created statically. Runtime code only selects an already-compiled props object
for the requested tone.

This worked. The production build reports:

- generated StyleX CSS: **2,514 bytes raw**;
- discovered StyleX entries: **1**;
- discovered plain-CSS escape files: **1**;
- StyleX runtime in emitted component JavaScript: **0 bytes**.

StyleX remains a workspace devDependency rather than a runtime dependency of
`@gruznov/console-ui`.

## Badge validation result

The production component pilot passed its full validation against the corrected
legacy baseline:

1. `npm ci` succeeds from the committed lockfile;
2. package, release, Storybook, and reference-console builds succeed;
3. the Badge light/dark screenshot passes the corrected legacy baseline;
4. all existing visual-regression scenarios remain green.

## Generalized build experiment

The initial production pilot used deliberately temporary component-specific
plumbing: one Badge-only esbuild call plus a list of legacy Badge selectors to
strip from the distributed stylesheet. That was adequate for proving StyleX on
a real component but would become technical debt if copied for every migration.

Several package-level compilation shapes were tested before changing the
permanent build:

1. StyleX CLI directly on `src` was rejected because the CLI attempted to parse
   the TypeScript source without the workspace's TypeScript Babel parsing setup.
2. StyleX CLI after `tsc` was rejected because it also attempted to transform
   emitted `.d.ts` files. A JS-only staging directory could work around this,
   but would complicate source-map ownership for little benefit.
3. A single `@stylexjs/unplugin` + esbuild pass with automatic source discovery
   and `bundle: false` successfully emitted one aggregated `stylex.css`, but an
   unused `@stylexjs/stylex` import remained in emitted JavaScript.
4. The same single-pass architecture with `bundle: true`, tree shaking, and all
   normal package/relative imports kept external removed the StyleX runtime
   import while preserving the Console UI module graph. The probe emitted the
   expected **2,514-byte** Badge CSS and no StyleX runtime reference in JS.

The fourth shape became the generalized package build.

## Generalized package pipeline

The package build now follows this sequence:

1. TypeScript builds the complete workspace normally, preserving declarations,
   declaration maps, and JavaScript for non-StyleX modules.
2. The build scans Console UI source files and automatically discovers every
   JavaScript/TypeScript module importing `@stylexjs/stylex`.
3. All discovered StyleX entry points are transformed in **one esbuild call**.
4. The transform uses bundling only for tree shaking; ordinary package imports
   and relative imports stay external, so the existing module graph is not
   collapsed into a new application bundle.
5. Generated JS and source maps replace only the matching StyleX-authored files
   in `dist`; TypeScript's declarations remain authoritative.
6. StyleX emits one aggregated stylesheet for all discovered entries.
7. `*.escape.css` files are also discovered automatically and appended to the
   existing `console.components` CSS layer.
8. The build fails if any StyleX runtime bytes or StyleX runtime references
   remain in emitted StyleX-authored JavaScript.

The Badge legacy rules have been removed from **source** `styles.css`, so the
permanent build contains no selector-stripping logic and no Badge-specific
compilation path.

## Architecture guardrails

A dedicated test checks that:

- StyleX entry discovery is import-based rather than component-specific;
- CSS escape-hatch discovery is automatic;
- selector-stripping and Badge-pilot build names do not return;
- migrated Badge selectors do not reappear in legacy source CSS;
- every discovered StyleX-authored module is emitted without a StyleX runtime
  reference;
- every discovered `*.escape.css` file is present in distributed `styles.css`.

## Final generalized validation

The generalized pipeline passed the complete repository validation on its final
code path:

- **52 / 52** Node/package tests pass, including three new build-architecture
  guardrail tests;
- package contents validate;
- package metadata and tarballs validate;
- Storybook builds successfully;
- the reference console builds successfully;
- all **4 / 4** Playwright visual-regression scenarios pass, including the Badge
  comparison against the corrected legacy baseline;
- the build reports **1** discovered StyleX entry, **2,514 bytes** of generated
  StyleX CSS, **1** CSS escape file, and **0 bytes** of StyleX runtime.

## What is established

StyleX is technically viable as an internal Console UI authoring layer, and the
repository now has a reusable package-level build path rather than a
component-specific experiment. A component can opt into that path simply by
importing `@stylexjs/stylex`; CSS-shaped exceptions can opt in through the
`*.escape.css` convention. Consumers keep the existing ready-to-import
`styles.css` contract and do not acquire a StyleX runtime dependency.

## Remaining limitation

At this stage, the generalized architecture had been exercised by **one
StyleX-authored production entry**: Badge. The build is structurally multi-entry
and emits one aggregate stylesheet, but a second migrated component is still
needed to prove that the discovery, aggregation, source-map replacement, and
zero-runtime invariants remain clean when more than one production entry is
present simultaneously.

`Button` is the appropriate second pilot because it adds both that multi-entry
condition and the harder hover, active, focus, disabled, pending, link, and icon
interaction surface that Badge intentionally avoids.

## Conclusion

**The Badge migration and the generalized StyleX package build both passed.
The subsequent [Button pilot](2026-08-12-stylex-button-pilot.md) extends the same
pipeline to a second component family.**
