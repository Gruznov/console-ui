# Separator Primitive

## Public API

Console UI exports:

- `Separator`;
- `SeparatorProps`;
- `SeparatorOrientation`.

```tsx
import { Separator } from "@polyconsole/console-ui";

<Separator aria-label="Current queue and recent activity" />
<Separator decorative />
<Separator decorative orientation="vertical" />
```

`orientation` is `horizontal` by default and accepts `horizontal` or
`vertical`. The component has no children.

## Semantic separator

Separator is semantic by default. It renders a native `<hr>`, whose implicit
role is `separator`, with an explicit `aria-orientation`.

Use a semantic Separator when the boundary itself communicates a transition
between named regions, groups, or modes. An accessible label is optional; add
one only when it clarifies a boundary that is not already evident from nearby
headings.

## Decorative separator

Set `decorative` when the surrounding HTML already communicates the structure:

- between items in a list or feed;
- between controls in a toolbar;
- between visual columns with their own headings;
- where a repeated row border only accelerates scanning.

Decorative separators receive `role="presentation"` and no orientation in the
accessibility tree. This avoids announcing a boundary between every row in long
operational feeds.

## Geometry and color

A horizontal Separator is one pixel high and fills the available width. A
vertical Separator is one pixel wide and stretches to the cross-axis size
established by its parent.

The line uses `--console-border-subtle`, the token defined for quiet separators
inside dense layouts. Forced-colors mode uses the system text color so the
boundary remains visible.

Separator owns no margin. Consumers control spacing through the parent layout;
baking whitespace into the primitive would make dense lists and compact
toolbars inconsistent.

## Deliberate boundary

Separator does not add labels inside lines, gradients, dotted or dashed styles,
status colors, strength variants, spacing props, or automatic row wrappers.

Borders that belong to a component's own chrome should stay with that component:
CardHeader and CardFooter use their `separated` relationship, tables own row
borders, and shell regions own their structural boundaries. Separator is for a
boundary that participates in composition.
