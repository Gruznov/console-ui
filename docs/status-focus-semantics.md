# Status and Focus Semantics

## Purpose

The shared vocabulary presents operational states without interpreting domain
records. Semantic `--console-*` roles provide light and dark values tested
against the contrast requirements below.

## Operational vocabulary

| Tone | Meaning | Not equivalent to |
|---|---|---|
| `neutral` | known state without positive or negative judgment | missing, stale, or checking |
| `info` | relevant progress or contextual information | success |
| `success` | confirmed healthy or completed outcome | merely available or non-empty |
| `warning` | impaired, delayed, or attention-required state | failure |
| `danger` | failed, unsafe, rejected, or destructive state | unavailable without evidence |

Product adapters own the mapping from domain states to this vocabulary.
Console UI owns only presentation.

Every tone has independent `text`, `surface`, and `border` values. Components
must use visible text or another explicit cue; color alone never carries the
meaning.

## Contrast contract

For every light and dark status family:

- status text against its status surface is at least `4.5:1`;
- status border against its status surface is at least `3:1`;
- destructive-action foreground against default, hover, and active surfaces is
  at least `4.5:1`;
- the focus ring against its offset color is at least `3:1`.

The package tests derive relative luminance from the actual OKLCH declarations.
This keeps contrast validation coupled to the shipped CSS rather than a
separate list of expected colors.

## Destructive actions

`action-danger-*` is reserved for a consequential operation, not for passive
failure text. A destructive control still requires:

- an explicit verb and object;
- product-owned authorization;
- pending and failure handling;
- confirmation when the action is difficult to reverse.

Status danger tokens present a state. Action danger tokens present an
operation. They may share a hue but not meaning.

## Focus

The reference treatment uses a two-layer keyboard focus indicator:

1. `focus-offset` separates the control from its surroundings;
2. `focus-ring` supplies the visible outer boundary.

Shared components should apply it with `:focus-visible`, retain a transparent
outline for forced-colors compatibility, and never remove browser focus without
an equivalent visible replacement.

The focus hue is intentionally stable across status and product identity. A
warning, danger state, or service accent must not make keyboard position
ambiguous.

## Disabled

`opacity-disabled` is `0.62`.
Opacity supplements native `disabled` or `aria-disabled` semantics; it is not a
substitute for them.

Disabled and pending are different:

- disabled means the operation is unavailable;
- pending means an accepted operation is still in progress;
- disabled controls are exempt from minimum text contrast, but adjacent
  explanatory text should remain readable.

## Deliberate boundary

Status and focus tokens do not define service accents or runtime environment
identity. Those values are defined separately in
[Service and environment identity](context-identity.md) so they preserve status
meaning when used in the same view.
