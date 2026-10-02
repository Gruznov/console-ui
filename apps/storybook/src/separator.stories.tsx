import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  StatusBadge,
} from "@polyconsole/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./separator.css";

type Theme = "dark" | "light";

const events = [
  {
    time: "11:42:08",
    title: "Capture completed",
    detail: "docs.example.org/guide",
    tone: "success" as const,
    status: "Stored",
  },
  {
    time: "11:41:54",
    title: "Retry scheduled",
    detail: "example.net/archive",
    tone: "warning" as const,
    status: "Delayed",
  },
  {
    time: "11:41:31",
    title: "Index projection",
    detail: "1,284 records committed",
    tone: "info" as const,
    status: "Updated",
  },
];

function ThemeSeparatorPreview({ theme }: { theme: Theme }) {
  const queueTitleId = `${theme}-queue-title`;

  return (
    <section
      className="separator-preview"
      data-console-theme={theme}
      aria-labelledby={`${theme}-separator-preview-title`}
    >
      <header className="separator-preview__header">
        <div>
          <span>Quiet structure / {theme}</span>
          <h2 id={`${theme}-separator-preview-title`}>
            {theme === "light" ? "Light console" : "Dark console"}
          </h2>
          <p>
            One-pixel boundaries preserve density without adding containers.
          </p>
        </div>
        <Badge>{theme}</Badge>
      </header>

      <div className="separator-preview__body">
        <Card as="article" aria-labelledby={queueTitleId}>
          <CardHeader>
            <CardTitle as="h3" id={queueTitleId}>
              Archive pipeline
            </CardTitle>
            <CardDescription>
              Current queue and the latest completed work.
            </CardDescription>
            <CardAction>
              <StatusBadge tone="success">Healthy</StatusBadge>
            </CardAction>
          </CardHeader>

          <Separator aria-label="Current queue and recent activity" />

          <CardContent className="separator-preview__summary">
            <div>
              <span>Queued</span>
              <strong>18</strong>
            </div>
            <div>
              <span>Active</span>
              <strong>4</strong>
            </div>
            <div>
              <span>Failed</span>
              <strong>3</strong>
            </div>
          </CardContent>

          <Separator decorative />

          <CardContent className="separator-preview__feed">
            <div className="separator-preview__feed-heading">
              <h4>Recent activity</h4>
              <span>UTC</span>
            </div>
            <div className="separator-preview__events">
              {events.map((event, index) => (
                <div key={`${event.time}-${event.title}`}>
                  {index > 0 ? <Separator decorative /> : null}
                  <article className="separator-preview__event">
                    <time>{event.time}</time>
                    <div>
                      <strong>{event.title}</strong>
                      <span>{event.detail}</span>
                    </div>
                    <StatusBadge indicator={false} tone={event.tone}>
                      {event.status}
                    </StatusBadge>
                  </article>
                </div>
              ))}
            </div>
          </CardContent>

          <Separator decorative />

          <CardContent className="separator-preview__toolbar">
            <Button size="sm" variant="secondary">
              Retry
            </Button>
            <Separator decorative orientation="vertical" />
            <Badge>3 failed</Badge>
            <Separator decorative orientation="vertical" />
            <span>updated 12 sec ago</span>
          </CardContent>
        </Card>

        <div className="separator-preview__contract">
          <div>
            <strong>Semantic</strong>
            <span>Separates named regions</span>
          </div>
          <Separator decorative orientation="vertical" />
          <div>
            <strong>Decorative</strong>
            <span>Reinforces existing list structure</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SeparatorComparison() {
  return (
    <main className="separator-story">
      <header className="separator-story__intro">
        <span>Console UI · CUI-033</span>
        <h1>Separator</h1>
        <p>
          A quiet structural primitive for dense feeds, named regions, and
          compact toolbars.
        </p>
      </header>
      <div className="separator-story__grid">
        <ThemeSeparatorPreview theme="light" />
        <ThemeSeparatorPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Primitives/Separator",
  component: SeparatorComparison,
} satisfies Meta<typeof SeparatorComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
