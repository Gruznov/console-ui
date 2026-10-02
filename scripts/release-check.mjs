import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCache = resolve(repositoryRoot, ".cache/npm");
const releaseDirectory = mkdtempSync(resolve(tmpdir(), "console-ui-release-"));

function readJson(path) {
  return JSON.parse(readFileSync(resolve(repositoryRoot, path), "utf8"));
}

function run(command, arguments_, options = {}) {
  const result = spawnSync(command, arguments_, {
    cwd: repositoryRoot,
    encoding: "utf8",
    ...options,
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

const rootManifest = readJson("package.json");
const changesetConfig = readJson(".changeset/config.json");
const packageFixtures = [
  {
    directory: "./packages/design-tokens",
    manifestPath: "packages/design-tokens/package.json",
    name: "@gruznov/design-tokens",
    version: "0.2.1",
  },
  {
    directory: "./packages/console-ui",
    manifestPath: "packages/console-ui/package.json",
    name: "@gruznov/console-ui",
    version: "0.7.1",
  },
];

try {
  assert.equal(rootManifest.private, true, "workspace root must stay private");
  assert.equal(
    rootManifest.devDependencies["@changesets/cli"],
    "2.31.0",
    "Changesets must be pinned for reproducible release planning",
  );
  assert.equal(
    Object.hasOwn(rootManifest.scripts, "release:publish"),
    false,
    "automated publishing must remain confined to the reviewed GitHub workflow",
  );

  assert.equal(changesetConfig.access, "public");
  assert.equal(changesetConfig.baseBranch, "main");
  assert.deepEqual(changesetConfig.privatePackages, {
    tag: false,
    version: true,
  });

  const manifests = new Map(
    packageFixtures.map((fixture) => [
      fixture.name,
      readJson(fixture.manifestPath),
    ]),
  );

  for (const fixture of packageFixtures) {
    const manifest = manifests.get(fixture.name);

    assert.equal(manifest.name, fixture.name);
    assert.equal(manifest.version, fixture.version);
    assert.equal(
      Object.hasOwn(manifest, "private"),
      false,
      `${fixture.name} must be publishable after the registry gate`,
    );
    assert.deepEqual(manifest.repository, {
      type: "git",
      url: "git+https://github.com/Gruznov/console-ui.git",
      directory: fixture.directory.slice(2),
    });
    assert.deepEqual(manifest.publishConfig, {
      access: "public",
      registry: "https://registry.npmjs.org/",
    });

    const changelog = readFileSync(
      resolve(repositoryRoot, dirname(fixture.manifestPath), "CHANGELOG.md"),
      "utf8",
    );
    assert.match(
      changelog,
      new RegExp(`^# ${fixture.name}\\n\\n## ${fixture.version}`, "u"),
      `${fixture.name} must record the stable release`,
    );
  }

  assert.equal(
    manifests.get("@gruznov/console-ui").dependencies["@gruznov/design-tokens"],
    manifests.get("@gruznov/design-tokens").version,
    "Console UI must depend on the exact current token-package version",
  );
  for (const changeset of [
    "honest-states-scan.md",
    "tidy-shells-expand.md",
    "wide-tables-scroll.md",
    "calm-maps-fold.md",
    "quiet-tables-fill.md",
  ]) {
    assert.equal(
      existsSync(resolve(repositoryRoot, ".changeset", changeset)),
      false,
      `versioning must consume ${changeset}`,
    );
  }

  for (const workspacePath of [
    "apps/storybook/package.json",
    "examples/reference-console/package.json",
  ]) {
    const workspaceManifest = readJson(workspacePath);

    assert.equal(workspaceManifest.version, "0.0.0");
    assert.equal(workspaceManifest.private, true);
    assert.equal(workspaceManifest.dependencies["@gruznov/console-ui"], "*");
    assert.equal(workspaceManifest.dependencies["@gruznov/design-tokens"], "*");
  }

  const workflowDirectory = resolve(repositoryRoot, ".github/workflows");
  const workflowFiles = new Map(
    readdirSync(workflowDirectory)
      .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
      .map((file) => [
        file,
        readFileSync(resolve(workflowDirectory, file), "utf8"),
      ]),
  );
  const publishWorkflow = workflowFiles.get("npm-canary.yml");

  assert.ok(publishWorkflow, "the trusted npm workflow is missing");
  assert.match(publishWorkflow, /^\s{2}workflow_dispatch:\s*$/mu);
  assert.match(publishWorkflow, /^\s{6}channel:\s*$/mu);
  assert.match(publishWorkflow, /^\s{8}default:\s*canary\s*$/mu);
  assert.match(publishWorkflow, /^\s{10}-\s+canary\s*$/mu);
  assert.match(publishWorkflow, /^\s{10}-\s+stable\s*$/mu);
  assert.match(publishWorkflow, /^\s{6}stable_package:\s*$/mu);
  assert.match(publishWorkflow, /^\s{8}default:\s*all\s*$/mu);
  assert.match(publishWorkflow, /^\s{10}-\s+design-tokens\s*$/mu);
  assert.match(publishWorkflow, /^\s{10}-\s+console-ui\s*$/mu);
  assert.doesNotMatch(
    publishWorkflow,
    /^\s{2}(?:pull_request|push|schedule):\s*$/mu,
    "publishing must remain manual-only",
  );
  assert.match(publishWorkflow, /^\s{2}id-token:\s*write\s*$/mu);
  assert.match(publishWorkflow, /^\s{2}contents:\s*read\s*$/mu);
  assert.match(publishWorkflow, /^\s{4}environment:\s*npm-release\s*$/mu);
  assert.match(
    publishWorkflow,
    /github\.repository == 'Gruznov\/console-ui' && github\.ref == 'refs\/heads\/main' && vars\.NPM_PUBLIC_PUBLISH_ENABLED == 'true'/u,
    "public publishing must be disabled until the registry migration is reviewed and enabled",
  );
  assert.match(publishWorkflow, /npm@11\.5\.1/u);
  assert.match(
    publishWorkflow,
    /Require packages to be public before publishing/u,
    "existing packages must be public before any publish command can run",
  );
  assert.match(
    publishWorkflow,
    /fetch\(`https:\/\/registry\.npmjs\.org\/\$\{encodeURIComponent\(name\)\}`\)/u,
    "the registry visibility preflight must use an anonymous read",
  );
  assert.match(
    publishWorkflow,
    /STABLE_TOKENS_VERSION=\$tokens_version/u,
    "the workflow must derive the token release version from its reviewed manifest",
  );
  assert.match(
    publishWorkflow,
    /STABLE_COMPONENTS_VERSION=\$components_version/u,
    "the workflow must derive the component release version from its reviewed manifest",
  );
  assert.equal(
    [...publishWorkflow.matchAll(/^\s+(?:run:\s+)?npm publish\b/gmu)].length,
    4,
    "the workflow must keep exactly two package publish commands per channel",
  );
  assert.equal(
    [...publishWorkflow.matchAll(/--tag canary\s+--access public/gu)].length,
    2,
    "both canary artifacts must stay public and off the latest tag",
  );
  assert.match(
    publishWorkflow,
    /npm publish \.\/packages\/design-tokens --access public/u,
  );
  assert.match(
    publishWorkflow,
    /npm publish \.\/packages\/console-ui --access public/u,
  );
  assert.ok(
    [...publishWorkflow.matchAll(/inputs\.channel == 'canary'/gu)].length >= 3,
    "all canary-only steps must be channel-gated",
  );
  assert.ok(
    [...publishWorkflow.matchAll(/inputs\.channel == 'stable'/gu)].length >= 2,
    "both stable publish steps must be channel-gated",
  );
  assert.match(
    publishWorkflow,
    /inputs\.stable_package == 'all' \|\| inputs\.stable_package == 'design-tokens'/u,
    "stable token publishing must be explicitly selectable",
  );
  assert.match(
    publishWorkflow,
    /inputs\.stable_package == 'all' \|\| inputs\.stable_package == 'console-ui'/u,
    "stable component publishing must be explicitly selectable",
  );
  assert.doesNotMatch(
    publishWorkflow,
    /NODE_AUTH_TOKEN|secrets\./u,
    "publishing must use OIDC rather than a registry write token",
  );

  const otherWorkflowSource = [...workflowFiles]
    .filter(([file]) => file !== "npm-canary.yml")
    .map(([, source]) => source)
    .join("\n");

  assert.doesNotMatch(
    otherWorkflowSource,
    /\b(?:changeset|npm)\s+publish\b/u,
    "only the reviewed trusted workflow may publish",
  );

  for (const fixture of packageFixtures) {
    const output = run("npm", [
      "pack",
      fixture.directory,
      "--json",
      "--pack-destination",
      releaseDirectory,
      "--cache",
      npmCache,
    ]);
    const [packResult] = JSON.parse(output);
    const tarballPath = resolve(releaseDirectory, packResult.filename);

    assert.equal(packResult.name, fixture.name);
    assert.equal(packResult.version, fixture.version);
    assert.equal(existsSync(tarballPath), true);
    assert.ok(
      statSync(tarballPath).size > 0,
      `${packResult.filename} is empty`,
    );
  }

  console.log(
    "Validated stable package metadata, tarballs, and independently selectable manual OIDC release boundaries.",
  );
} finally {
  rmSync(releaseDirectory, { force: true, recursive: true });
}
