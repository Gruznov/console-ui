# DataTableFrame

`DataTableFrame` provides the repeated operational table boundary that is safe
to share: a labeled region, keyboard focus, horizontal and optional vertical
scrolling, a visible focus ring, and an optional sticky table header.

Horizontal overscroll stays inside the frame. Vertical wheel and trackpad
gestures continue to the page when the frame has no remaining vertical range,
so a wide table cannot trap document scrolling.

The consumer must provide a human-readable `label`. The consumer also chooses
`minWidth` from its real columns and may set `maxHeight`; Console UI does not
guess either value. `tabIndex` defaults to `0` so keyboard users can reach and
scroll a wide table, but consumers may override it when an enclosing accessible
region already owns scrolling.

Sorting, selection, row actions, pagination, empty/error presentation, column
visibility, and product status mapping remain outside the frame.
