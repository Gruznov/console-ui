import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(command, arguments_) {
  const result = spawnSync(command, arguments_, {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      [result.stdout, result.stderr, result.error?.message]
        .filter(Boolean)
        .join("\n"),
    );
  }

  return result.stdout;
}

test("canary artifacts preserve registry metadata and lock prerelease versions", () => {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), "console-ui-canary-test-"));
  const version = "0.2.0-canary.42.1";

  try {
    run(process.execPath, [
      "scripts/prepare-canary.mjs",
      "--version",
      version,
      "--output",
      fixtureRoot,
    ]);

    const designTokensManifest = JSON.parse(
      run("tar", [
        "-xOf",
        resolve(fixtureRoot, "design-tokens.tgz"),
        "package/package.json",
      ]),
    );
    const consoleUiManifest = JSON.parse(
      run("tar", [
        "-xOf",
        resolve(fixtureRoot, "console-ui.tgz"),
        "package/package.json",
      ]),
    );

    for (const [manifest, directory] of [
      [designTokensManifest, "packages/design-tokens"],
      [consoleUiManifest, "packages/console-ui"],
    ]) {
      assert.equal(manifest.version, version);
      assert.equal(Object.hasOwn(manifest, "private"), false);
      assert.deepEqual(manifest.publishConfig, {
        access: "public",
        registry: "https://registry.npmjs.org/",
      });
      assert.deepEqual(manifest.repository, {
        type: "git",
        url: "git+https://github.com/Gruznov/console-ui.git",
        directory,
      });
    }

    assert.equal(
      consoleUiManifest.dependencies["@gruznov/design-tokens"],
      version,
    );
    const sourceManifest = JSON.parse(
      readFileSync(
        resolve(repositoryRoot, "packages/design-tokens/package.json"),
        "utf8",
      ),
    );

    assert.equal(sourceManifest.version, "0.2.1");
    assert.equal(
      Object.hasOwn(sourceManifest, "private"),
      false,
      "the stable source manifest must stay publishable",
    );
  } finally {
    rmSync(fixtureRoot, { force: true, recursive: true });
  }
});
