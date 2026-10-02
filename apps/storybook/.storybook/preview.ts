import type { Preview } from "@storybook/react-vite";

import "@polyconsole/design-tokens/tokens.css";
import "@polyconsole/console-ui/styles.css";

const preview = {
  parameters: {
    a11y: {
      test: "error",
    },
    layout: "fullscreen",
  },
} satisfies Preview;

export default preview;
