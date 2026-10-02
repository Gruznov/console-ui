import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const spikeRoot = new URL(".", import.meta.url);

async function readFixture(path) {
  return readFile(new URL(path, spikeRoot), "utf8");
}

const [manifestSource, tokens, styles, source421, source430] = await Promise.all([
  readFixture("package/package.json"),
  readFixture("package/dist/tokens.css"),
  readFixture("package/dist/styles.css"),
  readFixture("runners/4.2.1/input.css"),
  readFixture("runners/4.3.0/input.css"),
]);

const manifest = JSON.parse(manifestSource);

assert.equal(manifest.exports["./tokens.css"], "./dist/tokens.css");
assert.equal(manifest.exports["./styles.css"], "./dist/styles.css");
assert.equal(manifest.exports["./source"], undefined);
assert.deepEqual(manifest.files, ["dist"]);
assert.match(tokens, /--console-surface-canvas:/);
assert.match(tokens, /\[data-console-color-scheme="dark"\]/);
assert.match(styles, /@layer console\.components/);
assert.match(styles, /\[data-console-ui="button"\]/);
assert.match(styles, /\[data-console-ui="frame"\]/);
assert.match(styles, /var\(--console-/);
assert.doesNotMatch(styles, /@(?:apply|import|source|tailwind)\b/);
assert.doesNotMatch(styles, /(?:^|\})\s*(?:\*|html|body)\s*[{,]/m);
assert.match(source421, /@source "\.\.\/\.\.\/package\/source"/);
assert.equal(source430, source421);

const compiledPaths = process.argv.slice(2);
assert.equal(
  compiledPaths.length,
  2,
  "pass the Tailwind 4.2.1 and 4.3.0 compiled CSS paths",
);

for (const compiledPath of compiledPaths) {
  const compiled = await readFile(resolve(compiledPath), "utf8");
  assert.match(compiled, /\.rounded-md/);
  assert.match(compiled, /\.bg-slate-800/);
  assert.match(compiled, /\.grid-cols-/);
}

console.log(
  JSON.stringify(
    {
      precompiled: {
        scopedSelectors: true,
        separateTokenExport: true,
        tailwindRuntimeDirective: false,
      },
      source: {
        explicitSourceRegistration: true,
        tailwindVersions: ["4.2.1", "4.3.0"],
      },
    },
    null,
    2,
  ),
);
