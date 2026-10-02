import { Button, FeedbackState, InlineNotice } from "@gruznov/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./feedback.css";

type Theme = "dark" | "light";

const states = [
  {
    state: "checking" as const,
    title: "Checking latest exporter state",
    description: "No result is shown until the current read completes.",
  },
  {
    state: "empty" as const,
    title: "No service alerts",
    description: "The check completed successfully and found no alerts.",
  },
  {
    state: "unavailable" as const,
    title: "History unavailable",
    description: "This source does not provide a history artifact yet.",
  },
  {
    state: "error" as const,
    title: "Exporter read failed",
    description:
      "The latest artifact could not be read. Existing data is preserved.",
  },
];

function ThemeFeedbackPreview({ theme }: { theme: Theme }) {
  return (
    <section className="feedback-preview" data-console-theme={theme}>
      <header className="feedback-preview__header">
        <span>{theme}</span>
        <h2>Truthful operational states</h2>
        <p>Empty, unavailable, checking, and error never imply one another.</p>
      </header>
      <div className="feedback-preview__states">
        {states.map((item) => (
          <FeedbackState
            action={
              item.state === "error" ? (
                <Button size="sm" variant="secondary">
                  Retry
                </Button>
              ) : undefined
            }
            description={item.description}
            key={item.state}
            state={item.state}
            title={item.title}
          />
        ))}
      </div>
      <div className="feedback-preview__notices">
        <InlineNotice
          description="Relevant services and timers look normal."
          title="System checks"
          tone="success"
          value="12/12"
        />
        <InlineNotice
          description="Last complete snapshot is still visible."
          title="Source data is stale"
          tone="warning"
          value="18m"
        />
      </div>
    </section>
  );
}

function FeedbackComparison() {
  return (
    <main className="feedback-story">
      <header className="feedback-story__intro">
        <span>Console UI · CUI-037 / CUI-051–053</span>
        <h1>Feedback foundations</h1>
        <p>
          Products supply truthful state mapping and live-region behavior;
          Console UI supplies dense, predictable presentation.
        </p>
      </header>
      <div className="feedback-story__grid">
        <ThemeFeedbackPreview theme="light" />
        <ThemeFeedbackPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Patterns/Feedback",
  component: FeedbackComparison,
} satisfies Meta<typeof FeedbackComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
