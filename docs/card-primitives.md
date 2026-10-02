# Card Primitives

## Public API

Console UI exports:

- `Card`, `CardProps`, `CardSize`, and `CardElement`;
- `CardHeader` and `CardHeaderProps`;
- `CardTitle`, `CardTitleProps`, and `CardTitleElement`;
- `CardDescription` and `CardDescriptionProps`;
- `CardAction` and `CardActionProps`;
- `CardContent` and `CardContentProps`;
- `CardFooter` and `CardFooterProps`.

The family is compositional. Consumers include only the regions needed by a
particular card.

## Example

```tsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
} from "@gruznov/console-ui";

<Card as="article" aria-labelledby="worker-title">
  <CardHeader separated>
    <CardTitle as="h3" id="worker-title">
      Queue worker
    </CardTitle>
    <CardDescription>Processing the primary queue.</CardDescription>
    <CardAction>
      <StatusBadge tone="success">Healthy</StatusBadge>
    </CardAction>
  </CardHeader>
  <CardContent>{/* product-owned data */}</CardContent>
</Card>
```

## Density

`md` is the default container rhythm:
16 px outer block padding, 16 px section inset, and 12 px between regions.

`sm` uses 12 px outer padding and inset with 8 px between regions. It is for
metric grids, narrow supporting panels, and other information-dense console
regions. It does not reduce text below the shared 12 px floor.

Consumers should choose one size for adjacent cards in the same visual group.
Arbitrary padding props are intentionally absent; repeated one-off density
values would undermine predictability.

## Structure and headings

Card defaults to a neutral `<div>`. Set `as="article"` when a card is a
self-contained item, or `as="section"` when it is a named region in the page.
The component does not infer a landmark.

CardTitle defaults to a `<div>` because a design-system primitive cannot know
the page's heading hierarchy. Consumers set `as="h2"` through `as="h6"` when
the title is a heading. This supports semantic headings without forcing every composition into the
same level.

CardDescription renders a paragraph and is intended for concise supporting
copy. It is not a generic content slot.

When CardAction is a direct child of CardHeader, the header allocates a compact
second column. The action spans the title and description rows and remains
top-aligned. A badge, button, or menu trigger retains its own semantics.

## Separators

`separated` on CardHeader or CardFooter adds a full-width structural boundary.
It should distinguish stable regions, not decorate every card. The standalone
Separator handles boundaries between composed regions; these booleans express
only the well-evidenced card-header and card-footer relationship.

## Semantics and accessibility

The family adds no click, link, live-region, status, or heading semantics
implicitly. A card is not itself an action. Navigation uses an anchor and
mutations use a Button inside an appropriate region.

Consumers own:

- the heading level and `aria-labelledby` relationship;
- live updates and announcements;
- status interpretation;
- loading, empty, unavailable, and error states;
- keyboard behavior for interactive descendants.

Visible text must continue to carry status meaning. Color may reinforce a
StatusBadge or another explicit component, but the base Card remains neutral.

## Deliberate boundary

The Card family does not define metric interpretation, clickable cards, media
layouts, loading policy, or application-specific headers. Higher-level patterns
need their own reusable contract before joining the shared API.
