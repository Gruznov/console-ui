import type { StatusTone } from "@gruznov/console-ui";
import { Badge, StatusBadge } from "@gruznov/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./badge.css";

type Theme = "dark" | "light";

const states: Array<{ label: string; tone: StatusTone }> = [
  { label: "Waiting", tone: "neutral" },
  { label: "Syncing", tone: "info" },
  { label: "Healthy", tone: "success" },
  { label: "Delayed", tone: "warning" },
  { label: "Failed", tone: "danger" },
];

const mappings: Array<{
  description: string;
  label: string;
  product: string;
  source: string;
  tone: StatusTone;
}> = [
  {
    product: "Atlas",
    source: "active",
    label: "Healthy",
    tone: "success",
    description: "The adapter confirms an active service is healthy.",
  },
  {
    product: "Atlas",
    source: "stale",
    label: "Stale",
    tone: "warning",
    description: "Freshness exceeded the product-owned threshold.",
  },
  {
    product: "Beacon",
    source: "syncing",
    label: "Syncing",
    tone: "info",
    description: "Projection work is active but not yet complete.",
  },
  {
    product: "Beacon",
    source: "critical",
    label: "Failed",
    tone: "danger",
    description: "Operator review is required.",
  },
];

function TagIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 5.5h7l9 9-5.5 5.5-9-9V5.5Z" />
      <circle cx="8.5" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ThemeBadgePreview({ theme }: { theme: Theme }) {
  return (
    <section
      className="badge-preview"
      data-console-theme={theme}
      aria-labelledby={`${theme}-badge-title`}
    >
      <header className="badge-preview__header">
        <div>
          <span>Compact labels / {theme}</span>
          <h2 id={`${theme}-badge-title`}>
            {theme === "light" ? "Light console" : "Dark console"}
          </h2>
          <p>Quiet metadata and explicit status remain different concepts.</p>
        </div>
        <span className="badge-preview__theme">{theme}</span>
      </header>

      <section
        className="badge-preview__section"
        aria-labelledby={`${theme}-metadata-title`}
      >
        <div className="badge-preview__section-heading">
          <div>
            <h3 id={`${theme}-metadata-title`}>Metadata</h3>
            <p>Badge labels data without implying health or severity.</p>
          </div>
          <div className="badge-preview__row">
            <Badge>read only</Badge>
            <Badge className="badge-preview__mono">worker-02</Badge>
            <Badge>
              <TagIcon /> build 1642
            </Badge>
          </div>
        </div>
      </section>

      <section
        className="badge-preview__section"
        aria-labelledby={`${theme}-status-title`}
      >
        <div className="badge-preview__section-heading">
          <div>
            <h3 id={`${theme}-status-title`}>Operational tone</h3>
            <p>Text carries meaning; the indicator accelerates scanning.</p>
          </div>
          <div className="badge-preview__row">
            {states.map((state) => (
              <StatusBadge key={state.tone} tone={state.tone}>
                {state.label}
              </StatusBadge>
            ))}
          </div>
        </div>
        <div className="badge-preview__quiet-row">
          <span>
            Indicator can be suppressed where the label is already dense:
          </span>
          <StatusBadge indicator={false} tone="success">
            Completed
          </StatusBadge>
          <StatusBadge indicator={false} tone="warning">
            Needs review
          </StatusBadge>
        </div>
      </section>

      <section
        className="badge-preview__mapping"
        aria-labelledby={`${theme}-mapping-title`}
      >
        <div className="badge-preview__mapping-intro">
          <h3 id={`${theme}-mapping-title`}>Product adapter boundary</h3>
          <p>
            Domain state enters on the left; shared presentation exits on the
            right.
          </p>
        </div>
        <div className="badge-preview__mapping-head" aria-hidden="true">
          <span>Domain state</span>
          <span>Shared result</span>
          <span>Interpretation</span>
        </div>
        {mappings.map((mapping) => (
          <div
            className="badge-preview__mapping-row"
            key={`${mapping.product}-${mapping.source}`}
          >
            <div className="badge-preview__source">
              <small>Domain state</small>
              <span>{mapping.product}</span>
              <code>{mapping.source}</code>
            </div>
            <div className="badge-preview__result">
              <small>Shared result</small>
              <StatusBadge tone={mapping.tone}>{mapping.label}</StatusBadge>
            </div>
            <p>{mapping.description}</p>
          </div>
        ))}
      </section>
    </section>
  );
}

function BadgeComparison() {
  return (
    <main className="badge-story">
      <header className="badge-story__intro">
        <span>Console UI · CUI-031</span>
        <h1>Badge and StatusBadge</h1>
        <p>
          Dense labels normalize Atlas and Beacon presentation while domain
          interpretation stays in each product.
        </p>
      </header>
      <div className="badge-story__grid">
        <ThemeBadgePreview theme="light" />
        <ThemeBadgePreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Primitives/Badge",
  component: BadgeComparison,
} satisfies Meta<typeof BadgeComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
