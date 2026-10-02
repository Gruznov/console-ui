import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import stylex from "@stylexjs/unplugin";
import * as esbuild from "esbuild";

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, "dist");

await rm(dist, { force: true, recursive: true });

const result = await esbuild.build({
  entryPoints: [resolve(root, "src/index.ts")],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  outdir: dist,
  entryNames: "index",
  jsx: "automatic",
  metafile: true,
  treeShaking: true,
  external: ["react", "react/jsx-runtime", "react/jsx-dev-runtime"],
  plugins: [
    stylex.esbuild({
      dev: false,
      importSources: ["@stylexjs/stylex"],
      sxPropName: false,
      useCSSLayers: true,
    }),
  ],
});

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await listFiles(absolute)));
    } else {
      found.push(absolute);
    }
  }

  return found;
}

const outputFiles = await listFiles(dist);
const generatedCss = outputFiles.find(
  (file) => file.endsWith(".css") && file !== resolve(dist, "styles.css"),
);

if (!generatedCss) {
  throw new Error("StyleX did not emit a CSS asset");
}

const stylexCss = await readFile(generatedCss, "utf8");
const escapeCss = await readFile(resolve(root, "src/escape-hatch.css"), "utf8");
const finalCssPath = resolve(dist, "styles.css");

// StyleX's own priority layers stay nested inside the existing Console UI
// component layer. The escape-hatch layer is a later sibling within the same
// namespace, so narrowly-scoped structural rules can override atomics without
// escaping the package's established cascade boundary from ADR 0005.
const wrappedStylexCss = `@layer console.components {\n${stylexCss.trim()}\n}`;

await writeFile(
  finalCssPath,
  `${wrappedStylexCss}\n\n${escapeCss.trim()}\n`,
  "utf8",
);

if (generatedCss !== finalCssPath) {
  await rm(generatedCss, { force: true });
}

await writeFile(
  resolve(dist, "metafile.json"),
  `${JSON.stringify(result.metafile, null, 2)}\n`,
  "utf8",
);

console.log(`Built ${relative(root, resolve(dist, "index.js"))}`);
console.log(`Built ${relative(root, finalCssPath)}`);
