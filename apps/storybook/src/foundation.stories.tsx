import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundation.css";

function FoundationStatus() {
  return (
    <main className="foundation-status" aria-labelledby="foundation-title">
      <header className="foundation-status__header">
        <p className="foundation-status__eyebrow">Console UI</p>
        <h1 id="foundation-title">Shared workbench is ready</h1>
        <p>
          This story verifies the isolated React workbench and the published CSS
          entry-point shape without introducing a stable component API.
        </p>
      </header>

      <section
        className="foundation-status__section"
        aria-labelledby="current-contracts"
      >
        <h2 id="current-contracts">Current contracts</h2>
        <ul>
          <li>Framework-independent semantic-token package</li>
          <li>React package with no Next.js dependency</li>
          <li>Ready-to-import, package-scoped CSS</li>
          <li>Versioned token inventory with light and dark foundations</li>
          <li>Explicit service and environment context identities</li>
          <li>
            Stable action, badge, card, separator, table, and tabs primitives
          </li>
        </ul>
      </section>

      <section
        className="foundation-status__section"
        aria-labelledby="next-evidence"
      >
        <h2 id="next-evidence">Next evidence</h2>
        <p>
          The initial tokens and the action, badge, card, separator, table, and
          tabs primitive families are complete. Accessible Tooltip behavior is
          the next foundational candidate.
        </p>
      </section>
    </main>
  );
}

const meta = {
  title: "Foundation/Workspace status",
  component: FoundationStatus,
} satisfies Meta<typeof FoundationStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CurrentContracts = {} satisfies Story;
