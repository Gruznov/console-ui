# Button Primitives

## Public API

Console UI exports:

- `Button`;
- `IconButton`;
- `ButtonProps` and `IconButtonProps`;
- `ButtonVariant`;
- `ButtonSize`.

### Variants

| Variant | Intended use |
|---|---|
| `primary` | the main action in the current region |
| `secondary` | a bordered neutral action |
| `ghost` | a quiet action in established chrome |
| `danger` | an explicit destructive or consequential action |

The API deliberately omits `default`, `outline`, and `link`:

- `primary` describes intent more clearly than `default`;
- outlined and secondary actions share one neutral role;
- navigation remains an anchor or router link instead of becoming a button
  with link styling.

### Sizes

| Size | Height | Use |
|---|---:|---|
| `sm` | 24 px | dense secondary toolbars |
| `md` | 32 px | normal console control |
| `lg` | 36 px | higher-emphasis or narrow-layout action |

`md` is the default. IconButton uses the same sizes as square dimensions.

## Examples

```tsx
import { Button, IconButton } from "@gruznov/console-ui";

<Button onClick={runChecks}>Run checks</Button>

<Button
  pending={isSaving}
  pendingLabel="Saving changes"
  onClick={saveChanges}
>
  Save changes
</Button>

<IconButton label="Refresh data" onClick={refresh}>
  <RefreshIcon aria-hidden="true" />
</IconButton>
```

## Native semantics

Button renders a native `<button>` and defaults to `type="button"` so a
consumer does not accidentally submit a form. Consumers may explicitly pass
`type="submit"` where form submission is intended.

The primitive does not own:

- authorization;
- confirmation;
- mutation execution;
- routing;
- error recovery;
- product analytics.

Event handlers and domain behavior stay in the consumer.

## Pending and disabled

`pending`:

- sets `aria-busy="true"`;
- disables the control to prevent duplicate submission;
- shows a reduced-motion-aware progress indicator;
- uses `pendingLabel` when supplied;
- preserves the original content when no pending label is supplied.

A product should provide an explicit pending label for text buttons when the
operation is not instantaneous. Disabled means unavailable; pending means an
accepted operation is still running.

## IconButton accessible name

IconButton requires a `label` string and publishes it as the accessible name.
The icon remains decorative. When `pendingLabel` is supplied, it becomes the
temporary accessible name while the spinner is visible.

IconButton does not invent a tooltip. Compose Tooltip explicitly when needed;
it must not replace this primitive's accessible name.

## Focus, contrast, and motion

The components consume the shared foundation and interaction tokens:

- action foreground and surfaces;
- neutral surfaces and borders;
- the two-layer `focus-visible` indicator;
- disabled opacity;
- motion duration and easing.

Danger uses action-danger tokens, never passive status-danger tokens.
Forced-colors mode receives a system border and focus outline. Active
translation and the progress animation respect the reduced-motion foundation.

## Deliberate boundary

Button itself does not own split-button behavior, menus, confirmation dialogs,
tooltips, or application adapters. ActionLink and Tooltip are separate exports
with their own semantics.
