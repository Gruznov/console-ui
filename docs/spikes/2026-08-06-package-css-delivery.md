# Package and CSS delivery spike

Date: 2026-08-06

Status: ready-to-import CSS selected

## Question

Can a package deliver predictable component styles without coupling applications
to its authoring pipeline?

The [reproducible fixture](../../spikes/css-delivery/README.md) compares compiled,
package-owned CSS with Tailwind source that each consumer scans and compiles.
It models a Button, a ConsoleFrame, separate tokens, light and dark values,
and isolated Tailwind 4.2.1 and 4.3.0 runners.

## Result and decision

Both runner versions compile the source approach when explicitly configured
with `@source`. The compiled CSS approach needs no consumer Tailwind processing,
can also be used without Tailwind, and gives the package control over selectors
and cascade layers.

Ship ready-to-import CSS with independently importable tokens. Exclude
comparison-only component source from the package artifact. The fixture checks
for package-owned selectors, explicit exports, absence of reset and Tailwind
directives in the compiled artifact, and npm-compatible package contents.

See [ADR 0005](../decisions/0005-css-delivery.md) for the accepted styling
contract. Package registry access and publisher migration are separate topics
covered by the [release process](../release-process.md).
