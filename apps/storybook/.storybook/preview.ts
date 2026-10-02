import type { Preview } from "@storybook/react-vite";

import "@gruznov/design-tokens/tokens.css";
import "@gruznov/console-ui/styles.css";

const preview = {
  parameters: {
    a11y: {
      test: "error",
    },
    layout: "fullscreen",
  },
} satisfies Preview;

export default preview;
