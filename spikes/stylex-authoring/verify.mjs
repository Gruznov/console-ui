import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const jsPath = resolve(root, "dist/index.js");
const cssPath = resolve(root, "dist/styles.css");
const escapePath = resolve(root, "src/escape-hatch.css");
const metafilePath = resolve(root, "dist/metafile.json");

const [js, css, escapeCss, metafileSource, jsStat, cssStat, escapeStat] =
  await Promise.all([
    readFile(jsPath, "utf8"),
    readFile(cssPath, "utf8"),
    readFile(escapePath, "utf8"),
    readFile(metafilePath, "utf8"),
    stat(jsPath),
    stat(cssPath),
    stat(escapePath),
  ]);

const metafile = JSON.parse(metafileSource);
const failures = [];

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

expect(
  css.includes("@layer console.components {"),
  "generated StyleX CSS is not wrapped in the existing console.components layer",
);
expect(
  /@layer\s+priority/.test(css),
  "StyleX priority layers are missing from generated CSS",
);
expect(
  css.includes("@layer console.components.escape"),
  "escape-hatch layer is missing",
);
expect(
  css.includes("--console-action-primary"),
  "existing Console UI semantic tokens were not preserved",
);
expect(
  css.includes("[data-stylex-spike-card-header]:has"),
  "the :has() escape-hatch case is missing",
);
expect(
  css.includes("[data-stylex-spike-table-body]"),
  "the table relational-selector escape hatch is missing",
);
expect(
  !js.includes('import "./styles.css"') &&
    !js.includes("import './styles.css'") &&
    !js.includes('from "./styles.css"') &&
    !js.includes("from './styles.css'"),
  "compiled JS silently imports the generated stylesheet",
);
expect(!css.includes("@stylex;"), "uncompiled @stylex directive remains in CSS");

const atomicClassMatches = css.match(/\.x[a-zA-Z0-9_-]+/g) ?? [];
const uniqueAtomicClasses = new Set(atomicClassMatches);
const relationalSelectors =
  escapeCss.match(/:has\(|>\s*\[|\[data-sticky-header\]|:last-child|:hover/g) ??
  [];

const jsOutput = Object.entries(metafile.outputs).find(([outputPath]) =>
  outputPath.endsWith("index.js"),
)?.[1];

const stylexRuntimeInputs = jsOutput
  ? Object.entries(jsOutput.inputs)
      .filter(([inputPath]) => inputPath.includes("@stylexjs/stylex"))
      .map(([inputPath, details]) => ({
        inputPath,
        bytesInOutput: details.bytesInOutput,
      }))
      .sort((a, b) => b.bytesInOutput - a.bytesInOutput)
  : [];

const stylexRuntimeBytesInJs = stylexRuntimeInputs.reduce(
  (sum, input) => sum + input.bytesInOutput,
  0,
);

const metrics = {
  jsBytes: jsStat.size,
  cssBytes: cssStat.size,
  escapeHatchBytes: escapeStat.size,
  escapeShareOfCss: Number((escapeStat.size / cssStat.size).toFixed(3)),
  uniqueAtomicClasses: uniqueAtomicClasses.size,
  relationalSelectorSignals: relationalSelectors.length,
  stylexRuntimeReferenceInBundle:
    js.includes("@stylexjs/stylex") || js.includes("stylex.props"),
  stylexRuntimeBytesInJs,
  stylexRuntimeShareOfJs: Number(
    (stylexRuntimeBytesInJs / jsStat.size).toFixed(3),
  ),
  stylexRuntimeModules: stylexRuntimeInputs.slice(0, 8),
};

console.log("StyleX Console UI spike metrics:");
console.log(JSON.stringify(metrics, null, 2));

if (failures.length > 0) {
  console.error("\nVerification failures:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}
