import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(path) {
  return JSON.parse(await readFile(resolve(repositoryRoot, path), "utf8"));
}

function extractCssBlock(styles, selector) {
  const selectorIndex = styles.indexOf(selector);

  assert.notEqual(selectorIndex, -1, `${selector} is missing`);

  const blockStart = styles.indexOf("{", selectorIndex);
  let depth = 0;

  for (let index = blockStart; index < styles.length; index += 1) {
    if (styles[index] === "{") {
      depth += 1;
    } else if (styles[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return styles.slice(blockStart + 1, index);
      }
    }
  }

  assert.fail(`${selector} has no closing block`);
}

function parseCustomProperties(styles) {
  return new Map(
    [...styles.matchAll(/(--console-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map(
      ([, name, value]) => [name, value.trim()],
    ),
  );
}

function parseOklch(value) {
  assert.equal(typeof value, "string", "expected an OKLCH token value");

  const match = value.match(
    /^oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)$/,
  );

  assert.ok(match, `expected opaque OKLCH color, received ${value}`);

  return match.slice(1).map(Number);
}

function relativeLuminance([lightness, chroma, hue]) {
  const hueRadians = (hue * Math.PI) / 180;
  const axisA = chroma * Math.cos(hueRadians);
  const axisB = chroma * Math.sin(hueRadians);
  const lightMix = lightness + 0.3963377774 * axisA + 0.2158037573 * axisB;
  const mediumMix = lightness - 0.1055613458 * axisA - 0.0638541728 * axisB;
  const shortMix = lightness - 0.0894841775 * axisA - 1.291485548 * axisB;
  const long = lightMix ** 3;
  const medium = mediumMix ** 3;
  const short = shortMix ** 3;
  const clamp = (channel) => Math.max(0, Math.min(1, channel));
  const red = clamp(
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
  );
  const green = clamp(
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
  );
  const blue = clamp(
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

test("design tokens stay framework-independent", async () => {
  const manifest = await readJson("packages/design-tokens/package.json");
  const inventory = await readJson(
    "packages/design-tokens/dist/token-inventory.json",
  );
  const tokens = await readFile(
    resolve(repositoryRoot, "packages/design-tokens/dist/tokens.css"),
    "utf8",
  );

  assert.equal(Object.hasOwn(manifest, "private"), false);
  assert.equal(manifest.version, "0.2.0");
  assert.equal(manifest.exports["./tokens.css"], "./dist/tokens.css");
  assert.equal(
    manifest.exports["./token-inventory.json"],
    "./dist/token-inventory.json",
  );
  assert.equal(manifest.dependencies, undefined);
  assert.equal(manifest.peerDependencies, undefined);
  assert.match(tokens, /@layer console\.tokens\s*\{/);
  assert.doesNotMatch(tokens, /@(?:apply|source|tailwind)\b/);
  assert.equal(inventory.schemaVersion, 1);
  assert.equal(inventory.namespace, "console");
  assert.equal(inventory.cssPrefix, "--console-");
  assert.equal(inventory.baselineDensity, "compact");
});

test("semantic token inventory is unique, role-based, and value-free", async () => {
  const inventory = await readJson(
    "packages/design-tokens/dist/token-inventory.json",
  );
  const allowedTypes = new Set([
    "color",
    "cubicBezier",
    "dimension",
    "duration",
    "fontFamily",
    "fontWeight",
    "number",
    "shadow",
    "string",
  ]);
  const allowedScopes = new Set(["context", "foundation", "theme"]);
  const allowedMilestones = new Set(["CUI-021", "CUI-022", "CUI-023"]);
  const segmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const cssVariables = [];

  assert.ok(inventory.groups.length > 0);

  for (const group of inventory.groups) {
    assert.match(group.name, segmentPattern);
    assert.ok(allowedTypes.has(group.type), `unknown type: ${group.type}`);
    assert.ok(
      allowedScopes.has(group.valueScope),
      `unknown value scope: ${group.valueScope}`,
    );
    assert.ok(
      allowedMilestones.has(group.valuesMilestone),
      `unknown values milestone: ${group.valuesMilestone}`,
    );
    assert.equal(Object.hasOwn(group, "value"), false);
    assert.ok(group.tokens.length > 0);

    for (const token of group.tokens) {
      const milestone = token.valuesMilestone ?? group.valuesMilestone;

      assert.match(token.name, segmentPattern);
      assert.ok(token.description.length > 0);
      assert.ok(
        allowedMilestones.has(milestone),
        `unknown token values milestone: ${milestone}`,
      );
      assert.equal(Object.hasOwn(token, "value"), false);
      cssVariables.push(`${inventory.cssPrefix}${group.name}-${token.name}`);
    }
  }

  assert.equal(new Set(cssVariables).size, cssVariables.length);
  assert.ok(cssVariables.includes("--console-surface-canvas"));
  assert.ok(cssVariables.includes("--console-text-primary"));
  assert.ok(cssVariables.includes("--console-status-success-text"));
  assert.ok(cssVariables.includes("--console-focus-ring"));
  assert.ok(cssVariables.includes("--console-control-height"));
  assert.ok(cssVariables.includes("--console-row-min-height"));
  assert.doesNotMatch(
    cssVariables.join("\n"),
    /(?:atlas|beacon|compass|gray-\d|slate-\d)/i,
  );
});

test("token CSS defines exactly the values released through CUI-023", async () => {
  const inventory = await readJson(
    "packages/design-tokens/dist/token-inventory.json",
  );
  const tokens = await readFile(
    resolve(repositoryRoot, "packages/design-tokens/dist/tokens.css"),
    "utf8",
  );
  const releasedMilestones = new Set(["CUI-021", "CUI-022", "CUI-023"]);
  const scheduledTokens = inventory.groups.flatMap((group) =>
    group.tokens
      .filter((token) =>
        releasedMilestones.has(token.valuesMilestone ?? group.valuesMilestone),
      )
      .map((token) => ({
        cssVariable: `${inventory.cssPrefix}${group.name}-${token.name}`,
        valueScope: group.valueScope,
      })),
  );
  const declaredVariables = new Set(
    [...tokens.matchAll(/(--console-[a-z0-9-]+)\s*:/g)].map(
      ([, cssVariable]) => cssVariable,
    ),
  );

  assert.deepEqual(
    [...declaredVariables].toSorted(),
    scheduledTokens.map(({ cssVariable }) => cssVariable).toSorted(),
  );

  for (const { cssVariable, valueScope } of scheduledTokens) {
    const occurrences = [
      ...tokens.matchAll(new RegExp(`${cssVariable}\\s*:`, "g")),
    ].length;

    if (valueScope === "theme") {
      assert.equal(occurrences, 2, `${cssVariable} must define both themes`);
    } else {
      assert.ok(occurrences >= 1, `${cssVariable} is missing a value`);
    }
  }

  assert.match(tokens, /\[data-console-theme="light"\]/);
  assert.match(tokens, /\[data-console-theme="dark"\]/);
  assert.match(tokens, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(tokens, /(?:\.dark|\[data-console-service(?:=|\]))/i);
  assert.doesNotMatch(tokens, /var\(--(?!console-)/);
});

test("status, destructive, and focus colors pass contrast contracts", async () => {
  const tokens = await readFile(
    resolve(repositoryRoot, "packages/design-tokens/dist/tokens.css"),
    "utf8",
  );
  const themes = {
    light: parseCustomProperties(
      extractCssBlock(tokens, '[data-console-theme="light"]'),
    ),
    dark: parseCustomProperties(
      extractCssBlock(tokens, '[data-console-theme="dark"]'),
    ),
  };
  const tones = ["neutral", "info", "success", "warning", "danger"];

  for (const [theme, properties] of Object.entries(themes)) {
    for (const tone of tones) {
      const text = parseOklch(properties.get(`--console-status-${tone}-text`));
      const surface = parseOklch(
        properties.get(`--console-status-${tone}-surface`),
      );
      const border = parseOklch(
        properties.get(`--console-status-${tone}-border`),
      );

      assert.ok(
        contrastRatio(text, surface) >= 4.5,
        `${theme} ${tone} text contrast is below 4.5:1`,
      );
      assert.ok(
        contrastRatio(border, surface) >= 3,
        `${theme} ${tone} border contrast is below 3:1`,
      );
    }

    const dangerForeground = parseOklch(
      properties.get("--console-action-danger-foreground"),
    );

    for (const state of ["", "-hover", "-active"]) {
      const dangerSurface = parseOklch(
        properties.get(`--console-action-danger${state}`),
      );

      assert.ok(
        contrastRatio(dangerForeground, dangerSurface) >= 4.5,
        `${theme} destructive ${state || "default"} contrast is below 4.5:1`,
      );
    }

    const focusRing = parseOklch(properties.get("--console-focus-ring"));
    const focusOffset = parseOklch(properties.get("--console-focus-offset"));

    assert.ok(
      contrastRatio(focusRing, focusOffset) >= 3,
      `${theme} focus contrast is below 3:1`,
    );
  }

  const opacity = Number(
    tokens.match(/--console-opacity-disabled:\s*([0-9.]+);/)?.[1],
  );

  assert.equal(opacity, 0.62);
});

test("service and environment identities pass context contrast contracts", async () => {
  const tokens = await readFile(
    resolve(repositoryRoot, "packages/design-tokens/dist/tokens.css"),
    "utf8",
  );
  const serviceTones = ["neutral", "violet", "teal"];
  const environments = ["production", "staging", "development", "local"];

  for (const theme of ["light", "dark"]) {
    for (const serviceTone of serviceTones) {
      const selector =
        theme === "light"
          ? `[data-console-service-tone="${serviceTone}"]`
          : `[data-console-theme="dark"][data-console-service-tone="${serviceTone}"]`;
      const properties = parseCustomProperties(
        extractCssBlock(tokens, selector),
      );
      const accent = parseOklch(properties.get("--console-service-accent"));
      const foreground = parseOklch(
        properties.get("--console-service-accent-foreground"),
      );

      assert.ok(
        contrastRatio(accent, foreground) >= 4.5,
        `${theme} ${serviceTone} service contrast is below 4.5:1`,
      );
      assert.ok(
        properties.has("--console-service-accent-surface"),
        `${theme} ${serviceTone} service surface is missing`,
      );
    }

    for (const environment of environments) {
      const selector =
        theme === "light"
          ? `[data-console-environment="${environment}"]`
          : `[data-console-theme="dark"][data-console-environment="${environment}"]`;
      const properties = parseCustomProperties(
        extractCssBlock(tokens, selector),
      );
      const accent = parseOklch(properties.get("--console-environment-accent"));
      const foreground = parseOklch(
        properties.get("--console-environment-foreground"),
      );
      const surface = parseOklch(
        properties.get("--console-environment-surface"),
      );
      const border = parseOklch(properties.get("--console-environment-border"));

      assert.ok(
        contrastRatio(accent, foreground) >= 4.5,
        `${theme} ${environment} environment contrast is below 4.5:1`,
      );
      assert.ok(
        contrastRatio(border, surface) >= 3,
        `${theme} ${environment} environment border contrast is below 3:1`,
      );
    }
  }
});

test("token theme story uses only implemented public tokens", async () => {
  const inventory = await readJson(
    "packages/design-tokens/dist/token-inventory.json",
  );
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/token-themes.stories.tsx"),
    "utf8",
  );
  const storyStyles = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/token-themes.css"),
    "utf8",
  );
  const implementedTokens = new Set(
    inventory.groups.flatMap((group) =>
      group.tokens
        .filter(
          (token) =>
            (token.valuesMilestone ?? group.valuesMilestone) === "CUI-021",
        )
        .map((token) => `${inventory.cssPrefix}${group.name}-${token.name}`),
    ),
  );
  const referencedTokens = new Set(
    [...storyStyles.matchAll(/var\((--console-[a-z0-9-]+)/g)].map(
      ([, cssVariable]) => cssVariable,
    ),
  );

  assert.match(story, /data-console-theme=\{theme\}/);
  assert.match(story, /<ThemePreview theme="light" \/>/);
  assert.match(story, /<ThemePreview theme="dark" \/>/);
  assert.ok(referencedTokens.size > 0);

  for (const cssVariable of referencedTokens) {
    assert.ok(implementedTokens.has(cssVariable), `${cssVariable} is deferred`);
  }
});

test("status and focus story uses only tokens released through CUI-022", async () => {
  const inventory = await readJson(
    "packages/design-tokens/dist/token-inventory.json",
  );
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/status-focus.stories.tsx"),
    "utf8",
  );
  const storyStyles = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/status-focus.css"),
    "utf8",
  );
  const releasedMilestones = new Set(["CUI-021", "CUI-022"]);
  const implementedTokens = new Set(
    inventory.groups.flatMap((group) =>
      group.tokens
        .filter((token) =>
          releasedMilestones.has(
            token.valuesMilestone ?? group.valuesMilestone,
          ),
        )
        .map((token) => `${inventory.cssPrefix}${group.name}-${token.name}`),
    ),
  );
  const referencedTokens = new Set(
    [...storyStyles.matchAll(/var\((--console-[a-z0-9-]+)/g)].map(
      ([, cssVariable]) => cssVariable,
    ),
  );

  assert.match(story, /<StatusPreview theme="light" \/>/);
  assert.match(story, /<StatusPreview theme="dark" \/>/);
  assert.match(storyStyles, /:focus-visible/);
  assert.match(storyStyles, /outline:\s*2px solid transparent/);
  assert.match(storyStyles, /--console-opacity-disabled/);
  assert.ok(referencedTokens.size > 0);

  for (const cssVariable of referencedTokens) {
    assert.ok(implementedTokens.has(cssVariable), `${cssVariable} is deferred`);
  }
});

test("context identity story makes service and environment explicit", async () => {
  const inventory = await readJson(
    "packages/design-tokens/dist/token-inventory.json",
  );
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/context-identity.stories.tsx"),
    "utf8",
  );
  const storyStyles = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/context-identity.css"),
    "utf8",
  );
  const releasedMilestones = new Set(["CUI-021", "CUI-022", "CUI-023"]);
  const implementedTokens = new Set(
    inventory.groups.flatMap((group) =>
      group.tokens
        .filter((token) =>
          releasedMilestones.has(
            token.valuesMilestone ?? group.valuesMilestone,
          ),
        )
        .map((token) => `${inventory.cssPrefix}${group.name}-${token.name}`),
    ),
  );
  const referencedTokens = new Set(
    [...storyStyles.matchAll(/var\((--console-[a-z0-9-]+)/g)].map(
      ([, cssVariable]) => cssVariable,
    ),
  );

  assert.match(story, /<ThemeIdentityPreview theme="light" \/>/);
  assert.match(story, /<ThemeIdentityPreview theme="dark" \/>/);

  for (const service of ["atlas", "beacon", "compass"]) {
    assert.match(story, new RegExp(`id: "${service}"`));
  }

  for (const serviceTone of ["neutral", "violet", "teal"]) {
    assert.match(story, new RegExp(`tone: "${serviceTone}"`));
  }

  for (const environment of ["production", "staging", "development", "local"]) {
    assert.match(story, new RegExp(`id: "${environment}"`));
  }

  assert.match(story, /data-console-service=\{service\.id\}/);
  assert.match(story, /data-console-service-tone=\{service\.tone\}/);
  assert.match(story, /data-console-environment=\{service\.environment\}/);
  assert.match(story, /Text is mandatory/);
  assert.ok(referencedTokens.size > 0);

  for (const cssVariable of referencedTokens) {
    assert.ok(implementedTokens.has(cssVariable), `${cssVariable} is deferred`);
  }
});

test("console UI exposes ESM, types, and ready-to-import CSS", async () => {
  const manifest = await readJson("packages/console-ui/package.json");
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );
  const sourceMap = await readJson("packages/console-ui/dist/index.js.map");

  assert.equal(Object.hasOwn(manifest, "private"), false);
  assert.equal(manifest.version, "0.7.0");
  assert.deepEqual(manifest.exports["."], {
    types: "./dist/index.d.ts",
    import: "./dist/index.js",
  });
  assert.equal(manifest.exports["./styles.css"], "./dist/styles.css");
  assert.equal(manifest.peerDependencies.react, ">=19.2.0 <20.0.0");
  assert.equal(manifest.peerDependencies["react-dom"], ">=19.2.0 <20.0.0");
  assert.equal(manifest.dependencies.next, undefined);
  assert.equal(manifest.dependencies["@base-ui/react"], "^1.7.0");
  assert.equal(manifest.dependencies["@polyconsole/design-tokens"], "0.2.0");
  assert.match(styles, /@layer console\.components\s*\{/);
  assert.doesNotMatch(styles, /@(?:apply|source|tailwind)\b/);
  assert.equal(sourceMap.sourcesContent.length, 1);

  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  assert.deepEqual(Object.keys(packageModule), [
    "ActionLink",
    "Badge",
    "Button",
    "Card",
    "CardAction",
    "CardContent",
    "CardDescription",
    "CardFooter",
    "CardHeader",
    "CardTitle",
    "ChoiceCard",
    "ChoiceGroup",
    "ConsoleIdentity",
    "ConsoleNavigation",
    "ConsolePageHeader",
    "ConsoleShell",
    "DataTableFrame",
    "FeedbackState",
    "FilterButton",
    "FilterGroup",
    "FilterToolbar",
    "FormActions",
    "FormField",
    "FormGrid",
    "IconButton",
    "InlineNotice",
    "Input",
    "ProgressSteps",
    "Select",
    "Separator",
    "StatusBadge",
    "Table",
    "TableBody",
    "TableCaption",
    "TableCell",
    "TableFooter",
    "TableHead",
    "TableHeader",
    "TableRow",
    "Tabs",
    "TabsContent",
    "TabsList",
    "TabsTrigger",
    "Textarea",
    "Tooltip",
  ]);
});

test("selection and progress primitives preserve native workflow semantics", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const workflow = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(packageModule.ProgressSteps, {
        label: "Resource setup",
        steps: [
          { id: "details", label: "Details", state: "complete" },
          { id: "policy", label: "Policy", state: "current" },
        ],
      }),
      React.createElement(
        packageModule.ChoiceGroup,
        { columns: 2, legend: "Archive policy" },
        React.createElement(packageModule.ChoiceCard, {
          checked: true,
          label: "Respect robots.txt",
          name: "policy",
          readOnly: true,
          value: "respect",
        }),
      ),
    ),
  );

  assert.match(workflow, /<ol[^>]*aria-label="Resource setup"/);
  assert.match(workflow, /aria-current="step"/);
  assert.match(workflow, /data-state="complete"/);
  assert.match(workflow, /<fieldset[^>]*data-columns="2"/);
  assert.match(workflow, /<legend[^>]*>Archive policy<\/legend>/);
  assert.match(workflow, /<input[^>]*type="radio"[^>]*checked=""/);
});

test("selection styles cover selected, disabled, responsive and forced-color states", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );

  for (const selector of [
    "data-console-choice-group",
    "data-console-choice-card",
    "data-console-choice-card-input",
    "data-console-progress-steps",
    "data-console-progress-step",
  ]) {
    assert.match(styles, new RegExp(`\\[${selector}`));
  }

  assert.match(styles, /:has\(\[data-console-choice-card-input\]:checked\)/);
  assert.match(styles, /\[data-console-choice-card\]\[data-disabled\]/);
  assert.match(
    styles,
    /@media \(max-width: 42rem\)[\s\S]*\[data-console-progress-steps\]/,
  );
  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-choice-card\]/,
  );
});

test("selection story covers both themes and radio, checkbox, and disabled states", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/selection.stories.tsx"),
    "utf8",
  );

  for (const component of ["ChoiceCard", "ChoiceGroup", "ProgressSteps"]) {
    assert.match(story, new RegExp(`<${component}(?:\\s|>)`));
  }

  assert.match(story, /<ThemeSelectionPreview theme="light" \/>/);
  assert.match(story, /<ThemeSelectionPreview theme="dark" \/>/);
  assert.match(story, /type="checkbox"/);
  assert.match(story, /disabled/);
  assert.match(story, /state: "current"/);
});

test("form primitives preserve native semantics and explicit field anatomy", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const form = renderToStaticMarkup(
    React.createElement(
      packageModule.FormGrid,
      { columns: 2 },
      React.createElement(
        packageModule.FormField,
        {
          controlId: "resource-url",
          error: "Use a public URL.",
          label: "Start URL",
          wide: true,
        },
        React.createElement(packageModule.Input, {
          "aria-describedby": "resource-url-error",
          id: "resource-url",
          invalid: true,
          type: "url",
        }),
      ),
    ),
  );

  assert.match(form, /data-console-form-grid=""/);
  assert.match(form, /data-columns="2"/);
  assert.match(form, /data-wide="true"/);
  assert.match(form, /<label[^>]*for="resource-url"/);
  assert.match(form, /data-console-input=""/);
  assert.match(form, /aria-invalid="true"/);
  assert.match(form, /id="resource-url-error" role="alert"/);
});

test("form styles cover dense, responsive, invalid, disabled and system states", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );

  for (const selector of [
    "data-console-form-grid",
    "data-console-form-field",
    "data-console-input",
    "data-console-select",
    "data-console-textarea",
    "data-console-form-actions",
  ]) {
    assert.match(styles, new RegExp(`\\[${selector}`));
  }

  assert.match(styles, /\[data-console-input\]:focus-visible/);
  assert.match(styles, /\[data-console-input\]\[data-invalid\]/);
  assert.match(styles, /\[data-console-input\]:disabled/);
  assert.match(
    styles,
    /@media \(max-width: 42rem\)[\s\S]*\[data-console-form-grid\]\[data-columns="2"\]/,
  );
  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-input\]:focus-visible/,
  );
});

test("form story covers both themes and representative field states", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/form.stories.tsx"),
    "utf8",
  );

  for (const component of [
    "FormActions",
    "FormField",
    "FormGrid",
    "Input",
    "Select",
    "Textarea",
  ]) {
    assert.match(story, new RegExp(`<${component}(?:\\s|>)`));
  }

  assert.match(story, /<ThemeFormPreview theme="light" \/>/);
  assert.match(story, /<ThemeFormPreview theme="dark" \/>/);
  assert.match(story, /invalid/);
  assert.match(story, /disabled/);
  assert.match(story, /optional/);
});

test("Button and IconButton expose native action semantics", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const button = renderToStaticMarkup(
    React.createElement(
      packageModule.Button,
      {
        className: "consumer-class",
        pending: true,
        pendingLabel: "Saving changes",
        variant: "danger",
      },
      "Save changes",
    ),
  );
  const iconButton = renderToStaticMarkup(
    React.createElement(
      packageModule.IconButton,
      {
        label: "Refresh data",
        pending: true,
        pendingLabel: "Refreshing data",
        size: "sm",
      },
      React.createElement("svg", { "aria-hidden": true }),
    ),
  );

  assert.match(button, /type="button"/);
  assert.match(button, /disabled=""/);
  assert.match(button, /aria-busy="true"/);
  assert.match(button, /data-pending="true"/);
  assert.match(button, /data-variant="danger"/);
  assert.match(button, /class="[^"]*consumer-class/);
  assert.match(button, />Saving changes</);
  assert.doesNotMatch(button, />Save changes</);
  assert.match(iconButton, /aria-label="Refreshing data"/);
  assert.match(iconButton, /data-console-icon-button=""/);
  assert.match(iconButton, /data-size="sm"/);
});

test("ActionLink preserves native navigation semantics and router composition", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const nativeLink = renderToStaticMarkup(
    React.createElement(
      packageModule.ActionLink,
      { href: "/workers/new", variant: "primary" },
      "Add worker",
    ),
  );
  const routedLink = renderToStaticMarkup(
    React.createElement(
      packageModule.ActionLink,
      {
        href: "/workers",
        renderLink: (props) =>
          React.createElement("a", { ...props, "data-router-link": "" }),
      },
      "View workers",
    ),
  );

  assert.match(nativeLink, /<a[^>]*href="\/workers\/new"/);
  assert.match(nativeLink, /data-console-action-link=""/);
  assert.match(nativeLink, /data-console-action-control=""/);
  assert.match(nativeLink, /data-variant="primary"/);
  assert.doesNotMatch(nativeLink, /role="button"/);
  assert.match(routedLink, /data-router-link=""/);
  assert.match(routedLink, /href="\/workers"/);
});

test("button styles are StyleX-authored and preserve accessibility states", async () => {
  const source = await readFile(
    resolve(repositoryRoot, "packages/console-ui/src/button.tsx"),
    "utf8",
  );
  const compiled = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/button.js"),
    "utf8",
  );
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );
  const tokens = await readFile(
    resolve(repositoryRoot, "packages/design-tokens/dist/tokens.css"),
    "utf8",
  );
  const implementedTokens = new Set(
    [...tokens.matchAll(/(--console-[a-z0-9-]+)\s*:/g)].map(
      ([, cssVariable]) => cssVariable,
    ),
  );
  const referencedTokens = new Set(
    [...styles.matchAll(/var\((--console-[a-z0-9-]+)/g)].map(
      ([, cssVariable]) => cssVariable,
    ),
  );

  assert.match(source, /@stylexjs\/stylex/);
  assert.match(source, /stylex\.create/);
  assert.match(source, /stylex\.props/);
  assert.doesNotMatch(compiled, /@stylexjs\/stylex|stylex\.(?:create|props)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /--console-action-danger/);
  assert.match(styles, /--console-opacity-disabled/);
  assert.match(styles, /--console-focus-ring/);
  assert.match(styles, /\[data-console-button-content\] > svg/);
  assert.match(styles, /\[data-console-icon-button\]/);
  assert.ok(referencedTokens.size > 0);

  for (const cssVariable of referencedTokens) {
    assert.ok(implementedTokens.has(cssVariable), cssVariable + " is missing");
  }
});

test("button story covers links, variants, pending, icon labels, and both themes", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/button.stories.tsx"),
    "utf8",
  );

  assert.match(story, /import \{ ActionLink, Button, IconButton \}/);
  assert.match(story, /<ActionLink href="\/workers\/new" variant="primary">/);
  assert.match(story, /<ThemeActionPreview theme="light" \/>/);
  assert.match(story, /<ThemeActionPreview theme="dark" \/>/);

  for (const variant of ["secondary", "ghost", "danger"]) {
    assert.match(story, new RegExp(`variant="${variant}"`));
  }

  for (const size of ["sm", "md", "lg"]) {
    assert.match(story, new RegExp(`size="${size}"`));
  }

  assert.match(story, /pendingLabel="Saving changes"/);
  assert.match(story, /label="Refresh data"/);
  assert.match(story, /aria-live="polite"/);
});

test("Tooltip composes an accessible trigger without exposing Base UI types", async () => {
  const source = await readFile(
    resolve(repositoryRoot, "packages/console-ui/src/tooltip.tsx"),
    "utf8",
  );
  const declarations = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/tooltip.d.ts"),
    "utf8",
  );

  assert.match(source, /<BaseTooltip\.Trigger/);
  assert.match(source, /render=\{children\}/);
  assert.match(source, /<BaseTooltip\.Portal>/);
  assert.match(source, /<BaseTooltip\.Popup data-console-tooltip-popup="">/);
  assert.doesNotMatch(declarations, /@base-ui/);
});

test("Filter toolbar family preserves native grouping and pressed-state semantics", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const toolbar = renderToStaticMarkup(
    React.createElement(
      packageModule.FilterToolbar,
      {
        actions: React.createElement(packageModule.Button, null, "Refresh"),
      },
      React.createElement(
        packageModule.FilterGroup,
        { label: "Queue state" },
        React.createElement(
          packageModule.FilterButton,
          { selected: true },
          "All",
        ),
        React.createElement(packageModule.FilterButton, null, "Failed"),
      ),
    ),
  );

  assert.match(toolbar, /data-console-filter-toolbar=""/);
  assert.match(toolbar, /<fieldset[^>]*data-console-filter-group=""/);
  assert.match(toolbar, /<legend[^>]*>Queue state<\/legend>/);
  assert.match(toolbar, /aria-pressed="true"/);
  assert.match(toolbar, /data-selected="true"/);
  assert.match(toolbar, /aria-pressed="false"/);
  assert.match(toolbar, /data-console-filter-toolbar-actions=""/);
});

test("filter toolbar styles and story cover wrapping, focus, disabled, and both themes", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/filter-toolbar.stories.tsx"),
    "utf8",
  );

  assert.match(styles, /\[data-console-filter-toolbar\]/);
  assert.match(styles, /flex-wrap:\s*wrap/);
  assert.match(styles, /\[data-console-filter-button\]\[data-selected\]/);
  assert.match(styles, /\[data-console-filter-button\]:focus-visible/);
  assert.match(styles, /\[data-console-filter-button\]:disabled/);
  assert.match(story, /<ThemeFilterPreview theme="light" \/>/);
  assert.match(story, /<ThemeFilterPreview theme="dark" \/>/);
  assert.match(story, /<FilterButton disabled>/);
});

test("tooltip styles and story cover overlay states, placement, and both themes", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/tooltip.stories.tsx"),
    "utf8",
  );

  assert.match(styles, /\[data-console-tooltip-positioner\]/);
  assert.match(styles, /\[data-console-tooltip-popup\]\[data-starting-style\]/);
  assert.match(styles, /\[data-console-tooltip-arrow\]/);
  assert.match(story, /<ThemeTooltipPreview theme="light" \/>/);
  assert.match(story, /<ThemeTooltipPreview theme="dark" \/>/);
  assert.match(story, /<Tooltip/);
  assert.match(story, /open/);
  assert.match(story, /side="bottom"/);
});

test("Badge and StatusBadge keep metadata separate from semantic tone", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const badge = renderToStaticMarkup(
    React.createElement(
      packageModule.Badge,
      { className: "consumer-badge", title: "Worker identity" },
      "worker-02",
    ),
  );
  const statusBadge = renderToStaticMarkup(
    React.createElement(
      packageModule.StatusBadge,
      { className: "consumer-status", tone: "danger" },
      "Failed",
    ),
  );
  const quietStatusBadge = renderToStaticMarkup(
    React.createElement(
      packageModule.StatusBadge,
      { indicator: false, tone: "success" },
      "Completed",
    ),
  );

  assert.match(badge, /data-console-badge=""/);
  assert.match(badge, /class="[^"]*consumer-badge[^"]*"/);
  assert.match(badge, /title="Worker identity"/);
  assert.doesNotMatch(badge, /data-tone=/);
  assert.match(statusBadge, /data-console-status-badge=""/);
  assert.match(statusBadge, /data-tone="danger"/);
  assert.match(statusBadge, /data-console-status-indicator=""/);
  assert.match(statusBadge, /class="[^"]*consumer-status[^"]*"/);
  assert.doesNotMatch(statusBadge, /role="status"|aria-live=/);
  assert.doesNotMatch(quietStatusBadge, /data-console-status-indicator/);
});

test("badge styles are StyleX-authored without a StyleX runtime dependency", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );
  const badgeModule = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/badge.js"),
    "utf8",
  );
  const manifest = await readJson("packages/console-ui/package.json");

  assert.equal(
    [...styles.matchAll(/\[data-console-badge\]\s*\{/g)].length,
    1,
    "only the forced-colors Badge escape selector should remain",
  );
  assert.doesNotMatch(
    styles,
    /\[data-console-status-badge\](?:\[data-tone="[^"]+"\])?\s*\{/,
  );
  assert.match(styles, /min-height:\s*1\.375rem/);
  assert.match(styles, /\[data-console-badge-content\]\s*>\s*svg/);

  for (const tone of ["neutral", "info", "success", "warning", "danger"]) {
    assert.match(styles, new RegExp(`--console-status-${tone}-text`));
    assert.match(styles, new RegExp(`--console-status-${tone}-surface`));
    assert.match(styles, new RegExp(`--console-status-${tone}-border`));
  }

  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-badge\]/,
  );
  assert.doesNotMatch(
    badgeModule,
    /@stylexjs\/stylex|stylex\.(?:create|props)/,
  );
  assert.equal(manifest.dependencies?.["@stylexjs/stylex"], undefined);
});

test("badge story covers metadata, tones, adapter mapping, and both themes", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/badge.stories.tsx"),
    "utf8",
  );

  assert.match(story, /import \{ Badge, StatusBadge \}/);
  assert.match(story, /<ThemeBadgePreview theme="light" \/>/);
  assert.match(story, /<ThemeBadgePreview theme="dark" \/>/);

  for (const tone of ["neutral", "info", "success", "warning", "danger"]) {
    assert.match(story, new RegExp(`tone: "${tone}"`));
  }

  assert.match(story, /indicator=\{false\}/);
  assert.match(story, /Product adapter boundary/);
  assert.match(story, /source: "critical"/);
});

test("FeedbackState and InlineNotice preserve truthful product semantics", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const checking = renderToStaticMarkup(
    React.createElement(packageModule.FeedbackState, {
      state: "checking",
      title: "Checking exporter",
      description: "Waiting for the current read.",
    }),
  );
  const error = renderToStaticMarkup(
    React.createElement(packageModule.FeedbackState, {
      state: "error",
      title: "Read failed",
    }),
  );
  const notice = renderToStaticMarkup(
    React.createElement(packageModule.InlineNotice, {
      title: "System checks",
      description: "All checks completed.",
      tone: "success",
      value: "12/12",
    }),
  );

  assert.match(checking, /data-console-feedback-state=""/);
  assert.match(checking, /data-state="checking"/);
  assert.match(checking, /data-tone="info"/);
  assert.match(checking, /aria-busy="true"/);
  assert.doesNotMatch(checking, /role="(?:alert|status)"|aria-live=/);
  assert.match(error, /data-state="error"/);
  assert.match(error, /data-tone="danger"/);
  assert.doesNotMatch(error, /aria-busy=/);
  assert.match(notice, /data-console-inline-notice=""/);
  assert.match(notice, /data-tone="success"/);
  assert.match(notice, /data-console-inline-notice-value="">12\/12/);
  assert.doesNotMatch(notice, /role="(?:alert|status)"|aria-live=/);
});

test("feedback styles cover compact states, tones, and system modes", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );

  assert.match(styles, /\[data-console-feedback-state\]/);
  assert.match(styles, /\[data-console-inline-notice\]/);
  assert.match(styles, /data-state="checking"/);
  assert.match(styles, /console-feedback-spin/);

  for (const tone of ["info", "success", "warning", "danger"]) {
    assert.match(
      styles,
      new RegExp(`data-console-feedback-state\\]\\[data-tone="${tone}"`),
    );
  }

  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*data-console-feedback-state/,
  );
});

test("feedback story separates checking, empty, unavailable, and error", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/feedback.stories.tsx"),
    "utf8",
  );

  assert.match(story, /FeedbackState/);
  assert.match(story, /InlineNotice/);
  assert.match(story, /<ThemeFeedbackPreview theme="light" \/>/);
  assert.match(story, /<ThemeFeedbackPreview theme="dark" \/>/);

  for (const state of ["checking", "empty", "unavailable", "error"]) {
    assert.match(story, new RegExp(`state: "${state}"`));
  }

  assert.match(story, /Products supply truthful state mapping/);
});

test("Card family composes semantic operational regions without domain behavior", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const card = renderToStaticMarkup(
    React.createElement(
      packageModule.Card,
      {
        "aria-labelledby": "worker-title",
        as: "article",
        className: "consumer-card",
        size: "sm",
      },
      React.createElement(
        packageModule.CardHeader,
        { separated: true },
        React.createElement(
          packageModule.CardTitle,
          { as: "h3", id: "worker-title" },
          "Archive worker",
        ),
        React.createElement(
          packageModule.CardDescription,
          null,
          "Processing the primary queue.",
        ),
        React.createElement(
          packageModule.CardAction,
          null,
          React.createElement(
            packageModule.StatusBadge,
            { tone: "success" },
            "Healthy",
          ),
        ),
      ),
      React.createElement(
        packageModule.CardContent,
        null,
        "Product-owned data",
      ),
      React.createElement(
        packageModule.CardFooter,
        { separated: true },
        "Updated automatically",
      ),
    ),
  );

  assert.match(card, /^<article/);
  assert.match(card, /data-console-card=""/);
  assert.match(card, /data-size="sm"/);
  assert.match(card, /class="consumer-card"/);
  assert.match(card, /aria-labelledby="worker-title"/);
  assert.match(card, /data-console-card-header=""/);
  assert.match(card, /data-separated="true"/);
  assert.match(card, /<h3[^>]*id="worker-title"/);
  assert.match(card, /data-console-card-description=""/);
  assert.match(card, /data-console-card-action=""/);
  assert.match(card, /data-console-card-content=""/);
  assert.match(card, /data-console-card-footer=""/);
  assert.doesNotMatch(card, /role="status"|aria-live=|tabindex=/);
});

test("card styles preserve compact density and neutral composition", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );

  assert.match(styles, /\[data-console-card\]\s*\{/);
  assert.match(styles, /--_console-card-gap:\s*var\(--console-space-4\)/);
  assert.match(styles, /\[data-console-card\]\[data-size="sm"\]/);
  assert.match(
    styles,
    /--_console-card-padding-inline:\s*var\(--console-space-4\)/,
  );
  assert.match(
    styles,
    /\[data-console-card-header\]:has\(> \[data-console-card-action\]\)/,
  );
  assert.match(styles, /\[data-console-card-header\]\[data-separated\]/);
  assert.match(styles, /\[data-console-card-footer\]\[data-separated\]/);
  assert.match(styles, /background:\s*var\(--console-surface-default\)/);
  assert.match(styles, /box-shadow:\s*var\(--console-shadow-raised\)/);
  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-card\]/,
  );
  assert.doesNotMatch(styles, /\[data-console-card\][^{]*:(?:hover|active)/);
});

test("card story covers structure, density, semantics, and both themes", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/card.stories.tsx"),
    "utf8",
  );

  for (const component of [
    "Card",
    "CardAction",
    "CardContent",
    "CardDescription",
    "CardFooter",
    "CardHeader",
    "CardTitle",
  ]) {
    assert.match(story, new RegExp(`<${component}(?:\\s|>)`));
  }

  assert.match(story, /<ThemeCardPreview theme="light" \/>/);
  assert.match(story, /<ThemeCardPreview theme="dark" \/>/);
  assert.match(story, /<Card as="article"/);
  assert.match(story, /<CardTitle as="h4"/);
  assert.match(story, /size="sm"/);
  assert.match(story, /<CardHeader separated>/);
  assert.match(story, /<CardFooter separated>/);
  assert.match(story, /<StatusBadge tone="success">Healthy<\/StatusBadge>/);
});

test("Separator distinguishes semantic and decorative boundaries", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const semantic = renderToStaticMarkup(
    React.createElement(packageModule.Separator, {
      "aria-label": "Current queue and recent activity",
      className: "consumer-separator",
    }),
  );
  const vertical = renderToStaticMarkup(
    React.createElement(packageModule.Separator, {
      orientation: "vertical",
    }),
  );
  const decorative = renderToStaticMarkup(
    React.createElement(packageModule.Separator, {
      decorative: true,
      orientation: "vertical",
    }),
  );

  assert.match(semantic, /^<hr/);
  assert.match(semantic, /aria-orientation="horizontal"/);
  assert.match(semantic, /aria-label="Current queue and recent activity"/);
  assert.match(semantic, /class="consumer-separator"/);
  assert.match(semantic, /data-console-separator=""/);
  assert.match(semantic, /data-orientation="horizontal"/);
  assert.doesNotMatch(semantic, /aria-hidden=|data-decorative=/);
  assert.match(vertical, /^<hr/);
  assert.match(vertical, /aria-orientation="vertical"/);
  assert.match(vertical, /data-orientation="vertical"/);
  assert.match(decorative, /role="presentation"/);
  assert.match(decorative, /data-decorative="true"/);
  assert.match(decorative, /data-orientation="vertical"/);
  assert.doesNotMatch(decorative, /aria-hidden=|aria-orientation=/);
});

test("separator styles stay one-pixel, quiet, and orientation-aware", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );

  assert.match(styles, /\[data-console-separator\]\s*\{/);
  assert.match(styles, /background:\s*var\(--console-border-subtle\)/);
  assert.match(
    styles,
    /\[data-console-separator\]\[data-orientation="horizontal"\][\s\S]*height:\s*1px/,
  );
  assert.match(
    styles,
    /\[data-console-separator\]\[data-orientation="vertical"\][\s\S]*width:\s*1px/,
  );
  assert.match(styles, /align-self:\s*stretch/);
  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-separator\]/,
  );
  assert.doesNotMatch(
    styles,
    /\[data-console-separator\][^{]*:(?:hover|active)/,
  );
});

test("separator story covers both orientations, semantics, and both themes", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/separator.stories.tsx"),
    "utf8",
  );

  assert.match(story, /import \{[\s\S]*Separator,[\s\S]*\} from/);
  assert.match(story, /<ThemeSeparatorPreview theme="light" \/>/);
  assert.match(story, /<ThemeSeparatorPreview theme="dark" \/>/);
  assert.match(
    story,
    /<Separator aria-label="Current queue and recent activity" \/>/,
  );
  assert.match(story, /<Separator decorative \/>/);
  assert.match(story, /<Separator decorative orientation="vertical" \/>/);
  assert.match(story, /Recent activity/);
  assert.match(story, /Reinforces existing list structure/);
});

test("Table family preserves native table semantics and passthrough props", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const table = renderToStaticMarkup(
    React.createElement(
      packageModule.Table,
      { className: "consumer-table" },
      React.createElement(
        packageModule.TableCaption,
        null,
        "Archive worker snapshot",
      ),
      React.createElement(
        packageModule.TableHeader,
        null,
        React.createElement(
          packageModule.TableRow,
          null,
          React.createElement(
            packageModule.TableHead,
            { scope: "col" },
            "Worker",
          ),
          React.createElement(packageModule.TableHead, {
            "aria-label": "Open worker",
            scope: "col",
          }),
        ),
      ),
      React.createElement(
        packageModule.TableBody,
        null,
        React.createElement(
          packageModule.TableRow,
          { "data-state": "selected" },
          React.createElement(
            packageModule.TableCell,
            { colSpan: 2 },
            "worker-eu-02",
          ),
        ),
      ),
      React.createElement(
        packageModule.TableFooter,
        null,
        React.createElement(
          packageModule.TableRow,
          null,
          React.createElement(
            packageModule.TableCell,
            { colSpan: 2 },
            "1 worker",
          ),
        ),
      ),
    ),
  );

  assert.match(table, /^<table/);
  assert.match(table, /class="consumer-table"/);
  assert.match(table, /data-console-table=""/);
  assert.match(table, /<caption[^>]*data-console-table-caption=""/);
  assert.match(table, /<thead[^>]*data-console-table-header=""/);
  assert.match(table, /<tbody[^>]*data-console-table-body=""/);
  assert.match(table, /<tfoot[^>]*data-console-table-footer=""/);
  assert.match(table, /<tr[^>]*data-state="selected"/);
  assert.match(table, /<th[^>]*scope="col"/);
  assert.match(table, /<th[^>]*aria-label="Open worker"/);
  assert.match(table, /<td[^>]*colSpan="2"/);
  assert.doesNotMatch(table, /<div|role=|tabindex=/);
});

test("DataTableFrame owns accessible overflow while width stays explicit", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const frame = renderToStaticMarkup(
    React.createElement(
      packageModule.DataTableFrame,
      {
        className: "consumer-frame",
        label: "Worker health",
        maxHeight: "28rem",
        minWidth: "72rem",
        stickyHeader: true,
      },
      React.createElement(packageModule.Table, null),
    ),
  );

  assert.match(frame, /data-console-data-table-frame=""/);
  assert.match(frame, /^<section/);
  assert.match(frame, /aria-label="Worker health"/);
  assert.doesNotMatch(frame, /role=/);
  assert.match(frame, /tabindex="0"/);
  assert.match(frame, /data-sticky-header="true"/);
  assert.match(frame, /style="max-height:28rem"/);
  assert.match(frame, /data-console-data-table-frame-width=""/);
  assert.match(frame, /style="min-width:max\(100%, 72rem\)"/);
  assert.match(frame, /data-console-table=""/);

  const numericFrame = renderToStaticMarkup(
    React.createElement(
      packageModule.DataTableFrame,
      { label: "Numeric width", minWidth: 640 },
      React.createElement(packageModule.Table, null),
    ),
  );
  assert.match(numericFrame, /style="min-width:max\(100%, 640px\)"/);
});

test("table styles stay dense and DataTableFrame owns accessible overflow", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );
  const tableBlock = extractCssBlock(styles, "[data-console-table]");

  assert.match(tableBlock, /width:\s*100%/);
  assert.match(tableBlock, /border-collapse:\s*collapse/);
  assert.match(tableBlock, /caption-side:\s*bottom/);
  assert.doesNotMatch(tableBlock, /overflow|min-width/);
  assert.match(styles, /\[data-console-table-header\]/);
  assert.match(styles, /\[data-console-table-footer\]/);
  assert.match(styles, /\[data-console-table-body\]/);
  assert.match(styles, /\[data-console-table-row\]/);
  assert.match(styles, /\[data-console-table-head\]/);
  assert.match(styles, /\[data-console-table-cell\]/);
  assert.match(styles, /\[data-console-table-caption\]/);
  assert.match(styles, /\[data-console-data-table-frame\]/);
  assert.match(styles, /overflow:\s*auto/);
  assert.match(styles, /overscroll-behavior-x:\s*contain/);
  assert.match(styles, /overscroll-behavior-y:\s*auto/);
  assert.match(styles, /scrollbar-gutter:\s*stable/);
  assert.match(styles, /min-width:\s*100%/);
  assert.match(styles, /\[data-console-data-table-frame\]:focus-visible/);
  assert.match(
    styles,
    /\[data-console-data-table-frame\]\[data-sticky-header\]/,
  );
  assert.match(styles, /height:\s*var\(--console-row-min-height\)/);
  assert.match(styles, /\[data-console-table-row\]\[data-state="selected"\]/);
  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-table-footer\]/,
  );
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\[data-console-table-row\]/,
  );
});

test("table story covers native elements and the shared overflow frame", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/table.stories.tsx"),
    "utf8",
  );
  const storyStyles = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/table.css"),
    "utf8",
  );

  for (const component of [
    "DataTableFrame",
    "Table",
    "TableBody",
    "TableCaption",
    "TableCell",
    "TableFooter",
    "TableHead",
    "TableHeader",
    "TableRow",
  ]) {
    assert.match(story, new RegExp(`<${component}(?:\\s|>)`));
  }

  assert.match(story, /<ThemeTablePreview theme="light" \/>/);
  assert.match(story, /<ThemeTablePreview theme="dark" \/>/);
  assert.match(story, /scope="col"/);
  assert.match(story, /aria-label="Open resource"/);
  assert.match(story, /data-state=/);
  assert.match(story, /label=\{`Open \$\{resource\.resource\}`\}/);
  assert.match(story, /label=\{`\$\{theme\} archive worker snapshot`\}/);
  assert.match(story, /minWidth="34rem"/);
  assert.match(story, /stickyHeader/);
  assert.doesNotMatch(storyStyles, /overflow-x:\s*auto|min-width:\s*34rem/);
});

test("Tabs family exposes tab semantics without routing or Base UI types", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const declaration = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/tabs.d.ts"),
    "utf8",
  );
  const tabs = renderToStaticMarkup(
    React.createElement(
      packageModule.Tabs,
      {
        className: "consumer-tabs",
        defaultValue: "overview",
        orientation: "vertical",
      },
      React.createElement(
        packageModule.TabsList,
        {
          activationMode: "automatic",
          "aria-label": "Worker views",
          variant: "line",
        },
        React.createElement(
          packageModule.TabsTrigger,
          { value: "overview" },
          "Overview",
        ),
        React.createElement(
          packageModule.TabsTrigger,
          { disabled: true, value: "diagnostics" },
          "Diagnostics",
        ),
      ),
      React.createElement(
        packageModule.TabsContent,
        { value: "overview" },
        "Worker summary",
      ),
      React.createElement(
        packageModule.TabsContent,
        { keepMounted: true, value: "diagnostics" },
        "Diagnostics unavailable",
      ),
    ),
  );

  assert.match(tabs, /^<div[^>]*data-orientation="vertical"/);
  assert.match(tabs, /class="consumer-tabs"/);
  assert.match(tabs, /data-console-tabs=""/);
  assert.match(tabs, /role="tablist"/);
  assert.match(tabs, /aria-label="Worker views"/);
  assert.match(tabs, /aria-orientation="vertical"/);
  assert.match(tabs, /data-console-tabs-list=""/);
  assert.match(tabs, /data-variant="line"/);
  assert.match(tabs, /<button[^>]*type="button"/);
  assert.match(tabs, /role="tab"/);
  assert.match(tabs, /aria-selected="true"/);
  assert.match(tabs, /aria-disabled="true"/);
  assert.match(tabs, /data-disabled=""/);
  assert.match(tabs, /role="tabpanel"/);
  assert.match(tabs, /data-console-tabs-content=""/);
  assert.match(tabs, /data-hidden=""/);
  assert.match(tabs, /hidden=""/);
  assert.match(tabs, /inert=""/);
  assert.doesNotMatch(tabs, /<a|href=/);
  assert.doesNotMatch(declaration, /@base-ui/);
  assert.doesNotMatch(declaration, /next\//);
});

test("tabs styles cover compact variants, orientation, focus, and system modes", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );

  assert.match(styles, /\[data-console-tabs\]\s*\{/);
  assert.match(
    styles,
    /\[data-console-tabs\]\[data-orientation="horizontal"\]/,
  );
  assert.match(styles, /\[data-console-tabs\]\[data-orientation="vertical"\]/);
  assert.match(styles, /\[data-console-tabs-list\]\[data-variant="surface"\]/);
  assert.match(styles, /\[data-console-tabs-list\]\[data-variant="line"\]/);
  assert.match(styles, /\[data-console-tabs-trigger\]\[data-active\]/);
  assert.match(styles, /\[data-console-tabs-trigger\]:focus-visible/);
  assert.match(styles, /\[data-console-tabs-content\]:focus-visible/);
  assert.match(styles, /--console-opacity-disabled/);
  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-tabs-list\]/,
  );
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\[data-console-tabs-trigger\]/,
  );
});

test("tabs story covers variants, orientations, activation, and product boundaries", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/tabs.stories.tsx"),
    "utf8",
  );

  for (const component of ["Tabs", "TabsContent", "TabsList", "TabsTrigger"]) {
    assert.match(story, new RegExp(`<${component}(?:\\s|>)`));
  }

  assert.match(story, /<ThemeTabsPreview theme="light" \/>/);
  assert.match(story, /<ThemeTabsPreview theme="dark" \/>/);
  assert.match(story, /activationMode="manual"/);
  assert.match(story, /activationMode="automatic"/);
  assert.match(story, /orientation="vertical"/);
  assert.match(story, /variant="line"/);
  assert.match(story, /<TabsTrigger disabled value="diagnostics">/);
  assert.match(story, /aria-label="Archive worker views"/);
  assert.match(story, /aria-label="Pipeline detail views"/);
  assert.match(story, /Route navigation remains a link concern/);
});

test("Console shell exposes product-neutral landmarks and navigation semantics", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const service = {
    id: "example-console",
    name: "Example",
    description: "read-only operations",
    mark: React.createElement("svg", { "aria-label": "Ignored mark" }),
    tone: "teal",
    environment: "production",
  };
  const navigation = [
    {
      id: "command",
      label: "Command",
      items: [
        {
          id: "overview",
          href: "/overview",
          label: "Overview",
          current: true,
          icon: React.createElement("svg"),
        },
        {
          id: "detail",
          href: "/detail",
          label: "Detail",
          level: 2,
          indicator: true,
        },
        {
          id: "disabled",
          href: "/disabled",
          label: "Disabled",
          disabled: true,
        },
      ],
    },
  ];
  const shell = renderToStaticMarkup(
    React.createElement(
      packageModule.ConsoleShell,
      {
        className: "consumer-shell",
        defaultNavigationCollapsed: true,
        navigation,
        navigationCollapsible: true,
        service,
        topbar: React.createElement("span", null, "Updated now"),
      },
      React.createElement(packageModule.ConsolePageHeader, {
        actions: React.createElement("button", null, "Refresh"),
        description: "Current operational state.",
        headingAs: "h1",
        icon: React.createElement("svg"),
        status: React.createElement("span", null, "Healthy"),
        title: "Overview",
      }),
    ),
  );

  assert.match(shell, /^<main/);
  assert.match(shell, /class="consumer-shell"/);
  assert.match(shell, /data-console-shell=""/);
  assert.match(shell, /data-navigation-collapsed="true"/);
  assert.match(shell, /data-content-width="contained"/);
  assert.match(shell, /data-density="comfortable"/);
  assert.match(shell, /data-console-service="example-console"/);
  assert.match(shell, /data-console-service-tone="teal"/);
  assert.match(shell, /data-console-environment="production"/);
  assert.match(shell, /<aside[^>]*data-console-shell-sidebar=""/);
  assert.match(
    shell,
    /<button[^>]*aria-expanded="false"[^>]*aria-label="Expand navigation"[^>]*data-console-shell-collapse-toggle=""/,
  );
  assert.match(shell, /<button[^>]*aria-expanded="false"/);
  assert.match(shell, /data-console-shell-navigation-toggle=""/);
  assert.match(
    shell,
    /data-console-shell-navigation-toggle-label="">Navigation/,
  );
  assert.match(shell, /data-console-shell-navigation-toggle-current=""/);
  assert.match(shell, /Current: <\/span>Overview/);
  assert.match(shell, /data-console-shell-navigation-panel=""/);
  assert.match(shell, /<nav[^>]*aria-label="Console navigation"/);
  assert.match(shell, /<h2[^>]*>Command<\/h2>/);
  assert.match(shell, /href="\/overview"/);
  assert.match(shell, /href="\/overview"[^>]*title="Overview"/);
  assert.match(shell, /aria-current="page"/);
  assert.match(shell, /data-level="2"/);
  assert.match(shell, /data-console-navigation-indicator=""/);
  assert.match(shell, /aria-disabled="true"/);
  assert.doesNotMatch(shell, /href="\/disabled"/);
  assert.match(
    shell,
    /data-console-visually-hidden="">Environment: <\/span><span data-console-environment-name="">Production<\/span>/,
  );
  assert.match(shell, /data-console-identity-mark="" title="Example"/);
  assert.match(
    shell,
    /data-console-environment-label="" title="Environment: Production"/,
  );
  assert.match(shell, /aria-hidden="true"[^>]*data-console-identity-mark=""/);
  assert.match(shell, /data-console-shell-topbar=""/);
  assert.match(shell, /<h1[^>]*>Overview<\/h1>/);
  assert.match(shell, /data-console-page-header-actions=""/);
  assert.doesNotMatch(shell, /next\/|role="status"|aria-live=/i);
});

test("Console navigation preserves the framework link renderer seam", async () => {
  const packageModule = await import(
    pathToFileURL(resolve(repositoryRoot, "packages/console-ui/dist/index.js"))
  );
  const React = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const navigation = renderToStaticMarkup(
    React.createElement(packageModule.ConsoleNavigation, {
      groups: [
        {
          id: "primary",
          label: "Primary",
          items: [{ id: "home", href: "/home", label: "Home", current: true }],
        },
      ],
      renderLink: (item, props) =>
        React.createElement("a", {
          ...props,
          "data-router-adapter": item.id,
        }),
    }),
  );

  assert.match(navigation, /data-router-adapter="home"/);
  assert.match(navigation, /href="\/home"/);
  assert.match(navigation, /aria-current="page"/);
  assert.match(navigation, /data-console-navigation-link=""/);
});

test("shell and page-header styles preserve density, context, and system modes", async () => {
  const styles = await readFile(
    resolve(repositoryRoot, "packages/console-ui/dist/styles.css"),
    "utf8",
  );

  for (const selector of [
    "data-console-shell",
    "data-console-identity",
    "data-console-environment-label",
    "data-console-navigation",
    "data-console-navigation-link",
    "data-console-shell-collapse-toggle",
    "data-console-shell-navigation-toggle",
    "data-console-page-header",
  ]) {
    assert.match(styles, new RegExp(`\\[${selector}`));
  }

  assert.match(styles, /grid-template-columns:\s*14\.75rem minmax\(0, 1fr\)/);
  assert.match(
    styles,
    /\[data-console-shell\]\[data-navigation-collapsed\][\s\S]*grid-template-columns:\s*3\.5rem minmax\(0, 1fr\)/,
  );
  assert.match(
    styles,
    /\[data-console-shell\]\[data-content-width="contained"\][\s\S]*max-width:\s*73\.75rem/,
  );
  assert.match(
    styles,
    /\[data-console-shell\]\[data-density="compact"\][\s\S]*\[data-console-shell-workspace\]/,
  );
  assert.match(styles, /position:\s*sticky/);
  assert.match(styles, /\[data-console-navigation-link\]:focus-visible/);
  assert.match(styles, /@media \(max-width: 64rem\)/);
  assert.match(styles, /@media \(min-width: 64\.0625rem\)/);
  assert.match(
    styles,
    /\[data-console-shell-navigation-panel\]:not\(\[data-open\]\)[\s\S]*display:\s*none/,
  );
  assert.match(
    styles,
    /\[data-console-shell-navigation-panel\]\[data-open\][\s\S]*grid-template-columns:\s*repeat\(3/,
  );
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(
    styles,
    /@media \(forced-colors: active\)[\s\S]*\[data-console-navigation-link\]:focus-visible/,
  );
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\[data-console-navigation-link\]/,
  );
});

test("shell story covers identity, navigation, page grammar, and both themes", async () => {
  const story = await readFile(
    resolve(repositoryRoot, "apps/storybook/src/shell.stories.tsx"),
    "utf8",
  );

  for (const component of [
    "ConsolePageHeader",
    "ConsoleShell",
    "StatusBadge",
  ]) {
    assert.match(story, new RegExp(`<${component}(?:\\s|>)`));
  }

  assert.match(story, /<ThemeShellPreview theme="light" \/>/);
  assert.match(story, /<ThemeShellPreview theme="dark" \/>/);
  assert.match(story, /environment: "production"/);
  assert.match(story, /level: 2/);
  assert.match(story, /current: true/);
  assert.match(story, /contentWidth="fluid"/);
  assert.match(story, /density="compact"/);
  assert.match(story, /navigationCollapsible/);
  assert.match(story, /export const Narrow/);
  assert.match(story, /Updated Aug 7, 19:12 UTC/);
  assert.match(
    story,
    /refresh, data, and product actions remain consumer-owned/,
  );
});

test("shared source imports only local modules and approved UI dependencies", async () => {
  const sourceDirectory = resolve(repositoryRoot, "packages/console-ui/src");
  const sourceFiles = await readdir(sourceDirectory, { recursive: true });
  const allowedPackages = new Set([
    "@base-ui/react",
    "@polyconsole/design-tokens",
    "@stylexjs/stylex",
    "react",
    "react-dom",
  ]);

  for (const file of sourceFiles.filter((file) =>
    /\.[cm]?[jt]sx?$/.test(file),
  )) {
    const sourcePath = resolve(sourceDirectory, file);
    const source = await readFile(sourcePath, "utf8");
    const { importedFiles } = ts.preProcessFile(source, true, true);

    for (const { fileName: specifier } of importedFiles) {
      if (specifier.startsWith(".")) {
        const target = relative(
          sourceDirectory,
          resolve(dirname(sourcePath), specifier),
        );

        assert.ok(
          target !== ".." && !target.startsWith("../"),
          `${file} imports outside shared source: ${specifier}`,
        );
      } else {
        const packageName = specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0];

        assert.ok(
          allowedPackages.has(packageName),
          `${file} imports an unapproved dependency: ${specifier}`,
        );
      }
    }
  }
});

test("reference console consumes only public package entry points", async () => {
  const manifest = await readJson("examples/reference-console/package.json");
  const source = await readFile(
    resolve(repositoryRoot, "examples/reference-console/src/main.tsx"),
    "utf8",
  );

  assert.equal(manifest.private, true);
  assert.equal(manifest.dependencies["@polyconsole/design-tokens"], "*");
  assert.equal(manifest.dependencies["@polyconsole/console-ui"], "*");
  assert.match(source, /@polyconsole\/design-tokens\/tokens\.css/);
  assert.match(source, /@polyconsole\/console-ui\/styles\.css/);
  assert.match(source, /import "@polyconsole\/console-ui";/);
  assert.doesNotMatch(source, /(?:\.\.\/){2,}packages\//);
});
