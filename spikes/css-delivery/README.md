# CSS delivery spike

This fixture compares the two viable delivery contracts for Console UI:

1. package-owned, ready-to-import CSS;
2. Tailwind source that each consumer must scan and compile.

The fixture is independent of consumer applications. It models one primitive
(`Button`) and one layout (`ConsoleFrame`) using isolated local runners.

## Fixture layout

```text
package/
  dist/tokens.css       independently importable semantic tokens
  dist/styles.css       ready-to-import component CSS
  source/components.tsx comparison-only Tailwind source

runners/
  4.2.1/               isolated Tailwind 4.2.1 consumer
  4.3.0/               isolated Tailwind 4.3.0 consumer

verify.mjs              contract checks for both approaches
```

The package fixture uses the same entry-point shape planned for the real
packages:

```css
@import "@polyconsole/design-tokens/tokens.css";
@import "@polyconsole/console-ui/styles.css";
```

The local fixture keeps both files in one package only to make the experiment
self-contained.

## Reproduce

From this directory:

```sh
npm install --prefix runners/4.2.1 --package-lock=false
npm install --prefix runners/4.3.0 --package-lock=false

runners/4.2.1/node_modules/.bin/tailwindcss \
  -i runners/4.2.1/input.css \
  -o /tmp/console-ui-tailwind-4.2.1.css

runners/4.3.0/node_modules/.bin/tailwindcss \
  -i runners/4.3.0/input.css \
  -o /tmp/console-ui-tailwind-4.3.0.css

node verify.mjs \
  /tmp/console-ui-tailwind-4.2.1.css \
  /tmp/console-ui-tailwind-4.3.0.css

npm pack ./package --cache /tmp/console-ui-npm-cache --dry-run
```

The expected result is:

- both Tailwind versions find the external component classes only because the
  consumer declares `@source`;
- the ready-to-import CSS has no Tailwind directive, reset, or unscoped
  component selector;
- tokens and component styles have separate package exports;
- comparison-only Tailwind source is excluded from the selected package
  artifact;
- the fixture is packable as an npm-compatible package.

Generated CSS is written outside the repository and is not committed.
