# Console UI Design Principles

Status: working baseline

## 1. Operator-first density

Console UI is an operational interface, not a spacious marketing dashboard.
Its primary user moves across several services and needs to scan repeated,
stateful data quickly.

High information density must come from disciplined hierarchy and quiet chrome,
not from illegibly small text or indiscriminate compression.

The baseline should favor:

- compact repeated rows;
- short, aligned metadata;
- tabular numeric presentation;
- restrained page headings and controls;
- cards only for genuinely independent regions;
- borders, background shifts, and typography before large empty gaps;
- details beside or within the current context when interruption is unnecessary.

## 2. Dense, not cramped

Whitespace separates semantic regions. It should not surround every value as
decoration.

Initial ranges for the reference fixture are hypotheses, not package tokens:

| Role | Working range |
|---|---|
| Primary interface text | 13–14 px |
| Secondary metadata | 12–13 px |
| Controls | 30–36 px |
| Repeated data rows | 34–40 px |
| Internal gaps | 8–16 px |
| Major-region gaps | 16–24 px |

The token foundations stabilize values inside these ranges, with separate
status, focus, service, and environment roles. See [Theme foundations](theme-foundations.md) and
[Service and environment identity](context-identity.md).

## 3. Scan before inspect

Every repeated record should expose the minimum information needed to answer:

1. What is it?
2. What state is it in?
3. Does it need attention?
4. How fresh is the information?

Secondary metadata belongs in a detail region, expansion, drawer, or dedicated
page. Opening detail should preserve list position whenever possible.

## 4. Quiet structure

The common frame should recede behind operational content:

- neutral surfaces dominate;
- semantic color communicates state or action;
- shadows are exceptional;
- radii are restrained;
- visual weight follows decision importance;
- service and environment identity remain permanently visible.

The identity selector, text requirements, and contrast contract are defined in
[Service and environment identity](context-identity.md).

Stripe Dashboard and Stripe Apps are useful secondary references for compact
page grammar and controlled styling. They inform the work; their branding and assets are not copied.

## 5. Honest operational states

Empty, loading, stale, unavailable, synthetic, warning, and failure states are
not interchangeable. Density must never hide uncertainty or imply success.

Color supplements text and structure. It is not the only status carrier.

The shared vocabulary, contrast thresholds, and destructive/focus boundary are
defined in [Status and focus semantics](status-focus-semantics.md).

## 6. Reference console role

`examples/reference-console` is a disposable consumer and visual laboratory. It
must import the packages through their public entry points, as a product would.

Local fixture components and styles are not Console UI public APIs. A pattern
graduates into a shared package only after source evidence, accessibility
review, and the component-maturity process in `CONTRIBUTING.md`.
