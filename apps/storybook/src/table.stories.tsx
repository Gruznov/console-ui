import {
  Badge,
  DataTableFrame,
  IconButton,
  Separator,
  StatusBadge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@polyconsole/console-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./table.css";

type Theme = "dark" | "light";

const resources = [
  {
    resource: "docs.example.org",
    detail: "Documentation collection",
    state: "healthy",
    tone: "success" as const,
    label: "Healthy",
    processed: "4,821",
    errors: "0",
    freshness: "12 sec",
  },
  {
    resource: "archive.example.net",
    detail: "Primary capture queue",
    state: "delayed",
    tone: "warning" as const,
    label: "Delayed",
    processed: "2,108",
    errors: "3",
    freshness: "8 min",
  },
  {
    resource: "wiki.example.com",
    detail: "Knowledge projection",
    state: "indexing",
    tone: "info" as const,
    label: "Indexing",
    processed: "271",
    errors: "0",
    freshness: "34 sec",
  },
];

function OpenIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function ThemeTablePreview({ theme }: { theme: Theme }) {
  return (
    <section
      aria-labelledby={`${theme}-table-preview-title`}
      className="table-preview"
      data-console-theme={theme}
    >
      <header className="table-preview__header">
        <div>
          <span>Operational density / {theme}</span>
          <h2 id={`${theme}-table-preview-title`}>
            {theme === "light" ? "Light console" : "Dark console"}
          </h2>
          <p>Native semantics, compact rows, and consumer-owned overflow.</p>
        </div>
        <Badge>{theme}</Badge>
      </header>

      <div className="table-preview__body">
        <DataTableFrame
          label={`${theme} archive worker snapshot`}
          minWidth="34rem"
          stickyHeader
        >
          <Table>
            <TableCaption>
              Archive worker snapshot · updated 12 seconds ago
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Resource</TableHead>
                <TableHead scope="col">State</TableHead>
                <TableHead className="table-preview__numeric" scope="col">
                  Processed
                </TableHead>
                <TableHead className="table-preview__numeric" scope="col">
                  Errors
                </TableHead>
                <TableHead scope="col">Freshness</TableHead>
                <TableHead aria-label="Open resource" scope="col" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow
                  data-state={
                    resource.state === "delayed" ? "selected" : undefined
                  }
                  key={resource.resource}
                >
                  <TableCell className="table-preview__resource">
                    <strong>{resource.resource}</strong>
                    <span>{resource.detail}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={resource.tone}>
                      {resource.label}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="table-preview__numeric">
                    {resource.processed}
                  </TableCell>
                  <TableCell className="table-preview__numeric">
                    {resource.errors}
                  </TableCell>
                  <TableCell>{resource.freshness}</TableCell>
                  <TableCell className="table-preview__action">
                    <IconButton
                      label={`Open ${resource.resource}`}
                      size="sm"
                      variant="ghost"
                    >
                      <OpenIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Visible total</TableCell>
                <TableCell className="table-preview__numeric">7,200</TableCell>
                <TableCell className="table-preview__numeric">3</TableCell>
                <TableCell colSpan={2}>3 resources</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </DataTableFrame>

        <div className="table-preview__contract">
          <div>
            <strong>Table</strong>
            <span>rows, headers, cells</span>
          </div>
          <Separator decorative orientation="vertical" />
          <div>
            <strong>DataTableFrame</strong>
            <span>shared overflow · consumer min-width: 34rem</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TableComparison() {
  return (
    <main className="table-story">
      <header className="table-story__intro">
        <span>Console UI · CUI-034</span>
        <h1>Table family</h1>
        <p>
          Dense native table elements for operational data. Width, scrolling,
          sorting, and product state interpretation stay outside the primitive.
        </p>
      </header>
      <div className="table-story__grid">
        <ThemeTablePreview theme="light" />
        <ThemeTablePreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Primitives/Table",
  component: TableComparison,
} satisfies Meta<typeof TableComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
