# Visual regression contract

Console UI stores focused Playwright screenshots in the repository. They cover
the shared mechanisms most likely to create cross-consumer regressions without
requiring a consumer application to be deployed.

The required matrix is:

- light and dark action controls;
- light and dark filter toolbars;
- an explicitly open Tooltip reference state;
- the ConsoleShell at desktop and narrow widths.

The stories own deterministic reference data. The browser run fixes locale,
timezone, pixel ratio, color scheme, motion, viewport, and worker count. The repository commits Linux baselines for CI. Other platforms may require
local baselines because system font metrics affect wrapping and full-page
height. Small same-platform antialiasing differences are tolerated; structural
changes are not.

Run the contract after installing the pinned browser:

```sh
npx playwright install chromium
npm run test:visual
```

Only update baselines when a reviewed visual change is intentional:

```sh
npm run test:visual -- --update-snapshots
```

Applications retain focused integration and smoke tests. This suite
protects package-owned layout and states; it does not turn domain pages into
Console UI fixtures.
