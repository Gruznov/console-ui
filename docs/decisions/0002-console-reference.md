# ADR 0002: Reference console and component maturity

Status: accepted

## Decision

Use `examples/reference-console` as a synthetic application fixture for dense
operational interfaces. It imports packages through their public entry points
and exercises themes, service identity, layout, responsive behavior, and
representative states.

The companion Storybook fixtures use fictional services named Atlas, Beacon,
and Compass. They are not external users, application integrations, or built-in
package presets.

## Boundaries

Example-only components do not become public APIs automatically. Shared patterns
need a documented reusable contract, accessible behavior, and evidence from
actual use. Component maturity is governed by
[CONTRIBUTING.md](../../CONTRIBUTING.md).

The fixture contains no application API clients, private screenshots, runtime
records, production addresses, authentication, or deployment integration.

## Consequences

The reference console provides reproducible visual coverage without deploying a
consumer application. Applications continue to own integration tests for their
real workflows and data contracts.
