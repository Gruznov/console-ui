# ADR 0006: npm and TypeScript workspace

Status: accepted; build pipeline extended for StyleX components

## Decision

Use npm workspaces with one root lockfile, Node.js 22.12 and npm 10.9 as the
pinned baseline, TypeScript project references, Biome, and the Node.js test
runner. The package manifests define the accepted runtime ranges.

Repository-owned scripts orchestrate builds and validate package exports,
contents, metadata, and styles. `npm run check` provides the shared local and CI
quality entry point. Storybook and the reference application use their own
workspaces while consuming the same package builds.

## Build pipeline

TypeScript emits declarations and the component module graph. The build then
discovers modules importing StyleX and transforms them together through esbuild
and the StyleX plugin. Normal package and relative imports stay external;
StyleX compile-time composition is removed from the emitted JavaScript.

The output is a ready-to-import stylesheet under the package component layer.
Structural and platform-specific CSS can use discovered `*.escape.css` files.
A build guard rejects retained StyleX runtime references. See
[CSS delivery](0005-css-delivery.md) and the
[Badge pilot](../spikes/2026-08-12-stylex-badge-pilot.md).

## Consequences

One lockfile and shared scripts keep package boundaries explicit and prevent
checks from drifting across packages. Build tooling remains a workspace concern;
consumers do not configure the library's compiler or CSS pipeline.

The workspace does not require task-distribution infrastructure. Additional
monorepo tooling should be introduced only for a concrete scaling need.
