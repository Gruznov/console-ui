import {
  Button,
  FilterButton,
  FilterGroup,
  FilterToolbar,
  StatusBadge,
} from "@gruznov/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "./filter-toolbar.css";

type Filter = "all" | "failed" | "running";
type Theme = "dark" | "light";

const filters: Array<{ label: string; value: Filter }> = [
  { label: "All 84", value: "all" },
  { label: "Running 3", value: "running" },
  { label: "Failed 2", value: "failed" },
];

function ThemeFilterPreview({ theme }: { theme: Theme }) {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <section className="filter-preview" data-console-theme={theme}>
      <div className="filter-preview__heading">
        <div>
          <span>Queue controls / {theme}</span>
          <h2>{theme === "light" ? "Light console" : "Dark console"}</h2>
        </div>
        <StatusBadge tone="warning">3 active</StatusBadge>
      </div>
      <FilterToolbar
        actions={
          <Button size="sm" variant="secondary">
            Refresh
          </Button>
        }
      >
        <FilterGroup label="Queue state">
          {filters.map((item) => (
            <FilterButton
              key={item.value}
              onClick={() => setFilter(item.value)}
              selected={filter === item.value}
            >
              {item.label}
            </FilterButton>
          ))}
          <FilterButton disabled>Archived</FilterButton>
        </FilterGroup>
      </FilterToolbar>
      <output>Showing {filter} tasks</output>
    </section>
  );
}

function FilterToolbarComparison() {
  return (
    <main className="filter-story">
      <header>
        <span>Console UI · shared composition</span>
        <h1>Filter toolbar</h1>
        <p>
          Dense, wrapping filters keep selection semantics separate from
          product-owned query state.
        </p>
      </header>
      <div className="filter-story__grid">
        <ThemeFilterPreview theme="light" />
        <ThemeFilterPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Compositions/Filter toolbar",
  component: FilterToolbarComparison,
} satisfies Meta<typeof FilterToolbarComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
