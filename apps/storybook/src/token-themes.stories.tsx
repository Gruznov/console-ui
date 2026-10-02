import type { Meta, StoryObj } from "@storybook/react-vite";

import "./token-themes.css";

type Theme = "dark" | "light";

const rows = [
  {
    name: "Source ingestion",
    owner: "intake",
    cadence: "30 s",
    volume: "14,208",
  },
  {
    name: "Archive projection",
    owner: "web",
    cadence: "2 min",
    volume: "8,931",
  },
  {
    name: "Document extraction",
    owner: "content",
    cadence: "5 min",
    volume: "2,407",
  },
];

function ThemePreview({ theme }: { theme: Theme }) {
  const title = theme === "light" ? "Light console" : "Dark console";

  return (
    <article className="token-theme" data-console-theme={theme}>
      <header className="token-theme__header">
        <div>
          <span className="token-theme__eyebrow">Foundation / {theme}</span>
          <h2>{title}</h2>
          <p>Compact operational hierarchy using only CUI-021 tokens.</p>
        </div>
        <span className="token-theme__mode">{theme}</span>
      </header>

      <div className="token-theme__toolbar">
        <label className="token-theme__search">
          <span>Search processes</span>
          <input type="search" defaultValue="projection" />
        </label>
        <button className="token-theme__button" type="button">
          Export
        </button>
        <button
          className="token-theme__button token-theme__button--primary"
          type="button"
        >
          Run checks
        </button>
      </div>

      <dl className="token-theme__metrics">
        <div>
          <dt>Active processes</dt>
          <dd>18</dd>
          <small>of 20 configured</small>
        </div>
        <div>
          <dt>Queued records</dt>
          <dd>232</dd>
          <small>31 added recently</small>
        </div>
        <div>
          <dt>Throughput</dt>
          <dd>65.6k/h</dd>
          <small>rolling hour</small>
        </div>
      </dl>

      <section className="token-theme__panel" aria-labelledby={`${theme}-rows`}>
        <div className="token-theme__panel-header">
          <div>
            <h3 id={`${theme}-rows`}>Process inventory</h3>
            <p>Aligned metadata and tabular numeric values.</p>
          </div>
          <span>3 processes</span>
        </div>
        <div className="token-theme__table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Process</th>
                <th scope="col">Owner</th>
                <th scope="col">Cadence</th>
                <th scope="col">Records</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{row.owner}</td>
                  <td className="token-theme__numeric">{row.cadence}</td>
                  <td className="token-theme__numeric">{row.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="token-theme__swatches">
        <span data-surface="canvas">Canvas</span>
        <span data-surface="default">Default</span>
        <span data-surface="muted">Muted</span>
        <span data-surface="inverse">Inverse</span>
      </div>
    </article>
  );
}

function TokenThemeComparison() {
  return (
    <main className="token-theme-story">
      <header className="token-theme-story__intro">
        <span>Console UI · CUI-021</span>
        <h1>Theme foundations</h1>
        <p>
          The same dense fixture renders side by side so hierarchy, spacing,
          borders, and action states can be compared without product behavior.
        </p>
      </header>
      <div className="token-theme-story__grid">
        <ThemePreview theme="light" />
        <ThemePreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Foundation/Token themes",
  component: TokenThemeComparison,
} satisfies Meta<typeof TokenThemeComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
