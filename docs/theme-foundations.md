# Theme Foundations

## Foundation values

The stylesheet defines a coherent OKLCH neutral axis for surfaces, text,
borders, inputs, and actions in light and dark themes. Role-based token names
keep this visual contract independent from application branding.

## Value policy

Related roles use adjacent values on the same neutral axis. Hover and active
colors are ordered steps; they do not introduce a separate brand palette.
Shadows remain restrained because the interface relies primarily on borders
and surface shifts.

Typography and sizing follow the [design principles](design-principles.md):
13–14 px primary text, 12–13 px metadata, 32 px controls, and 36 px repeated
rows. The hit-area token is 44 px, with components responsible for applying an
appropriate target in context. Framework-independent system font stacks are
the default; an application may map its loaded font at its theme boundary.

## Theme contract

- `:root` provides foundation values and the light default.
- `[data-console-theme="light"]` creates an explicit light boundary.
- `[data-console-theme="dark"]` creates an explicit dark boundary.
- Theme boundaries may be placed below the document root, which enables
  side-by-side previews and scoped adoption.
- The token package does not depend on a consumer's generic `.dark` selector.
  A product theme controller sets `data-console-theme` at its application
  boundary.

The selectors only declare custom properties and `color-scheme`; they do not
reset elements or style product markup.

## Density and motion

Compact remains the only public density baseline:

- `control-height`: 32 px;
- `row-min-height`: 36 px;
- `hit-target-min`: 44 px;
- spacing is a restrained 4–48 px scale;
- numeric content uses tabular figures.

The duration tokens collapse to `0.01ms` under
`prefers-reduced-motion: reduce`. Components remain responsible for avoiding
motion that is unnecessary even when animation is technically allowed.

## Deliberate boundary

The neutral foundation layer does not assign:

- status or destructive-action values;
- focus-ring and disabled-state values;
- service identity values;
- environment identity values.

Those groups require their own contrast, interaction, and identity validation
in the status, focus, and context layers. Chart palettes, application branding, and consumer-owned
layout widths remain outside the initial inventory.
