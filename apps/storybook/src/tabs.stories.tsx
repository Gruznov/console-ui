import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gruznov/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./tabs.css";

type Theme = "dark" | "light";

function OverviewIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 5h16v14H4zM4 10h16M9 10v9" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 12h3l2-5 4 10 2-5h5" />
    </svg>
  );
}

function ThemeTabsPreview({ theme }: { theme: Theme }) {
  const workerTitleId = `${theme}-tabs-worker-title`;

  return (
    <section
      aria-labelledby={`${theme}-tabs-preview-title`}
      className="tabs-preview"
      data-console-theme={theme}
    >
      <header className="tabs-preview__header">
        <div>
          <span>Predictable views / {theme}</span>
          <h2 id={`${theme}-tabs-preview-title`}>
            {theme === "light" ? "Light console" : "Dark console"}
          </h2>
          <p>Compact local views with explicit keyboard activation.</p>
        </div>
        <Badge>{theme}</Badge>
      </header>

      <div className="tabs-preview__body">
        <section
          aria-labelledby={`${theme}-surface-tabs-title`}
          className="tabs-preview__section"
        >
          <div className="tabs-preview__section-heading">
            <h3 id={`${theme}-surface-tabs-title`}>Worker views</h3>
            <span>surface · manual</span>
          </div>

          <Card as="article" aria-labelledby={workerTitleId} size="sm">
            <CardHeader>
              <CardTitle as="h4" id={workerTitleId}>
                Archive worker
              </CardTitle>
              <CardDescription>
                Local panels keep routing and product state outside Tabs.
              </CardDescription>
              <CardAction>
                <StatusBadge tone="success">Healthy</StatusBadge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList
                  activationMode="manual"
                  aria-label="Archive worker views"
                >
                  <TabsTrigger value="overview">
                    <OverviewIcon />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    <ActivityIcon />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger disabled value="diagnostics">
                    Diagnostics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <dl className="tabs-preview__metrics">
                    <div>
                      <dt>Queued</dt>
                      <dd>18</dd>
                    </div>
                    <div>
                      <dt>Processed</dt>
                      <dd>2,841</dd>
                    </div>
                    <div>
                      <dt>Errors</dt>
                      <dd>3</dd>
                    </div>
                  </dl>
                </TabsContent>

                <TabsContent value="activity">
                  <ul className="tabs-preview__activity">
                    <li>
                      <time>11:42:08</time>
                      <span>Capture completed</span>
                    </li>
                    <li>
                      <time>11:41:54</time>
                      <span>Retry scheduled</span>
                    </li>
                    <li>
                      <time>11:41:31</time>
                      <span>Index projection updated</span>
                    </li>
                  </ul>
                </TabsContent>

                <TabsContent value="diagnostics">
                  Diagnostics are unavailable for this worker.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section
          aria-labelledby={`${theme}-line-tabs-title`}
          className="tabs-preview__section"
        >
          <div className="tabs-preview__section-heading">
            <h3 id={`${theme}-line-tabs-title`}>Pipeline detail</h3>
            <span>line · vertical · automatic</span>
          </div>

          <div className="tabs-preview__vertical-demo">
            <Tabs defaultValue="queue" orientation="vertical">
              <TabsList
                activationMode="automatic"
                aria-label="Pipeline detail views"
                variant="line"
              >
                <TabsTrigger value="queue">Queue</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="policy">Policy</TabsTrigger>
              </TabsList>

              <TabsContent value="queue">
                <dl className="tabs-preview__details">
                  <div>
                    <dt>Priority</dt>
                    <dd>4 high</dd>
                  </div>
                  <div>
                    <dt>Oldest item</dt>
                    <dd>6 min</dd>
                  </div>
                  <div>
                    <dt>Throughput</dt>
                    <dd>38/min</dd>
                  </div>
                </dl>
              </TabsContent>

              <TabsContent value="history">
                2,841 items completed during the last 24 hours.
              </TabsContent>

              <TabsContent value="policy">
                Retry and retention policy remain product-owned.
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </section>
  );
}

function TabsComparison() {
  return (
    <main className="tabs-story">
      <header className="tabs-story__intro">
        <span>Console UI · CUI-035</span>
        <h1>Tabs family</h1>
        <p>
          Accessible local panel switching with compact surface and line
          treatments. Route navigation remains a link concern.
        </p>
      </header>
      <div className="tabs-story__grid">
        <ThemeTabsPreview theme="light" />
        <ThemeTabsPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Primitives/Tabs",
  component: TabsComparison,
} satisfies Meta<typeof TabsComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
