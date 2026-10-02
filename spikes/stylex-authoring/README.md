# StyleX authoring spike

This is an isolated experiment. It does **not** change the stable
`@polyconsole/console-ui` package or its public styling contract.

## Question

Can Console UI use StyleX as an **internal authoring/compiler layer** while
continuing to ship the same consumer-facing contract established by ADR 0005:

- React components;
- semantic `--console-*` tokens;
- one ready-to-import component stylesheet;
- no consumer StyleX, Babel, PostCSS, or Tailwind requirement;
- no component-side global CSS injection?

The spike ports five representative component families:

1. action controls (`Button`, `ActionLink`, `IconButton`);
2. badges (`Badge`, `StatusBadge`);
3. cards and card sections;
4. `Separator`;
5. `DataTableFrame` plus table primitives.

They deliberately use `data-stylex-spike-*` attributes so the experiment can
coexist with the production stylesheet without accidentally receiving the
current `[data-console-*]` rules.

## Architecture under test

```text
Console UI TSX + stylex.create()
           |
           v
 @stylexjs/unplugin + esbuild
           |
           +--> dist/index.js
           |
           +--> StyleX atomic CSS
                    |
                    + escape-hatch.css
                    v
               dist/styles.css
```

Consumers would continue to import `tokens.css` and `styles.css`; StyleX stays
an implementation detail of the package build.

`useCSSLayers.prefix = "console.components"` keeps StyleX priority layers
nested under the existing `console.components` cascade layer. The plain-CSS
escape hatch uses `console.components.escape`.

## Why an escape hatch is part of the experiment

The current stylesheet contains several rules whose meaning is inherently
relational rather than element-local. Re-expressing them as React state or
context solely to satisfy StyleX would make the component implementation worse.

The spike intentionally leaves these in `src/escape-hatch.css`:

- arbitrary child icon sizing (`> svg`);
- `CardHeader:has(CardAction)`;
- card-size propagation into child sections;
- table body/row relationships;
- sticky table header behavior controlled by `DataTableFrame`.

The useful metric is therefore not “can StyleX express 100% of CSS?” but
whether the StyleX-owned majority becomes easier to reason about while the
remaining CSS stays small and explicit.

## Run

Requires Node 22+.

```bash
npm install --no-audit --no-fund
npm run verify
```

`verify` type-checks the spike, builds it, then checks that:

- atomic CSS is emitted under `console.components.*`;
- semantic Console UI CSS variables survive compilation;
- the explicit CSS escape hatch is present;
- compiled JS does not import the stylesheet;
- no uncompiled `@stylex` directive remains.

It also prints output sizes, atomic-class count, escape-hatch share, and whether
the final JS still references the StyleX runtime.

## Non-goals

This spike does not:

- change production Console UI components;
- change ADR 0005;
- add `xstyle` to the public API;
- require product repositories to compile StyleX;
- claim visual parity until the representative components are rendered against
  the existing visual fixtures.

A public `xstyle` prop would couple consumers to StyleX compilation. That is a
separate decision from using StyleX internally and is intentionally excluded
here.
