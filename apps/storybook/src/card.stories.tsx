import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  StatusBadge,
} from "@polyconsole/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./card.css";

type Theme = "dark" | "light";

const metrics = [
  { label: "Queued", value: "18", note: "4 high priority" },
  { label: "Processed", value: "2,841", note: "last 24 hours" },
  { label: "Coverage", value: "98.4%", note: "indexable pages" },
];

function RefreshIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 11a8 8 0 1 0-2.35 5.65M20 5v6h-6" />
    </svg>
  );
}

function ThemeCardPreview({ theme }: { theme: Theme }) {
  const titleId = `${theme}-worker-title`;

  return (
    <section
      className="card-preview"
      data-console-theme={theme}
      aria-labelledby={`${theme}-card-preview-title`}
    >
      <header className="card-preview__header">
        <div>
          <span>Operational density / {theme}</span>
          <h2 id={`${theme}-card-preview-title`}>
            {theme === "light" ? "Light console" : "Dark console"}
          </h2>
          <p>
            Shared structure stays predictable while product data remains local.
          </p>
        </div>
        <Badge>{theme}</Badge>
      </header>

      <div className="card-preview__body">
        <section
          className="card-preview__section"
          aria-labelledby={`${theme}-operational-title`}
        >
          <div className="card-preview__section-heading">
            <h3 id={`${theme}-operational-title`}>Operational card</h3>
            <span>md · article</span>
          </div>

          <Card as="article" aria-labelledby={titleId}>
            <CardHeader separated>
              <CardTitle as="h4" id={titleId}>
                Archive worker
              </CardTitle>
              <CardDescription>
                Processing the primary capture queue.
              </CardDescription>
              <CardAction>
                <StatusBadge tone="success">Healthy</StatusBadge>
              </CardAction>
            </CardHeader>

            <CardContent>
              <dl className="card-preview__details">
                <div>
                  <dt>Worker</dt>
                  <dd>worker-eu-02</dd>
                </div>
                <div>
                  <dt>Current item</dt>
                  <dd>docs.example.org/guide</dd>
                </div>
                <div>
                  <dt>Last heartbeat</dt>
                  <dd>12 sec ago</dd>
                </div>
              </dl>
            </CardContent>

            <CardFooter separated>
              <span className="card-preview__footer-note">
                Updated automatically
              </span>
              <Button size="sm" variant="secondary">
                <RefreshIcon />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section
          className="card-preview__section"
          aria-labelledby={`${theme}-compact-title`}
        >
          <div className="card-preview__section-heading">
            <h3 id={`${theme}-compact-title`}>Compact composition</h3>
            <span>sm · dense grid</span>
          </div>

          <div className="card-preview__metrics">
            {metrics.map((metric) => {
              const metricTitleId = `${theme}-${metric.label.toLowerCase()}-metric-title`;

              return (
                <Card
                  as="article"
                  aria-labelledby={metricTitleId}
                  size="sm"
                  key={metric.label}
                >
                  <CardHeader>
                    <CardTitle as="h4" id={metricTitleId}>
                      {metric.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <strong>{metric.value}</strong>
                    <span>{metric.note}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

function CardComparison() {
  return (
    <main className="card-story">
      <header className="card-story__intro">
        <span>Console UI · CUI-032</span>
        <h1>Card family</h1>
        <p>
          A dense, neutral container for operational detail and metric
          compositions. Status meaning stays in explicit content.
        </p>
      </header>
      <div className="card-story__grid">
        <ThemeCardPreview theme="light" />
        <ThemeCardPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Primitives/Card",
  component: CardComparison,
} satisfies Meta<typeof CardComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
