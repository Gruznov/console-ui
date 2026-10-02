# Console UI Agent Instructions

These instructions apply to all work in this repository.

`console-ui` is a shared design system for operational consoles. It must stay
independent from the business logic and deployment lifecycles of its consumers.

## Default workflow

- Work from an updated `main` branch.
- Create focused branches named `agent/<description>`.
- Open pull requests directly against `main`.
- Do not merge or enable auto-merge.
- Keep documentation, infrastructure, and component implementation changes in
  separate PRs when practical.

## Definition of done

A change is complete only when:

- intended changes are committed and pushed;
- a pull request against `main` is open;
- relevant checks have run;
- changed files and validation are reported;
- anything intentionally deferred is reported.

## Architecture boundaries

- `@gruznov/design-tokens` is framework-independent.
- `@gruznov/console-ui` may depend on React and the token package.
- Shared packages must not import from product repositories.
- Shared packages must not contain product API clients, domain models,
  authorization rules, runtime data readers, or deployment code.
- Core shared components must not import Next.js.
- Routing and framework-specific links are supplied through product adapters or
  composition.
- Product-specific widgets remain in product repositories.
- Do not add a component to the stable shared API solely because it appears
  once in one product.

## Product safety

- Do not deploy any consumer application.
- Do not change VPS, systemd, secrets, registry credentials, or production
  configuration without explicit approval.
- Do not modify consumer runtime data contracts or command behavior from this
  repository.
- Treat all consumer applications as independent systems.

## Implementation expectations

- Preserve the scan-first, dense operational character of the reference UI.
- Always show service and environment context in the shared shell.
- Use semantic tokens and accessible interaction states.
- Every stable component needs documentation, tests, and representative stories.
- Breaking changes require migration notes.
- Prefer a small stable public API over many shallow wrappers.

## Validation

For documentation-only changes, run at minimum:

- `git diff --check`
- the repository documentation link checker when one exists

For code changes, run the relevant available commands, expected to include:

- formatting or lint checks;
- TypeScript typecheck;
- unit tests;
- Storybook build;
- package build;
- focused accessibility and visual checks.

Do not install dependencies or modify external credentials unless the task
requires it and the action is authorized.
