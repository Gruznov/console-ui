import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type ConsoleNavigationGroup,
  ConsolePageHeader,
  type ConsoleServiceDescriptor,
  ConsoleShell,
  StatusBadge,
} from "@gruznov/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./shell.css";

type Theme = "dark" | "light";

function GaugeIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="m12 14 4-4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect height="6" rx="1" width="6" x="4" y="4" />
      <rect height="6" rx="1" width="6" x="14" y="4" />
      <rect height="6" rx="1" width="6" x="4" y="14" />
      <rect height="6" rx="1" width="6" x="14" y="14" />
    </svg>
  );
}

const service: ConsoleServiceDescriptor = {
  id: "atlas",
  name: "Atlas",
  description: "read-only dashboard",
  mark: <GaugeIcon />,
  tone: "neutral",
  environment: "production",
};

const navigation: ConsoleNavigationGroup[] = [
  {
    id: "command",
    label: "Command",
    items: [
      {
        id: "overview",
        href: "#overview",
        label: "Overview",
        icon: <GridIcon />,
      },
      {
        id: "pipelines",
        href: "#pipelines",
        label: "Pipelines",
        icon: <GridIcon />,
      },
    ],
  },
  {
    id: "jobs",
    label: "Jobs",
    items: [
      {
        id: "all-events",
        href: "#events",
        label: "All events",
        icon: <GridIcon />,
      },
      {
        id: "event-august",
        href: "#august",
        label: "7–9 August",
        level: 2,
        indicator: true,
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      {
        id: "workers",
        href: "#workers",
        label: "Workers",
        current: true,
        icon: <GridIcon />,
      },
      {
        id: "system",
        href: "#system",
        label: "System",
        icon: <GridIcon />,
      },
    ],
  },
];

function ThemeShellPreview({ theme }: { theme: Theme }) {
  return (
    <section className="shell-preview" aria-label={`${theme} console shell`}>
      <div className="shell-preview__label">{theme}</div>
      <ConsoleShell
        as="div"
        contentWidth="fluid"
        data-console-theme={theme}
        density="compact"
        navigation={navigation}
        navigationCollapsible
        service={service}
        topbar={
          <>
            <span className="shell-preview__freshness">
              Updated Aug 7, 19:12 UTC
            </span>
            <StatusBadge tone="success">Healthy</StatusBadge>
          </>
        }
      >
        <ConsolePageHeader
          actions={<Button variant="secondary">Refresh</Button>}
          description="Current worker status and latest actions."
          icon={<GridIcon />}
          status={<StatusBadge tone="neutral">Read only</StatusBadge>}
          title="Workers"
        />
        <div className="shell-preview__metrics">
          {[
            ["Age", "4.8s"],
            ["Iteration", "1,284"],
            ["Processed jobs", "810"],
          ].map(([label, value]) => (
            <Card key={label} size="sm">
              <CardHeader>
                <CardTitle as="h3">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <strong className="shell-preview__metric">{value}</strong>
              </CardContent>
            </Card>
          ))}
        </div>
      </ConsoleShell>
    </section>
  );
}

function ConsoleShellComparison() {
  return (
    <main className="shell-story">
      <header className="shell-story__intro">
        <span>Console UI · CUI-040–043</span>
        <h1>Shared shell and page grammar</h1>
        <p>
          The package owns dense presentation while routing, status mapping,
          refresh, data, and product actions remain consumer-owned.
        </p>
      </header>
      <div className="shell-story__grid">
        <ThemeShellPreview theme="light" />
        <ThemeShellPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Layout/Console shell",
  component: ConsoleShellComparison,
} satisfies Meta<typeof ConsoleShellComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;

export const Narrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
} satisfies Story;
