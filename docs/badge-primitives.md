# Badge Primitives

## Public API

Console UI exports:

- `Badge` and `BadgeProps`;
- `StatusBadge` and `StatusBadgeProps`;
- `StatusTone`.

`StatusTone` uses the shared operational vocabulary:

```text
neutral | info | success | warning | danger
```

## Badge

Badge is a neutral metadata label. It is appropriate for identifiers, access
modes, categories, versions, and other compact facts that do not imply health
or severity.

```tsx
import { Badge } from "@gruznov/console-ui";

<Badge>read only</Badge>
<Badge>worker-02</Badge>
```

Badge intentionally has no `tone` prop. Adding a status color to generic
metadata would make presentation ambiguous and encourage domain semantics to
leak into the primitive.

## StatusBadge

StatusBadge presents an already interpreted state:

```tsx
import { StatusBadge } from "@gruznov/console-ui";

<StatusBadge tone="success">Healthy</StatusBadge>
<StatusBadge tone="warning">Stale</StatusBadge>
<StatusBadge tone="danger">Failed</StatusBadge>
```

The default tone is `neutral`. The default indicator is decorative and helps
operators scan repeated rows; visible text remains mandatory. Set
`indicator={false}` when the surrounding layout is especially constrained and
the label remains explicit.

## Product adapter boundary

Products translate domain states before rendering:

```tsx
import { StatusBadge, type StatusTone } from "@gruznov/console-ui";

const serviceTone: Record<ServiceState, StatusTone> = {
  active: "success",
  stale: "warning",
  critical: "danger",
  checking: "info",
  unknown: "neutral",
};

<StatusBadge tone={serviceTone[state]}>{serviceLabel[state]}</StatusBadge>
```

Console UI does not interpret strings such as `active`, `connected`,
`critical`, `queued`, or `attention_required`. The same raw word may require a
different tone in another product context.

## Semantics and accessibility

Both components render a non-interactive native `<span>` and pass through
normal span attributes, a consumer class, and a ref.

StatusBadge does not automatically set `role="status"`, `aria-live`, or an
alert role. Most badges are static labels; making every render a live region
would create noisy announcements. A product that needs to announce a changing
state owns the live region around that update.

Badges are not buttons. Filtering, navigation, removal, or menu behavior must
use the corresponding interactive element and its keyboard contract.

## Density and contrast

The shared pill is 22 px high with 12 px text. This stays compact in tables and
toolbars with readable metadata. StatusBadge consumes the tested text, surface, and
border token families in both themes. The
indicator is `aria-hidden`; color reinforces the visible label rather than
replacing it.

Forced-colors mode retains an explicit system border. No animation or hover
treatment is applied because the primitives are presentational.

## Deliberate boundary

The Badge family does not add removable tags, filter chips, counts, interactive links,
live-region orchestration, or domain state maps. Domain-specific counts remain an
application pattern until a second consumer demonstrates the same contract.
