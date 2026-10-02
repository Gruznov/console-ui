# Reference Console

Isolated Vite consumer for the public package entry points.

The rendered operator screen is a local density and layout fixture. Its
components, data, and CSS are deliberately not exported from Console UI.

From the repository root:

```sh
npm run reference
npm run reference:build
```

The fixture must continue to import:

- `@gruznov/design-tokens/tokens.css`;
- `@gruznov/console-ui`;
- `@gruznov/console-ui/styles.css`.
