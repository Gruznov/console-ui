# Service and Environment Identity

## Purpose

A portable identity contract keeps the active service and environment visible
across similar consoles. It provides presentation values without owning
application routing, authorization, or service switching.

## Context selector contract

The token package binds context values through two attributes:

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

The package styles product-neutral service tones:

- `neutral`;
- `violet`;
- `teal`.

The fictional reference descriptors map Atlas to `neutral`, Beacon to `violet`,
and Compass to `teal`. Service names remain outside the token stylesheet. A future
descriptor may instead provide custom context values without changing token
names.

Supported environment identities are:

- `production`;
- `staging`;
- `development`;
- `local`.

Service-tone values inherit through descendants. `data-console-service`
identifies the consumer context but does not select a palette.
`data-console-service-tone` binds the reference values. Environment values may
be placed on the same boundary or on an individual environment indicator.
Dark-theme overrides work when the theme and context attributes share an
element or when the context element is inside a dark-theme boundary.

The absence of a service-tone or environment attribute intentionally leaves
its variables undefined. A shell must not silently present an arbitrary
service or environment.

## Token roles

Service identity has three roles:

- `service-accent` for a persistent mark or narrow identity edge;
- `service-accent-foreground` for content directly on that accent;
- `service-accent-surface` for a quiet identity-bearing region.

Environment identity has four roles:

- `environment-accent` for the strongest environment cue;
- `environment-foreground` for content directly on that accent;
- `environment-surface` for a quiet environment region;
- `environment-border` for its explicit boundary.

Service and environment values are context tokens, not status tokens. They
must not be used for success, warning, failure, progress, or action meaning.

## Accessible presentation contract

Identity color is never sufficient by itself. A permanent shell descriptor
must expose:

1. the service name in visible text;
2. a visible environment label;
3. the same environment label in the accessible name;
4. a stable location that does not move between related consoles.

Marks, initials, and color remain supplementary. Production, staging,
development, and local are explicit words rather than meanings inferred from a
dot.

The reference values enforce:

- service accent foreground contrast of at least `4.5:1`;
- environment accent foreground contrast of at least `4.5:1`;
- environment border contrast against its quiet surface of at least `3:1`;
- light and dark variants for all supported reference contexts.

Package tests derive these ratios from the shipped OKLCH declarations.

## Product and component ownership

The token package owns the reference context values and selector behavior.
Products continue to own:

- the service descriptor data;
- the mark or icon;
- the environment source of truth;
- authorization, routing, and service destinations.

`ConsoleIdentity` renders the shared service and environment descriptor. See
[Console shell](console-shell.md) for the component contract. Cross-service
switching remains application-owned.
