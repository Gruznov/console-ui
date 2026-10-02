import { ActionLink, Button, IconButton } from "@polyconsole/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "./button.css";

type Theme = "dark" | "light";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    >
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M6.1 9a7 7 0 0 1 11.7-2L20 12M4 12l2.2 5a7 7 0 0 0 11.7-2" />
    </svg>
  );
}

function ThemeActionPreview({ theme }: { theme: Theme }) {
  const [runCount, setRunCount] = useState(0);

  return (
    <section
      className="button-preview"
      data-console-theme={theme}
      aria-labelledby={`${theme}-button-title`}
    >
      <header className="button-preview__header">
        <div>
          <span>Action primitives / {theme}</span>
          <h2 id={`${theme}-button-title`}>
            {theme === "light" ? "Light console" : "Dark console"}
          </h2>
          <p>One intent vocabulary for read-only and consequential actions.</p>
        </div>
        <span className="button-preview__theme">{theme}</span>
      </header>

      <section
        className="button-preview__section"
        aria-labelledby={`${theme}-variants`}
      >
        <div>
          <h3 id={`${theme}-variants`}>Intent</h3>
          <p>Variant names describe action weight, not product styling.</p>
        </div>
        <fieldset
          className="button-preview__row"
          aria-label={`${theme} button variants`}
        >
          <Button>
            Run checks
            <ArrowIcon />
          </Button>
          <Button variant="secondary">Export</Button>
          <Button variant="ghost">View details</Button>
          <Button variant="danger">Delete record</Button>
        </fieldset>
        <div className="button-preview__row">
          <ActionLink href="/workers/new" variant="primary">
            Add worker
          </ActionLink>
          <ActionLink href="/workers">View all workers</ActionLink>
        </div>
      </section>

      <section
        className="button-preview__section"
        aria-labelledby={`${theme}-sizes`}
      >
        <div>
          <h3 id={`${theme}-sizes`}>Compact sizes</h3>
          <p>Small remains 24 px; medium is the 32 px console default.</p>
        </div>
        <fieldset
          className="button-preview__row"
          aria-label={`${theme} button sizes`}
        >
          <Button size="sm" variant="secondary">
            Small
          </Button>
          <Button size="md" variant="secondary">
            Medium
          </Button>
          <Button size="lg" variant="secondary">
            Large
          </Button>
        </fieldset>
      </section>

      <section
        className="button-preview__section"
        aria-labelledby={`${theme}-states`}
      >
        <div>
          <h3 id={`${theme}-states`}>Operational states</h3>
          <p>Pending stays explicit and cannot be submitted twice.</p>
        </div>
        <fieldset
          className="button-preview__row"
          aria-label={`${theme} button states`}
        >
          <Button variant="secondary" disabled>
            Unavailable
          </Button>
          <Button pending pendingLabel="Saving changes">
            Save changes
          </Button>
          <Button aria-expanded="true" variant="ghost">
            Filters open
          </Button>
        </fieldset>
      </section>

      <section
        className="button-preview__section"
        aria-labelledby={`${theme}-icons`}
      >
        <div>
          <h3 id={`${theme}-icons`}>Icon-only actions</h3>
          <p>The required label supplies the accessible name.</p>
        </div>
        <fieldset
          className="button-preview__row"
          aria-label={`${theme} icon button examples`}
        >
          <IconButton label="Refresh data" size="sm">
            <RefreshIcon />
          </IconButton>
          <IconButton label="Refresh data">
            <RefreshIcon />
          </IconButton>
          <IconButton label="More actions" size="lg" variant="ghost">
            <DotsIcon />
          </IconButton>
          <IconButton
            label="Refresh data"
            pending
            pendingLabel="Refreshing data"
          >
            <RefreshIcon />
          </IconButton>
        </fieldset>
      </section>

      <section
        className="button-preview__probe"
        aria-labelledby={`${theme}-probe`}
      >
        <div>
          <h3 id={`${theme}-probe`}>Interaction probe</h3>
          <p>Native button behavior remains observable in the workbench.</p>
        </div>
        <Button onClick={() => setRunCount((count) => count + 1)}>
          Run probe
        </Button>
        <output aria-live="polite">{runCount} completed</output>
      </section>
    </section>
  );
}

function ButtonComparison() {
  return (
    <main className="button-story">
      <header className="button-story__intro">
        <span>Console UI · CUI-030</span>
        <h1>Button, IconButton, and ActionLink</h1>
        <p>
          Dense action controls normalize Atlas and Beacon behavior without
          importing either product utility layer or mutation logic.
        </p>
      </header>

      <div className="button-story__grid">
        <ThemeActionPreview theme="light" />
        <ThemeActionPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Primitives/Button",
  component: ButtonComparison,
} satisfies Meta<typeof ButtonComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
