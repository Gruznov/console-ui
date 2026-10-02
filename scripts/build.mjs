import { spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import stylex from "@stylexjs/unplugin";
import * as esbuild from "esbuild";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packages = {
  designTokens: resolve(repositoryRoot, "packages/design-tokens"),
  consoleUi: resolve(repositoryRoot, "packages/console-ui"),
};

for (const packageRoot of Object.values(packages)) {
  await rm(resolve(packageRoot, "dist"), { force: true, recursive: true });
}

const typescriptCli = resolve(
  repositoryRoot,
  "node_modules/typescript/bin/tsc",
);
const typeScriptResult = spawnSync(
  process.execPath,
  [typescriptCli, "--build", "--pretty", "false", "--force"],
  {
    cwd: repositoryRoot,
    stdio: "inherit",
  },
);

if (typeScriptResult.status !== 0) {
  process.exit(typeScriptResult.status ?? 1);
}

const staticFiles = [
  {
    source: resolve(packages.designTokens, "src/tokens.css"),
    target: resolve(packages.designTokens, "dist/tokens.css"),
  },
  {
    source: resolve(packages.designTokens, "src/token-inventory.json"),
    target: resolve(packages.designTokens, "dist/token-inventory.json"),
  },
];

for (const { source, target } of staticFiles) {
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(absolute)));
    else files.push(absolute);
  }

  return files;
}

const consoleUiSourceRoot = resolve(packages.consoleUi, "src");
const consoleUiDistRoot = resolve(packages.consoleUi, "dist");
const consoleUiSourceFiles = await listFiles(consoleUiSourceRoot);
const stylexEntryPoints = [];
const escapeCssFiles = [];

for (const sourceFile of consoleUiSourceFiles) {
  if (sourceFile.endsWith(".escape.css")) {
    escapeCssFiles.push(sourceFile);
    continue;
  }

  if (!/\.[cm]?[jt]sx?$/.test(sourceFile)) continue;
  const source = await readFile(sourceFile, "utf8");
  if (source.includes("@stylexjs/stylex")) stylexEntryPoints.push(sourceFile);
}

stylexEntryPoints.sort();
escapeCssFiles.sort();

const stylexBuildRoot = resolve(repositoryRoot, ".cache/stylex/console-ui");
await rm(stylexBuildRoot, { force: true, recursive: true });

let stylexCss = "";
let stylexRuntimeBytes = 0;

if (stylexEntryPoints.length > 0) {
  const preserveModuleGraph = {
    name: "preserve-console-ui-module-graph",
    setup(build) {
      build.onResolve({ filter: /^\.{1,2}\// }, (args) => ({
        external: true,
        path: args.path,
      }));
      build.onResolve({ filter: /^[^./]/ }, (args) => {
        if (args.path === "@stylexjs/stylex") return null;
        return { external: true, path: args.path };
      });
    },
  };

  const stylexResult = await esbuild.build({
    entryPoints: stylexEntryPoints,
    bundle: true,
    format: "esm",
    jsx: "automatic",
    metafile: true,
    outbase: consoleUiSourceRoot,
    outdir: stylexBuildRoot,
    platform: "browser",
    plugins: [
      preserveModuleGraph,
      stylex.esbuild({
        dev: false,
        importSources: ["@stylexjs/stylex"],
        sxPropName: false,
        useCSSLayers: false,
      }),
    ],
    sourcemap: true,
    target: ["es2022"],
    treeShaking: true,
  });

  for (const output of Object.values(stylexResult.metafile.outputs)) {
    for (const [inputPath, input] of Object.entries(output.inputs ?? {})) {
      if (inputPath.includes("node_modules/@stylexjs/stylex/")) {
        stylexRuntimeBytes += input.bytesInOutput ?? 0;
      }
    }
  }

  if (stylexRuntimeBytes !== 0) {
    throw new Error(
      `StyleX-authored modules retained ${stylexRuntimeBytes} runtime byte(s); expected zero`,
    );
  }

  for (const sourceFile of stylexEntryPoints) {
    const sourceRelative = relative(consoleUiSourceRoot, sourceFile);
    const outputRelative = sourceRelative.replace(/\.[cm]?[jt]sx?$/, ".js");
    const generatedJs = resolve(stylexBuildRoot, outputRelative);
    const generatedMap = `${generatedJs}.map`;
    const targetJs = resolve(consoleUiDistRoot, outputRelative);
    const targetMap = `${targetJs}.map`;
    const emittedJs = await readFile(generatedJs, "utf8");

    if (/@stylexjs\/stylex|stylex\.(?:create|props)/.test(emittedJs)) {
      throw new Error(
        `StyleX runtime reference remains in ${relative(repositoryRoot, targetJs)}`,
      );
    }

    await mkdir(dirname(targetJs), { recursive: true });
    await Promise.all([
      copyFile(generatedJs, targetJs),
      copyFile(generatedMap, targetMap),
    ]);
  }

  stylexCss = await readFile(resolve(stylexBuildRoot, "stylex.css"), "utf8");
}

const componentStyles = await readFile(
  resolve(consoleUiSourceRoot, "styles.css"),
  "utf8",
);
const escapeStyles = (
  await Promise.all(escapeCssFiles.map((file) => readFile(file, "utf8")))
)
  .map((css) => css.trim())
  .filter(Boolean)
  .join("\n\n");
const generatedLayerContent = [stylexCss.trim(), escapeStyles]
  .filter(Boolean)
  .join("\n\n");
const finalStyles = generatedLayerContent
  ? `${componentStyles.trim()}\n\n@layer console.components {\n${generatedLayerContent}\n}\n`
  : `${componentStyles.trim()}\n`;

await writeFile(resolve(consoleUiDistRoot, "styles.css"), finalStyles, "utf8");

await rm(stylexBuildRoot, { force: true, recursive: true });

console.log(
  `Built @gruznov/design-tokens and @gruznov/console-ui; StyleX entries: ${stylexEntryPoints.length}; runtime: ${stylexRuntimeBytes} bytes.`,
);
console.log(
  `StyleX CSS: ${Buffer.byteLength(stylexCss)} bytes; CSS escape files: ${escapeCssFiles.length}; output ${relative(repositoryRoot, resolve(consoleUiDistRoot, "styles.css"))}.`,
);
