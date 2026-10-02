# Release Process

Status: new public package identities prepared; publishing disabled pending bootstrap.

## Source and package identity

The source repository is `Gruznov/console-ui`. The first stable versions planned
under the new npm user scope are:

```text
@gruznov/design-tokens@0.2.1
@gruznov/console-ui@0.7.1
```

These are release candidates until registry publication is verified. Version
numbers continue the imported source baseline. Existing `@polyconsole/*` packages
and their historical versions are not renamed, made public, or republished.
The root, Storybook, and reference-console workspaces remain private and unpublished.

## First publication: package owner bootstrap

The GitHub publisher intentionally requires both package names to already be
public. It cannot bootstrap missing packages. Keep `NPM_PUBLIC_PUBLISH_ENABLED`
unset or `false` during this procedure. Do not remove that preflight or change
old package visibility to work around it.

After the naming PR is merged and CI passes, the npm account owner performs a
one-time authenticated publication of real canary artifacts from the reviewed
`main` commit. A browser login alone does not authenticate the local npm CLI.
Use a local checkout with Node 24 and npm 11.5.1 or later:

```sh
git switch main
git pull --ff-only
npm ci
npm run check
npm run canary:prepare -- --version 0.7.1-canary.0.1 --output .cache/npm-bootstrap
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
```

Confirm that `whoami` prints `gruznov`. Before publishing, inspect both tarballs
(including `package/package.json`) and confirm the `@gruznov` scope, public
access, repository metadata, and matching prerelease dependency. The output
directory must be empty before preparation. These commands do not publish.

The following two commands **do publish public packages** and require explicit
release approval. Complete any npm browser/2FA challenge locally; do not share
credentials or OTPs in chat or copy a registry token into GitHub:

```sh
npm publish .cache/npm-bootstrap/design-tokens.tgz --tag canary --access public --registry=https://registry.npmjs.org/
npm publish .cache/npm-bootstrap/console-ui.tgz --tag canary --access public --registry=https://registry.npmjs.org/
```

Publish tokens first. Check whether the version already exists before retrying:
a completed upload is immutable. If only the component upload fails, retain the
successful token release and retry only the missing component. Both canaries use
`0.7.1-canary.0.1` and the `canary` dist-tag; stable source manifests stay unchanged.

Verify anonymous registry reads and install the exact canary versions into a
clean consumer without registry credentials. Check the component import and both
CSS entry points. Then configure the ongoing publisher:

1. On npmjs.com, open Settings for **each new package** and add a GitHub Actions
   trusted publisher using the identity below. Allow direct `npm publish` (not
   only staged publishing).
2. Create the GitHub `npm-release` environment and restrict it to `main`.
3. Set the repository Actions variable `NPM_PUBLIC_PUBLISH_ENABLED=true` only
   after the public canary and both trusted publishers have been verified.
4. Run the manual workflow with `channel=stable` and `stable_package=all` to
   publish the reviewed stable versions above. Verify versions, dist-tags,
   contents, and anonymous installation before consumer migration.

The bootstrap is the sole initial manual-publishing exception. Subsequent
releases use the reviewed OIDC workflow, without long-lived registry write tokens.

## Consumer and billing migration

Update each consumer in its own repository after the stable release is verified:

- Replace `@polyconsole/console-ui` with `@gruznov/console-ui` in dependencies,
  imports, and bundler configuration; pin the selected stable version.
- Replace `@polyconsole/design-tokens` with `@gruznov/design-tokens`, including
  `tokens.css` imports. Regenerate the consumer lockfile with its package manager.
- Keep the CSS order: tokens first, components second. Component exports, CSS
  subpaths, and the `--console-*` token prefix do not change.
- Verify a clean install, production build, and relevant UI checks. Remove old
  registry credentials only after checking that no other private packages need them.
- Consumer deployment requires its own approval and is not performed by this repo.

Changing this repository does not change npm billing. The organization owner can
select `polyconsole` → Billing → Downgrade Plan to stop paid renewal. npm retains
private-package access until the end of the paid cycle, then disables installation
and publication of private packages; it does not make them public. Migrate all
consumers before that boundary. Do not delete the old packages or organization as
part of this migration.

See npm's [downgrade documentation](https://docs.npmjs.com/downgrading-to-a-free-organization-plan/),
[scoped public package documentation](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/),
[trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/),
and [publication rules](https://docs.npmjs.com/cli/v11/commands/npm-publish/).

## Trusted manual publisher

After the initial owner bootstrap, automated publication is confined to
[`npm-canary.yml`](../.github/workflows/npm-canary.yml). Its filename is part of the npm trusted-publisher identity and must match the
package settings.

| Setting | Value |
| --- | --- |
| GitHub owner | `Gruznov` |
| Repository | `console-ui` |
| Workflow filename | `npm-canary.yml` |
| Environment | `npm-release` |
| Branch | `main` |
| Repository variable | `NPM_PUBLIC_PUBLISH_ENABLED=true` |

Where npm offers an allowed-actions setting, authorize direct publishing for
this workflow. Follow the current npm setup documentation when creating or
changing the publisher.

The workflow is manual-only, refuses to run outside the repository and branch
above, and remains skipped while its enabling variable is absent or false. It
uses GitHub-hosted runners, Node 24, npm 11.5.1, and OIDC with these permissions:

```yaml
permissions:
  contents: read
  id-token: write
```

It receives no registry write token and runs the full workspace check before
publication. An anonymous registry check then requires both package names to
already be public. No publication runs on a push, pull request, tag, or schedule.

## Changesets and versioning

[Changesets](https://github.com/changesets/changesets) records release intent in
small Markdown files under `.changeset/`. It versions only the two package
workspaces and never commits, tags, or publishes automatically.

Add a changeset for shipped tokens, component contracts, package-owned CSS,
dependencies, package contents, or consumer-visible fixes. Documentation-only
repository maintenance and unreleased example changes usually need no
changeset.

- `patch`: compatible correction or styling fix.
- `minor`: compatible public capability, token, component, or export.
- `major`: incompatible contract or required consumer migration.

The packages may advance independently. Console UI keeps an exact dependency
on the token package. Storybook and the reference console use workspace-only
`*` ranges. Consumer applications select explicit released versions.

```sh
npm run changeset
npm run release:status
npm run check
```

Once release intent is approved, a focused versioning pull request runs:

```sh
npm run release:version
```

Update the reviewed version fixtures in `scripts/release-check.mjs` alongside
the manifests, lockfile, and generated changelogs. Versioning does not publish,
change registry access, or deploy a consumer.

## Release channels

The required `channel` input selects `canary` or `stable`.

A canary run copies the package directories to temporary storage, gives both
artifacts `<reviewed-console-version>-canary.<run>.<attempt>` versions, and locks
Console UI to the matching token prerelease. It publishes tokens before
components with public visibility and the `canary` dist-tag. Source manifests
are not changed. Before the first run from a new repository, check that the
resulting prerelease version has not already been used.

A stable run publishes the selected reviewed source versions with public
visibility. The `stable_package` input selects `all`, `design-tokens`, or
`console-ui`; it is ignored for canaries. `all` publishes tokens first. Select a
single package when the other version is unchanged, because an existing
name/version pair cannot be republished. Stable publication uses the normal
`latest` dist-tag.

After a green run, verify the exact package versions, dist-tags, tarball
contents, and public installation from a clean consumer. Keep release evidence
focused on this library's public commits, workflows, and package artifacts.
Consumer deployment is a separate process.

## Release checks

`release:check` verifies the reviewed versions, public access configuration,
repository metadata, changelogs, exact internal dependency, and non-empty npm
tarballs. It also checks the manual-only workflow, repository and branch
restrictions, disabled-until-enabled gate, OIDC-only authentication, and
channel/package selection. The workflow also checks anonymous registry access
before it can publish either package.

`pack:check` verifies the exact artifact file lists. Canary tests verify
artifact metadata, matching prerelease dependencies, and unchanged source
manifests. These checks do not publish packages or change any registry setting.
