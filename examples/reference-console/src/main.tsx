import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@gruznov/design-tokens/tokens.css";
import "@gruznov/console-ui";
import "@gruznov/console-ui/styles.css";

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
