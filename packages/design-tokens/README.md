# `@polyconsole/design-tokens`

Framework-independent semantic tokens for operational consoles.

This package exposes versioned token metadata and ready-to-import CSS: light and
dark themes, typography, spacing, sizing, radius, elevation, motion, status,
destructive actions, focus, disabled treatment, service tones, and explicit
production, staging, development, and local environment contexts.

The package is included in the public source workspace. Registry availability
is configured separately; see the repository README before installing from npm.

```css
@import "@polyconsole/design-tokens/tokens.css";
```

Light is the root default. Explicit theme boundaries support scoped adoption
and side-by-side rendering:

```html
<main data-console-theme="dark">...</main>
```

Context values require explicit service and environment attributes:

```html
<main
  data-console-theme="dark"
  data-console-service="beacon"
  data-console-service-tone="violet"
  data-console-environment="production"
>
  ...
</main>
```

Attributes bind presentation only. Consumers must still render the service and
environment as visible, accessible text.

Tooling can inspect the contract without parsing CSS:

```js
import inventory from "@polyconsole/design-tokens/token-inventory.json" with {
  type: "json",
};
```

The package intentionally has no React, framework, or product dependency.
