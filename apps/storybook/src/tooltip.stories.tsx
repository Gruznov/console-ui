import { IconButton, Tooltip } from "@polyconsole/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./tooltip.css";

type Theme = "dark" | "light";

function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </svg>
  );
}

function ThemeTooltipPreview({ theme }: { theme: Theme }) {
  return (
    <section className="tooltip-preview" data-console-theme={theme}>
      <div>
        <span>Context help / {theme}</span>
        <h2>{theme === "light" ? "Light console" : "Dark console"}</h2>
        <p>Hover, focus, or press the icon to reveal supporting context.</p>
      </div>
      <div className="tooltip-preview__row">
        <span>Collection freshness</span>
        <Tooltip content="Age of the latest successfully stored projection.">
          <IconButton
            label="About collection freshness"
            size="sm"
            variant="ghost"
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="tooltip-preview__row">
        <span>Visible reference state</span>
        <Tooltip
          content="This tooltip is pinned open only in the component workbench."
          open
          side="bottom"
        >
          <IconButton
            label="About the reference state"
            size="sm"
            variant="ghost"
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
    </section>
  );
}

function TooltipComparison() {
  return (
    <main className="tooltip-story">
      <header>
        <span>Console UI · shared overlay</span>
        <h1>Tooltip</h1>
        <p>
          Accessible contextual help replaces consumer-owned positioning and
          viewport event handlers.
        </p>
      </header>
      <div className="tooltip-story__grid">
        <ThemeTooltipPreview theme="light" />
        <ThemeTooltipPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Primitives/Tooltip",
  component: TooltipComparison,
} satisfies Meta<typeof TooltipComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
