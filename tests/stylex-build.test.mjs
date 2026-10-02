import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(repositoryRoot, "packages/console-ui/src");
const distRoot = resolve(repositoryRoot, "packages/console-ui/dist");

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(absolute)));
    else files.push(absolute);
  }

  return files;
}

async function findStylexEntries() {
  const entries = [];

  for (const file of await listFiles(sourceRoot)) {
    if (!/\.[cm]?[jt]sx?$/.test(file)) continue;
    const source = await readFile(file, "utf8");
    if (source.includes("@stylexjs/stylex")) entries.push(file);
  }

  return entries.toSorted();
}

test("StyleX package compilation is discovery-based rather than component-specific", async () => {
  const [buildScript, legacyStyles] = await Promise.all([
    readFile(resolve(repositoryRoot, "scripts/build.mjs"), "utf8"),
    readFile(resolve(sourceRoot, "styles.css"), "utf8"),
  ]);

  assert.match(buildScript, /source\.includes\("@stylexjs\/stylex"\)/);
  assert.match(buildScript, /sourceFile\.endsWith\("\.escape\.css"\)/);
  assert.match(buildScript, /entryPoints:\s*stylexEntryPoints/);
  assert.match(buildScript, /bundle:\s*true/);
  assert.match(buildScript, /preserve-console-ui-module-graph/);
  assert.match(buildScript, /StyleX-authored modules retained/);

  assert.doesNotMatch(
    buildScript,
    /removeExactCssRules|legacyBadgeRules|stylex-badge-pilot/,
  );
  assert.doesNotMatch(
    legacyStyles,
    /\[data-console-(?:badge(?:-content)?|status-badge|status-indicator)/,
  );
});

test("every StyleX-authored module is emitted without a StyleX runtime reference", async () => {
  const stylexEntries = await findStylexEntries();
  assert.ok(
    stylexEntries.length > 0,
    "expected at least one StyleX-authored module",
  );

  for (const sourceFile of stylexEntries) {
    const sourceRelative = relative(sourceRoot, sourceFile);
    const outputRelative = sourceRelative.replace(/\.[cm]?[jt]sx?$/, ".js");
    const emittedJs = await readFile(resolve(distRoot, outputRelative), "utf8");

    assert.doesNotMatch(
      emittedJs,
      /@stylexjs\/stylex|stylex\.(?:create|props)/,
      `${outputRelative} retained a StyleX runtime reference`,
    );
  }
});

test("plain-CSS escape hatches are discovered and delivered through package styles", async () => {
  const [sourceFiles, distributedStyles] = await Promise.all([
    listFiles(sourceRoot),
    readFile(resolve(distRoot, "styles.css"), "utf8"),
  ]);
  const escapeFiles = sourceFiles
    .filter((file) => file.endsWith(".escape.css"))
    .toSorted();

  assert.ok(escapeFiles.length > 0, "expected at least one CSS escape hatch");

  for (const escapeFile of escapeFiles) {
    const escapeCss = (await readFile(escapeFile, "utf8")).trim();
    assert.ok(
      distributedStyles.includes(escapeCss),
      `${relative(sourceRoot, escapeFile)} is missing from distributed styles.css`,
    );
  }
});
