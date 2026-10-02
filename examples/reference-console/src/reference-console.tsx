import { useMemo, useState } from "react";

type Density = "compact" | "balanced";
type StatusFilter = "all" | "attention" | "healthy";
type Tone = "success" | "warning" | "danger" | "neutral";

type Worker = {
  errorRate: string;
  id: string;
  lag: string;
  name: string;
  processed: string;
  queue: string;
  region: string;
  role: string;
  status: string;
  tone: Tone;
  updated: string;
};

const workers: Worker[] = [
  {
    id: "intake-01",
    name: "Intake worker",
    role: "Receives scheduled source jobs",
    status: "Healthy",
    tone: "success",
    queue: "12",
    lag: "4 s",
    processed: "18.4k/h",
    errorRate: "0.02%",
    updated: "8 s ago",
    region: "eu-north",
  },
  {
    id: "dispatch-02",
    name: "Crawl dispatcher",
    role: "Assigns jobs to available workers",
    status: "Delayed",
    tone: "warning",
    queue: "148",
    lag: "2 m 18 s",
    processed: "6.2k/h",
    errorRate: "0.11%",
    updated: "19 s ago",
    region: "eu-north",
  },
  {
    id: "extract-04",
    name: "Content extractor",
    role: "Normalizes fetched documents",
    status: "Healthy",
    tone: "success",
    queue: "36",
    lag: "18 s",
    processed: "14.1k/h",
    errorRate: "0.04%",
    updated: "6 s ago",
    region: "eu-central",
  },
  {
    id: "media-03",
    name: "Media extractor",
    role: "Collects document media metadata",
    status: "Idle",
    tone: "neutral",
    queue: "0",
    lag: "—",
    processed: "1.8k/h",
    errorRate: "0.00%",
    updated: "42 s ago",
    region: "eu-central",
  },
  {
    id: "index-07",
    name: "Index builder",
    role: "Publishes searchable projections",
    status: "Healthy",
    tone: "success",
    queue: "9",
    lag: "7 s",
    processed: "21.7k/h",
    errorRate: "0.01%",
    updated: "5 s ago",
    region: "eu-north",
  },
  {
    id: "relay-02",
    name: "Webhook relay",
    role: "Delivers completion notifications",
    status: "Attention",
    tone: "danger",
    queue: "27",
    lag: "6 m 04 s",
    processed: "3.4k/h",
    errorRate: "2.80%",
    updated: "11 s ago",
    region: "eu-west",
  },
];

const navigation = ["Overview", "Pipelines", "Jobs", "Sources", "Activity"];

function Status({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className="status" data-tone={tone}>
      <span className="status__dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export function ReferenceConsole() {
  const [density, setDensity] = useState<Density>("compact");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState(workers[1]?.id ?? "");
  const selectedWorker = useMemo(
    () => workers.find(({ id }) => id === selectedId) ?? workers[0],
    [selectedId],
  );
  const visibleWorkers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return workers.filter((worker) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${worker.name} ${worker.role} ${worker.region}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "healthy" && worker.tone === "success") ||
        (statusFilter === "attention" &&
          (worker.tone === "warning" || worker.tone === "danger"));

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  if (!selectedWorker) {
    return null;
  }

  return (
    <div className="reference-console" data-density={density}>
      <a className="skip-link" href="#main-content">
        Skip to operations
      </a>

      <aside className="sidebar">
        <div className="service-mark">
          <span className="service-mark__symbol" aria-hidden="true">
            C
          </span>
          <span>
            <strong>Console UI</strong>
            <small>Reference service</small>
          </span>
        </div>

        <nav aria-label="Reference navigation">
          <ul>
            {navigation.map((item, index) => (
              <li key={item}>
                {index === 0 ? (
                  <a href="#main-content" aria-current="page">
                    <span className="nav-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="nav-label">{item}</span>
                  </a>
                ) : (
                  <span className="nav-placeholder" aria-disabled="true">
                    <span className="nav-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="nav-label">{item}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__context">
          <span className="environment">Lab environment</span>
          <small>Package boundary fixture</small>
        </div>
      </aside>

      <main id="main-content" className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Operations</span>
            <h1>Pipeline overview</h1>
          </div>
          <div className="topbar__actions">
            <fieldset className="density-control">
              <legend>Density</legend>
              {(["compact", "balanced"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={density === option}
                  onClick={() => setDensity(option)}
                >
                  {option}
                </button>
              ))}
            </fieldset>
            <button className="button button--secondary" type="button">
              Run checks
            </button>
            <button className="button button--primary" type="button">
              Add source
            </button>
          </div>
        </header>

        <p className="prototype-note">
          Local fixture · package imports are real · component APIs are not
          stable
        </p>

        <section className="summary" aria-label="Operational summary">
          <div>
            <span>Workers online</span>
            <strong>18 / 20</strong>
            <small>1 idle, 1 attention</small>
          </div>
          <div>
            <span>Queued jobs</span>
            <strong>232</strong>
            <small>+31 in 15 minutes</small>
          </div>
          <div>
            <span>Processed</span>
            <strong>65.6k/h</strong>
            <small>96.8% within target</small>
          </div>
          <div>
            <span>Source freshness</span>
            <strong>94%</strong>
            <small>Updated 12 seconds ago</small>
          </div>
        </section>

        <section className="filterbar" aria-label="Worker filters">
          <label className="search-field">
            <span className="visually-hidden">Search workers</span>
            <input
              type="search"
              placeholder="Search workers"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </label>
          <label>
            <span className="visually-hidden">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.currentTarget.value as StatusFilter)
              }
            >
              <option value="all">All statuses</option>
              <option value="attention">Needs attention</option>
              <option value="healthy">Healthy</option>
            </select>
          </label>
          <span className="filterbar__result">
            {visibleWorkers.length} of {workers.length} workers
          </span>
        </section>

        <div className="content-grid">
          <section
            className="panel panel--table"
            aria-labelledby="workers-title"
          >
            <div className="panel__header">
              <div>
                <h2 id="workers-title">Worker health</h2>
                <p>Live operational state by process.</p>
              </div>
              <span className="freshness">
                <span aria-hidden="true" />
                Live
              </span>
            </div>

            <div className="table-scroll">
              <table>
                <caption className="visually-hidden">
                  Worker health and throughput
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Worker</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="numeric">
                      Queue
                    </th>
                    <th scope="col" className="numeric">
                      Lag
                    </th>
                    <th scope="col" className="numeric">
                      Throughput
                    </th>
                    <th scope="col" className="numeric">
                      Errors
                    </th>
                    <th scope="col">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleWorkers.map((worker) => (
                    <tr
                      key={worker.id}
                      aria-selected={worker.id === selectedWorker.id}
                    >
                      <th scope="row">
                        <button
                          className="worker-link"
                          type="button"
                          onClick={() => setSelectedId(worker.id)}
                        >
                          <strong>{worker.name}</strong>
                          <small>{worker.role}</small>
                        </button>
                      </th>
                      <td>
                        <Status label={worker.status} tone={worker.tone} />
                      </td>
                      <td className="numeric">{worker.queue}</td>
                      <td className="numeric">{worker.lag}</td>
                      <td className="numeric">{worker.processed}</td>
                      <td className="numeric">{worker.errorRate}</td>
                      <td>{worker.updated}</td>
                    </tr>
                  ))}
                  {visibleWorkers.length === 0 ? (
                    <tr>
                      <td className="table-empty" colSpan={7}>
                        No workers match the current filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="panel detail" aria-labelledby="detail-title">
            <div className="panel__header">
              <div>
                <span className="eyebrow">Selected worker</span>
                <h2 id="detail-title">{selectedWorker.name}</h2>
              </div>
              <Status
                label={selectedWorker.status}
                tone={selectedWorker.tone}
              />
            </div>

            <dl className="property-list">
              <div>
                <dt>Identifier</dt>
                <dd>{selectedWorker.id}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>{selectedWorker.region}</dd>
              </div>
              <div>
                <dt>Queue depth</dt>
                <dd>{selectedWorker.queue}</dd>
              </div>
              <div>
                <dt>Current lag</dt>
                <dd>{selectedWorker.lag}</dd>
              </div>
              <div>
                <dt>Error rate</dt>
                <dd>{selectedWorker.errorRate}</dd>
              </div>
              <div>
                <dt>Last update</dt>
                <dd>{selectedWorker.updated}</dd>
              </div>
            </dl>

            <div className="detail__notice" data-tone={selectedWorker.tone}>
              <strong>
                {selectedWorker.tone === "danger"
                  ? "Operator review required"
                  : "No immediate action required"}
              </strong>
              <p>
                The reference fixture keeps status interpretation local to the
                consumer.
              </p>
            </div>

            <div className="detail__actions">
              <button className="button button--secondary" type="button">
                View activity
              </button>
              <button className="button button--secondary" type="button">
                Open logs
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
