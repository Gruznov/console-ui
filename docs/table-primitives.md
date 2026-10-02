# Table Primitives

## Purpose

The Table family provides predictable, compact native table elements for
operational data. It preserves browser table semantics while normalizing the
visual rhythm of dense operational interfaces.

The family contains:

```text
Table
TableHeader
TableBody
TableFooter
TableRow
TableHead
TableCell
TableCaption
```

It does not provide a scroll container, minimum content width, sorting,
selection behavior, pagination, sticky columns, virtualization, or product
state mapping.

## Native contract

Every component renders the native element named by its API and forwards its
ref:

| Component | Element |
|---|---|
| `Table` | `table` |
| `TableHeader` | `thead` |
| `TableBody` | `tbody` |
| `TableFooter` | `tfoot` |
| `TableRow` | `tr` |
| `TableHead` | `th` |
| `TableCell` | `td` |
| `TableCaption` | `caption` |

Public props are the corresponding native React props. `className`, `scope`,
`colSpan`, `rowSpan`, `aria-*`, and `data-*` attributes pass through. Console UI
does not add table, grid, selection, or live-region roles.

Use an explicit caption when the surrounding heading does not already identify
the dataset. Set header scope at the use site because a `th` may be a column
header, row header, or corner cell:

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@polyconsole/console-ui";

<Table>
  <TableCaption>Queue workers · updated 12 seconds ago</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Worker</TableHead>
      <TableHead scope="col">State</TableHead>
      <TableHead scope="col">Processed</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>worker-eu-02</TableCell>
      <TableCell>Healthy</TableCell>
      <TableCell>2,841</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

An empty action header still needs an accessible name, for example
`<TableHead scope="col" aria-label="Open worker" />`.

## Density and styling

The shared styles establish:

- the compact `--console-row-min-height`;
- `--console-font-size-xs` data text;
- muted, medium-weight headers without forced uppercase;
- quiet row boundaries;
- a muted header and footer surface;
- tabular structure without an outer card or shadow;
- a body-row hover guide for scanning dense data;
- selected-row presentation for `data-state="selected"`;
- a bottom caption with muted text;
- forced-colors and reduced-motion behavior.

Cells are non-wrapping by default to support dense operational columns. A consumer may override `white-space` through
`className` for a description or other rich cell. Numeric alignment, numeric
font, column width, truncation, and sticky behavior remain consumer layout
decisions.

The hover background is only a scan guide. It does not make a row clickable,
focusable, selected, or interactive.

## Overflow boundary

`Table` never creates a wrapper and never sets a minimum width. The screen that
knows its columns owns those decisions:

```tsx
<div className="worker-table-frame">
  <div className="worker-table-width">
    <Table>{/* semantic table content */}</Table>
  </div>
</div>
```

```css
.worker-table-frame {
  overflow-x: auto;
}

.worker-table-width {
  min-width: 45rem;
}
```

A narrow table may render directly in a known-width surface. A wide health
table may need more space than a short history table. Encoding either value in
the primitive would turn a local layout choice into a global policy.

`DataTableFrame` now owns this reusable overflow boundary. Its `minWidth` prop
sets a content floor while the content wrapper still fills the available frame:
a 45rem table grows to a 70rem desktop surface, but remains 45rem wide and
scrollable in a 24rem surface. Consumers must not combine percentage table
width with `table-layout: fixed` inside an intrinsically sized frame unless
they also provide explicit column widths; that combination can create a cyclic
max-content calculation in browsers.

## Interaction and product boundaries

Row actions must be real buttons or links inside cells. Do not attach an
unlabeled click handler to `TableRow`.

`data-state="selected"` is a visual hook only. If a product supports selection,
it owns:

- the checkbox, radio, or other selection control;
- the accessible label and selected-state semantics;
- keyboard behavior;
- controlled selection state;
- authorization and bulk actions.

Products also retain sorting, filter state, column definitions, empty/loading
states, freshness interpretation, status-to-tone mapping, formatting,
pagination, and mutations. Console UI must not interpret domain values such as
`healthy`, `delayed`, `critical`, `connected`, or `stale`.

## Deliberate non-goals

The native Table family does not add:

- a `DataTable` abstraction or column-definition DSL;
- automatic responsive card conversion;
- sortable or resizable headers;
- row click behavior;
- selection state management;
- sticky headers or columns;
- pagination or filtering;
- virtualization;
- loading, empty, or error rows;
- product-specific minimum widths.

Those behaviors require product evidence and can be composed around the native
Table family without changing its semantic contract.
