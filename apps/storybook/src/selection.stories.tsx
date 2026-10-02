import {
  ChoiceCard,
  ChoiceGroup,
  ProgressSteps,
} from "@polyconsole/console-ui";
import type { Meta, StoryObj } from "@storybook/react";

import "./selection.css";
import "./token-themes.css";

function ThemeSelectionPreview({ theme }: { theme: "dark" | "light" }) {
  return (
    <section
      className="selection-story-panel"
      data-console-service-tone="teal"
      data-console-theme={theme}
    >
      <h2>{theme === "light" ? "Light workflow" : "Dark workflow"}</h2>
      <ProgressSteps
        label="Resource setup"
        steps={[
          { id: "details", label: "Details", state: "complete" },
          { id: "policy", label: "Policy", state: "current" },
          { id: "review", label: "Review", state: "upcoming" },
        ]}
      />
      <ChoiceGroup columns={2} legend="Archive policy">
        <ChoiceCard
          defaultChecked
          description="Respect the site's published crawl policy."
          icon={<span>R</span>}
          label="Respect robots.txt"
          name={`${theme}-policy`}
          value="respect"
        />
        <ChoiceCard
          description="Override the policy only with explicit authority."
          icon={<span>I</span>}
          label="Ignore robots.txt"
          name={`${theme}-policy`}
          value="ignore"
        />
        <ChoiceCard
          description="Unavailable until a storage policy is configured."
          disabled
          label="External mirror"
          name={`${theme}-policy`}
          value="external"
        />
      </ChoiceGroup>
      <ChoiceGroup legend="Optional destinations">
        <ChoiceCard
          defaultChecked
          description="Submit eligible captures after the local archive succeeds."
          label="Internet Archive"
          name={`${theme}-destination`}
          type="checkbox"
          value="internet-archive"
        />
      </ChoiceGroup>
    </section>
  );
}

function SelectionComparison() {
  return (
    <div className="selection-story-stack">
      <ThemeSelectionPreview theme="light" />
      <ThemeSelectionPreview theme="dark" />
    </div>
  );
}

const meta = {
  title: "Components/Selection and progress",
  component: SelectionComparison,
} satisfies Meta<typeof SelectionComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Workflow: Story = {};
