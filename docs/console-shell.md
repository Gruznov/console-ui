# Console Shell and Page Grammar

## Public API

Console UI exports:

- `ConsolePageHeader`;
- `ConsoleIdentity`;
- `ConsoleNavigation`;
- `ConsoleShell`;
- product-neutral service, environment, navigation, and renderer types.

The components provide presentation and accessible structure. Consumers retain
routing, auth, permissions, status interpretation, refresh behavior, data
loading, mutations, and framework providers.

## Identity

`ConsoleServiceDescriptor` requires a visible service name, mark, semantic tone,
and environment. `ConsoleIdentity` always renders the environment as text with
an explicit accessible name. Color remains a secondary context cue.

```tsx
const service = {
  id: "example-console",
  name: "Example",
  description: "operations",
  mark: <ExampleMark />,
  tone: "teal",
  environment: "production",
} satisfies ConsoleServiceDescriptor;
```

Service names are application data, not package presets. The shared source
imports no consumer applications or domain models.

## Navigation

Navigation is supplied as groups of display-ready items. Each item declares its
URL and current state; Console UI does not derive routes or inspect the browser.
Level-two items support dense product-owned subnavigation without requiring a
specific router.

The default renderer is a native anchor. `renderNavigationLink` receives the
item plus complete anchor semantics so a consumer can use a framework link
without adding Next.js to the shared package:

```tsx
<ConsoleShell
  navigation={navigation}
  renderNavigationLink={(item, props) => <ProductLink {...props} />}
  service={service}
>
  {children}
</ConsoleShell>
```

The adapter must preserve `aria-current`, `aria-disabled`, `tabIndex`, data
attributes, and children from the supplied props.

## Shell composition

`ConsoleShell` renders a landmark-based frame with:

- permanent service and environment identity;
- grouped navigation;
- an optional sidebar footer;
- an optional topbar slot;
- a bounded scan-first workspace;
- responsive single-column behavior;
- an opt-in desktop navigation rail that preserves icon access while widening
  the workspace;
- a native, keyboard-operable navigation disclosure below 64 rem that keeps
  the current destination visible while the full navigation is closed.

`navigationToggleLabel` customizes the disclosure label. Routes, current-item
selection, and link behavior remain consumer-owned; Console UI owns only the
presentational open/closed state and closes the compact navigation after a link
is selected.

Set `navigationCollapsible` to render the desktop collapse control. The shell
keeps that preference as local component state and starts expanded unless
`defaultNavigationCollapsed` is true. In the collapsed rail, string labels are
available as native hover titles, non-current level-two items are hidden, and
all link names remain available to assistive technology. The service mark and
environment indicator stay visible with hover titles. The desktop state does
not alter the compact navigation below 64 rem.

It renders a `main` landmark by default. `as="div"` is available for embedded
previews or a consumer that already owns the document's main landmark.

The shell does not poll, read data, navigate, authenticate, or deploy anything.
Product providers remain outside it or inside explicit slots supplied as
children.

## Page header

`ConsolePageHeader` supports an icon, title, description, status, and actions.
Consumers choose `h1`, `h2`, or `h3` through `headingAs` so the component fits
the page's real document outline. Actions and status are slots; the component
does not infer permissions or operational state.

## Integration boundary

Use representative stories and application-level tests to validate shell
composition in each consumer. Check narrow navigation, open and closed states,
keyboard access, document width, and framework adapters. A shared component
fixture cannot validate an application's routing, permissions, or data flow.
