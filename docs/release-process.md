# Release Process

Status: public source migration prepared; npm publishing disabled pending setup.

## Source and package identity

The source repository is `Gruznov/console-ui`. Package names and source versions
are preserved during the repository migration:

```text
@polyconsole/design-tokens@0.2.0
@polyconsole/console-ui@0.7.0
```

These versions identify the imported source baseline. They are not new public
releases and must not be republished. npm versions are immutable. The cleaned
source does not change any package already stored in the registry.

Package manifests and Changesets are prepared for public npm access. The root,
Storybook, and reference-console workspaces remain private, unpublished
workspaces. CI builds and tests them without registry credentials.

## Registry migration: separate owner action

The public repository does not make existing npm packages public. Keep
`NPM_PUBLIC_PUBLISH_ENABLED` unset or `false` until all setup below is complete.
CI and local package checks do not change registry settings. Publishing with
`--access public` can change the visibility of an existing npm package, so the
release workflow first requires both packages to be readable from the public
registry without authentication. Private or missing packages fail that check
before any publication. Change their visibility separately after review.

Before enabling releases:

1. Review every previously published version of both packages, including stable
   and canary tarballs, README files, source maps, repository metadata, and
   provenance where present. Package visibility applies to the package, so
   assume that making it public exposes its previous versions too. A clean
   source snapshot or a clean new version does not sanitize that history.
2. Decide whether the existing names can safely become public. If older
   artifacts must remain private, use new package names or a new scope in a
   separate migration. Keep the publisher disabled while that decision is open.
3. Have the package owner perform the reviewed visibility change separately.
   Do not attempt to use a canary publish as a visibility test.
4. Configure the trusted publisher for **each** package on npmjs.com using the
   identity below. Retire the previous publisher when the migration is ready.
5. Create the GitHub `npm-release` environment, restrict it to `main`, and
   configure required reviewers if desired. Do not copy old registry tokens
   into the public repository.
6. Prepare a versioning pull request for both packages. Use new versions for
   the changed metadata and cleaned package documentation, update the reviewed
   versions in `scripts/release-check.mjs`, and keep the component package's
   token dependency exact. Merge only after review and passing CI.
7. Set the repository Actions variable `NPM_PUBLIC_PUBLISH_ENABLED` to `true`
   only after the package history, visibility, publisher identity, and new
   release versions have all been reviewed.

The repository migration does not change npm billing, existing consumer
credentials, or consumer deployments. Keep existing access working until
consumers have verified installation of their selected public versions.

See npm's [package visibility documentation](https://docs.npmjs.com/changing-package-visibility/),
[trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/),
and [publication rules](https://docs.npmjs.com/cli/v11/commands/npm-publish/).

## Trusted manual publisher

Publication is confined to
[`npm-canary.yml`](../.github/workflows/npm-canary.yml). Its filename is retained
because the npm trusted-publisher identity includes it.

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
