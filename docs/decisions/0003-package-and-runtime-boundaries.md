# ADR 0003: Package and runtime boundaries

Status: accepted

## Decision

Keep two package boundaries:

- `@gruznov/design-tokens` provides framework-independent semantic CSS and
  metadata with no React dependency.
- `@gruznov/console-ui` provides React components that consume those tokens.
  React and React DOM are peer dependencies.

Shared components must not import Next.js, consumer repositories, runtime data
readers, domain models, API clients, authorization rules, or deployment code.
Applications provide router adapters, data, providers, and commands through
composition.

## Rationale

Presentation can be shared across applications with different runtimes and
business rules. Importing an application's routes, state, or authorization would
couple the release lifecycle of other consumers to that application.

Framework-independent tokens can also be used without the React component
package. This does not imply that the console component set is appropriate for
every public-facing experience.

## Consequences

Consumers map domain states to display-ready values and decide when to upgrade.
The library owns documented UI behavior and accessibility; applications retain
integration tests, command semantics, and independent deployments.
