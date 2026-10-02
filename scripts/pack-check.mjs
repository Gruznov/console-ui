import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCache = resolve(repositoryRoot, ".cache/npm");

const packages = [
  {
    directory: "./packages/design-tokens",
    expectedFiles: [
      "README.md",
      "dist/token-inventory.json",
      "dist/tokens.css",
      "package.json",
    ],
  },
  {
    directory: "./packages/console-ui",
    expectedFiles: [
      "README.md",
      "dist/badge.d.ts",
      "dist/badge.d.ts.map",
      "dist/badge.js",
      "dist/badge.js.map",
      "dist/button.d.ts",
      "dist/button.d.ts.map",
      "dist/button.js",
      "dist/button.js.map",
      "dist/card.d.ts",
      "dist/card.d.ts.map",
      "dist/card.js",
      "dist/card.js.map",
      "dist/feedback.d.ts",
      "dist/feedback.d.ts.map",
      "dist/feedback.js",
      "dist/feedback.js.map",
      "dist/filter-toolbar.d.ts",
      "dist/filter-toolbar.d.ts.map",
      "dist/filter-toolbar.js",
      "dist/filter-toolbar.js.map",
      "dist/form.d.ts",
      "dist/form.d.ts.map",
      "dist/form.js",
      "dist/form.js.map",
      "dist/index.d.ts",
      "dist/index.d.ts.map",
      "dist/index.js",
      "dist/index.js.map",
      "dist/page-header.d.ts",
      "dist/page-header.d.ts.map",
      "dist/page-header.js",
      "dist/page-header.js.map",
      "dist/separator.d.ts",
      "dist/separator.d.ts.map",
      "dist/separator.js",
      "dist/separator.js.map",
      "dist/selection.d.ts",
      "dist/selection.d.ts.map",
      "dist/selection.js",
      "dist/selection.js.map",
      "dist/shell.d.ts",
      "dist/shell.d.ts.map",
      "dist/shell.js",
      "dist/shell.js.map",
      "dist/styles.css",
      "dist/table.d.ts",
      "dist/table.d.ts.map",
      "dist/table.js",
      "dist/table.js.map",
      "dist/tabs.d.ts",
      "dist/tabs.d.ts.map",
      "dist/tabs.js",
      "dist/tabs.js.map",
      "dist/tooltip.d.ts",
      "dist/tooltip.d.ts.map",
      "dist/tooltip.js",
      "dist/tooltip.js.map",
      "package.json",
    ],
  },
];

for (const packageFixture of packages) {
  const result = spawnSync(
    "npm",
    [
      "pack",
      packageFixture.directory,
      "--dry-run",
      "--json",
      "--cache",
      npmCache,
    ],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
    },
  );

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  const [packResult] = JSON.parse(result.stdout);
  const actualFiles = packResult.files
    .map(({ path }) => path)
    .sort((left, right) => left.localeCompare(right));
  const expectedFiles = packageFixture.expectedFiles.toSorted((left, right) =>
    left.localeCompare(right),
  );

  assert.deepEqual(
    actualFiles,
    expectedFiles,
    `${packageFixture.directory} package contents changed`,
  );
}

console.log("Validated package contents for both workspaces.");
