import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@polyconsole/design-tokens/tokens.css";
import "@polyconsole/console-ui";
import "@polyconsole/console-ui/styles.css";

import { ReferenceConsole } from "./reference-console";
import "./reference-console.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Reference console root element is missing.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ReferenceConsole />
  </StrictMode>,
);
