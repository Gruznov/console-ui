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

- `@polyconsole/design-tokens/tokens.css`;
- `@polyconsole/console-ui`;
- `@polyconsole/console-ui/styles.css`.
