import type { Meta, StoryObj } from "@storybook/react-vite";

import "./status-focus.css";

type Theme = "dark" | "light";
type Tone = "danger" | "info" | "neutral" | "success" | "warning";

const states: Array<{
  description: string;
  label: string;
  tone: Tone;
}> = [
  {
    tone: "neutral",
    label: "Waiting",
    description: "No observation has arrived yet.",
  },
  {
    tone: "info",
    label: "Syncing",
    description: "Projection is 41% complete.",
  },
  {
    tone: "success",
    label: "Healthy",
    description: "Latest checks completed successfully.",
  },
  {
    tone: "warning",
    label: "Delayed",
    description: "Freshness target exceeded by 3 minutes.",
  },
  {
    tone: "danger",
    label: "Failed",
    description: "Operator review is required.",
  },
];

function StatusPreview({ theme }: { theme: Theme }) {
  return (
    <article className="state-foundation" data-console-theme={theme}>
      <header className="state-foundation__header">
        <div>
          <span>Semantic states / {theme}</span>
          <h2>{theme === "light" ? "Light console" : "Dark console"}</h2>
          <p>Labels remain explicit; color reinforces rather than replaces.</p>
        </div>
        <span className="state-foundation__theme">{theme}</span>
      </header>

      <section
        className="state-foundation__section"
        aria-labelledby={`${theme}-status-title`}
      >
        <div className="state-foundation__section-heading">
          <div>
            <h3 id={`${theme}-status-title`}>Operational status</h3>
            <p>
              Text, surface, and border roles render as one semantic family.
            </p>
          </div>
          <div className="state-foundation__badges">
            {states.map((state) => (
              <span
                className="state-foundation__badge"
                data-tone={state.tone}
                key={state.tone}
              >
                <span aria-hidden="true" />
                {state.label}
              </span>
            ))}
          </div>
        </div>

        <div className="state-foundation__notices">
          {states.map((state) => (
            <div
              className="state-foundation__notice"
              data-tone={state.tone}
              key={state.tone}
            >
              <strong>{state.label}</strong>
              <p>{state.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="state-foundation__section"
        aria-labelledby={`${theme}-interaction-title`}
      >
        <div className="state-foundation__section-heading">
          <div>
            <h3 id={`${theme}-interaction-title`}>Interaction states</h3>
            <p>
              Keyboard focus stays visible around neutral and danger actions.
            </p>
          </div>
        </div>

        <div className="state-foundation__controls">
          <button className="state-foundation__control" type="button">
            Run checks
          </button>
          <label>
            <span>Reason</span>
            <input
              className="state-foundation__control"
              defaultValue="Duplicate test record"
            />
          </label>
          <button
            className="state-foundation__control state-foundation__control--danger"
            type="button"
          >
            Delete test record
          </button>
          <button className="state-foundation__control" type="button" disabled>
            Saving changes
          </button>
        </div>
        <p className="state-foundation__hint">
          Use Tab to inspect the shared focus treatment. Disabled is not a
          status tone.
        </p>
      </section>
    </article>
  );
}

function StatusFocusComparison() {
  return (
    <main className="state-foundation-story">
      <header className="state-foundation-story__intro">
        <span>Console UI · CUI-022</span>
        <h1>Status and focus semantics</h1>
        <p>
          Operational meaning, consequential actions, keyboard focus, and
          disabled presentation are checked in both themes.
        </p>
      </header>
      <div className="state-foundation-story__grid">
        <StatusPreview theme="light" />
        <StatusPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Foundation/Status and focus",
  component: StatusFocusComparison,
} satisfies Meta<typeof StatusFocusComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
