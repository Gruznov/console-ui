# `@polyconsole/console-ui`

Product-neutral React foundations for operational consoles.

This package is included in the public source workspace. Registry availability
is configured separately; see the repository README before installing from npm.

The package exports these component families:

- `Button`;
- `IconButton`;
- `ActionLink`;
- `Badge`;
- `StatusBadge`;
- `FeedbackState` and `InlineNotice`;
- `FilterToolbar`, `FilterGroup`, and `FilterButton`;
- `FormField`, `Input`, `Textarea`, `Select`, `FormGrid`, and `FormActions`;
- `ChoiceGroup`, `ChoiceCard`, and `ProgressSteps`;
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`,
  `CardContent`, and `CardFooter`;
- `Separator`;
- `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`,
  `TableCell`, and `TableCaption`;
- `DataTableFrame`;
- `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`;
- `Tooltip`;
- `ConsolePageHeader`;
- `ConsoleIdentity`, `ConsoleNavigation`, and `ConsoleShell`;
- their public prop and supporting types.

Consumers import package styles once at the application root:

```css
@import "@polyconsole/design-tokens/tokens.css";
@import "@polyconsole/console-ui/styles.css";
```

```tsx
import {
  ActionLink,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConsolePageHeader,
  ConsoleShell,
  FilterButton,
  FilterGroup,
  FilterToolbar,
  IconButton,
  Separator,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
} from "@polyconsole/console-ui";

<Button variant="primary">Run checks</Button>

<ActionLink href="/workers/new" variant="primary">Add worker</ActionLink>

<IconButton label="Refresh data">
  <RefreshIcon aria-hidden="true" />
</IconButton>

<Badge>read only</Badge>
<StatusBadge tone="success">Healthy</StatusBadge>

<Card as="article" aria-labelledby="worker-title">
  <CardHeader>
    <CardTitle as="h3" id="worker-title">Queue worker</CardTitle>
    <CardDescription>Processing the primary queue.</CardDescription>
    <CardAction>
      <StatusBadge tone="success">Healthy</StatusBadge>
    </CardAction>
  </CardHeader>
  <CardContent>Product-owned data</CardContent>
</Card>

<Separator decorative />
<Separator orientation="vertical" aria-label="Primary and secondary actions" />

<Table>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Worker</TableHead>
      <TableHead scope="col">State</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>worker-eu-02</TableCell>
      <TableCell>Healthy</TableCell>
    </TableRow>
  </TableBody>
</Table>

<Tabs defaultValue="overview">
  <TabsList aria-label="Worker views">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Worker summary</TabsContent>
  <TabsContent value="activity">Recent activity</TabsContent>
</Tabs>

<Tooltip content="Age of the latest stored projection.">
  <IconButton label="About projection freshness" size="sm" variant="ghost">
    <InfoIcon aria-hidden="true" />
  </IconButton>
</Tooltip>

<FilterToolbar actions={<Button size="sm" variant="secondary">Refresh</Button>}>
  <FilterGroup label="Queue state">
    <FilterButton selected>All</FilterButton>
    <FilterButton>Running</FilterButton>
    <FilterButton>Failed</FilterButton>
  </FilterGroup>
</FilterToolbar>

<ConsoleShell
  navigation={navigation}
  service={service}
  topbar={<StatusBadge tone="success">Healthy</StatusBadge>}
>
  <ConsolePageHeader
    title="Overview"
    description="Current operational state."
  />
  {productOwnedContent}
</ConsoleShell>
```

Button variants are `primary`, `secondary`, `ghost`, and `danger`. Sizes are
`sm`, `md`, and `lg`. Passing `pending` sets native disabled and busy semantics;
`pendingLabel` supplies explicit progress copy.

Button renders a native button and defaults to `type="button"`. Navigation,
authorization, mutations, and confirmation remain consumer-owned.

ActionLink renders a native anchor with the same visual variants and sizes as
Button. Framework consumers can pass `renderLink` to supply their router link
without importing routing dependencies into Console UI.

Badge is a neutral metadata label. StatusBadge accepts `neutral`, `info`,
`success`, `warning`, and `danger`; consumers own the mapping from domain state
to tone. Both render a non-interactive span and never create a live region
implicitly.

Card is a neutral, compositional surface with `md` and `sm` density. Its root
can render as `div`, `article`, or `section`; CardTitle can render as a heading
when the consumer knows the correct page hierarchy. The family does not add
status, metric, click, or live-region behavior.

Separator is semantic and horizontal by default. Use `decorative` when list,
feed, toolbar, or heading structure already conveys the grouping. Spacing
belongs to the consumer layout rather than the one-pixel primitive.

The Table family renders native table elements and forwards native props and
refs. `DataTableFrame` supplies a labeled, keyboard-focusable overflow region;
consumers explicitly provide minimum width and optional maximum height or
sticky-header policy. Sorting, selection, pagination, and product state mapping
remain consumer-owned.

Tabs switches between related local panels. It uses string values, requires an
explicit controlled or uncontrolled selection, and defaults to manual keyboard
activation. `surface` and `line` list variants support horizontal and vertical
orientation. Route navigation, URL state, data loading, permissions, and
product view ids remain consumer-owned.

FilterToolbar arranges a wrapping FilterGroup and optional action slot.
FilterButton exposes native pressed-state semantics through `selected` while
query state, counts, loading, and filtering remain consumer-owned.

ConsoleShell composes permanent service/environment identity, grouped
navigation, topbar and content slots. Use `density="compact"` for scan-first
operational screens and `contentWidth="fluid"` when wide tables need the full
workspace. `navigationCollapsible` adds an opt-in desktop icon rail without
changing the compact mobile disclosure; the backwards-compatible defaults
remain `comfortable`, `contained`, and expanded navigation. ConsolePageHeader
composes title, description, status and action slots. Routing adapters, refresh,
auth, permissions, status mapping, and domain content remain consumer-owned.

`@base-ui/react` is an internal runtime dependency used for accessible Tabs
and Tooltip interaction. Consumers depend on the Console UI API rather than
importing Base UI types or components.
