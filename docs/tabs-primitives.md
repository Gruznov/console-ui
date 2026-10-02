# Tabs Primitives

## Purpose

The Tabs family switches between related local panels without leaving the
current page:

```text
Tabs
TabsList
TabsTrigger
TabsContent
```

It provides compact `surface` and `line` treatments, horizontal and vertical
orientation, controlled and uncontrolled selection, disabled tabs, and
standards-based keyboard interaction.

Tabs are not a navigation component. Route changes remain links owned by the
consumer and its framework.

## Interaction foundation

Console UI uses
[Base UI Tabs](https://base-ui.com/react/components/tabs) internally. Base UI
provides tab/list/panel roles, relationships, focus management, arrow-key
navigation, Home/End behavior, disabled-item handling, and controlled or
uncontrolled selection. The dependency is an implementation detail:

- consumers import only `@polyconsole/console-ui`;
- public prop types do not re-export Base UI types;
- Next.js and router APIs are not dependencies;
- shared CSS owns the focus and visual treatment.

## Public contract

### Tabs

`Tabs` is the root and accepts:

- `defaultValue` for uncontrolled selection, or `value` for controlled
  selection;
- `onValueChange` for selection changes;
- `orientation="horizontal" | "vertical"`;
- native `div` attributes and a forwarded ref.

Values are strings. A controlled root may use `null` for no active panel.
Selection is deliberately explicit: every root must receive either
`defaultValue` or `value`. This avoids an ambiguous server-rendered initial
state, especially when the first tab is disabled.

### TabsList

`TabsList` groups the triggers and accepts:

- `variant="surface" | "line"`;
- `activationMode="manual" | "automatic"`;
- `loop` to control whether arrow focus wraps at the list boundary;
- an accessible label through `aria-label` or `aria-labelledby`.

The defaults are `surface`, `manual`, and looping focus.

Manual activation moves focus with the orientation-appropriate arrow keys but
changes the active panel only with Enter or Space. It is the safe default for
operational consoles because merely exploring the tab list does not change
visible state.

Automatic activation changes the panel when arrow-key focus moves. Use it only
when every panel is already available and activation is immediate and
consequence-free.

### TabsTrigger

`TabsTrigger` renders a native `button` with `type="button"`. It accepts a
required string `value`, native button attributes, `disabled`, arbitrary React
children, and a forwarded button ref.

The API intentionally does not expose Base UI's polymorphic link rendering. A
control that changes the URL is navigation and should remain a real link.

### TabsContent

`TabsContent` renders the panel corresponding to its required string `value`.
It accepts native `div` attributes, a forwarded ref, and `keepMounted`.

Use `keepMounted` only when hidden panel state or measurement must survive.
Hidden content must not create duplicate announcements or background work.

## Example

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@polyconsole/console-ui";

<Tabs defaultValue="overview">
  <TabsList aria-label="Queue worker views">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger disabled value="diagnostics">
      Diagnostics
    </TabsTrigger>
  </TabsList>

  <TabsContent value="overview">{/* overview */}</TabsContent>
  <TabsContent value="activity">{/* recent activity */}</TabsContent>
  <TabsContent value="diagnostics">{/* unavailable */}</TabsContent>
</Tabs>
```

Controlled selection remains product-owned:

```tsx
<Tabs value={view} onValueChange={setView}>
  {/* triggers and panels */}
</Tabs>
```

The view id may be reflected into the URL by product code, but Tabs does not
read or mutate routing state.

## Keyboard contract

With `activationMode="manual"`:

| Key | Horizontal list | Vertical list |
|---|---|---|
| ArrowRight | focus next tab | no tab-list movement |
| ArrowLeft | focus previous tab | no tab-list movement |
| ArrowDown | no tab-list movement | focus next tab |
| ArrowUp | no tab-list movement | focus previous tab |
| Home | focus first tab | focus first tab |
| End | focus last tab | focus last tab |
| Enter or Space | activate focused tab | activate focused tab |
| Tab | leave the tab list through the active panel flow | same |

With automatic activation, the appropriate arrow key both focuses and activates
the next tab. Disabled tabs may receive roving focus for discovery, but they
cannot be activated.

The package supplies a visible focus treatment for triggers and focusable
panels, plus forced-colors and reduced-motion behavior.

## Visual contract

Both variants use compact controls, muted inactive text, explicit active text,
and tokenized focus.

`surface` is the default segmented treatment for compact local views. It uses a
muted list surface and a neutral active segment.

`line` is quieter and works for dense subsection navigation. Its active
indicator follows orientation: bottom edge for horizontal lists and right edge
for vertical lists.

Icons are ordinary children. Console UI sizes direct SVG children but does not
require a specific icon package.

## Product boundaries

Consumers retain:

- view ids and view-state ownership;
- URL synchronization and browser history;
- permissions and disabled-state policy;
- data fetching, polling, and caching;
- loading, empty, stale, unavailable, and error presentation;
- analytics;
- whether hidden panels stay mounted;
- responsive overflow policy for unusually long labels.

Tabs must not hide consequential actions behind activation without explicit
labels, and tab changes must not imply that a background command succeeded.

## Deliberate non-goals

The Tabs family does not add:

- route or sidebar navigation;
- a Next.js Link adapter;
- closeable or reorderable tabs;
- tabs created from product domain objects;
- badges, counts, or icons as dedicated props;
- lazy loading or data fetching;
- persistence to local storage;
- an animated layout indicator;
- mobile dropdown conversion.

These behaviors can be composed by consumers after real product evidence
establishes a shared need.
