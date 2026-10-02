import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCache = resolve(repositoryRoot, ".cache/npm");
const stagingRoot = mkdtempSync(resolve(tmpdir(), "console-ui-canary-"));
const options = new Map();

for (let index = 2; index < process.argv.length; index += 2) {
  const name = process.argv[index];
  const value = process.argv[index + 1];

  assert.ok(name?.startsWith("--"), `unexpected argument: ${name ?? ""}`);
  assert.ok(value, `${name} requires a value`);
  options.set(name, value);
}

const version = options.get("--version");
const outputDirectoryOption = options.get("--output");
const versionMatch = version?.match(
  /^(\d+\.\d+\.\d+)-canary\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u,
);

assert.ok(
  versionMatch,
  "canary version must match <stable-version>-canary.<run>.<attempt>",
);
assert.ok(outputDirectoryOption, "--output is required");

const outputDirectory = resolve(repositoryRoot, outputDirectoryOption);
mkdirSync(outputDirectory, { recursive: true });
assert.deepEqual(
  readdirSync(outputDirectory),
  [],
  `canary output directory must be empty: ${outputDirectory}`,
);

const packageFixtures = [
  {
    artifact: "design-tokens.tgz",
    directory: "packages/design-tokens",
    name: "@polyconsole/design-tokens",
  },
  {
    artifact: "console-ui.tgz",
    directory: "packages/console-ui",
    name: "@polyconsole/console-ui",
  },
];

function run(command, arguments_, cwd) {
  const result = spawnSync(command, arguments_, {
    cwd,
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

try {
  for (const fixture of packageFixtures) {
    const sourceDirectory = resolve(repositoryRoot, fixture.directory);
    const stagingDirectory = resolve(stagingRoot, fixture.directory);

    cpSync(sourceDirectory, stagingDirectory, { recursive: true });

    const manifestPath = resolve(stagingDirectory, "package.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

    assert.equal(manifest.name, fixture.name);
    assert.equal(Object.hasOwn(manifest, "private"), false);
    assert.match(
      manifest.version,
      /^\d+\.\d+\.\d+$/u,
      `${fixture.name} must have a stable source version`,
    );
    assert.deepEqual(manifest.repository, {
      type: "git",
      url: "git+https://github.com/Gruznov/console-ui.git",
      directory: fixture.directory,
    });
    assert.deepEqual(manifest.publishConfig, {
      access: "public",
      registry: "https://registry.npmjs.org/",
    });

    manifest.version = version;

    if (fixture.name === "@polyconsole/console-ui") {
      assert.match(
        manifest.dependencies["@polyconsole/design-tokens"],
        /^\d+\.\d+\.\d+$/u,
        "Console UI must use an exact stable token dependency",
      );
      manifest.dependencies["@polyconsole/design-tokens"] = version;
    }

    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const [packResult] = JSON.parse(
      run(
        "npm",
        [
          "pack",
          stagingDirectory,
          "--json",
          "--pack-destination",
          outputDirectory,
          "--cache",
          npmCache,
        ],
        repositoryRoot,
      ),
    );

    assert.equal(packResult.name, fixture.name);
    assert.equal(packResult.version, version);

    renameSync(
      resolve(outputDirectory, basename(packResult.filename)),
      resolve(outputDirectory, fixture.artifact),
    );
  }

  console.log(
    `Prepared canary artifacts for ${version} in ${outputDirectory}.`,
  );
} finally {
  rmSync(stagingRoot, { force: true, recursive: true });
}
