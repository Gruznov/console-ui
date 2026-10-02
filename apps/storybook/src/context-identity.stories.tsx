import type { Meta, StoryObj } from "@storybook/react-vite";

import "./context-identity.css";

type EnvironmentId = "development" | "local" | "production" | "staging";
type ServiceId = "atlas" | "beacon" | "compass";
type ServiceTone = "neutral" | "teal" | "violet";
type Theme = "dark" | "light";

const environments: Array<{
  id: EnvironmentId;
  label: string;
}> = [
  { id: "production", label: "Production" },
  { id: "staging", label: "Staging" },
  { id: "development", label: "Development" },
  { id: "local", label: "Local" },
];

const services: Array<{
  description: string;
  environment: EnvironmentId;
  id: ServiceId;
  mark: string;
  name: string;
  tone: ServiceTone;
}> = [
  {
    id: "atlas",
    name: "Atlas",
    mark: "A",
    tone: "neutral",
    description: "Read-only operations",
    environment: "production",
  },
  {
    id: "beacon",
    name: "Beacon",
    mark: "B",
    tone: "violet",
    description: "Content operations",
    environment: "staging",
  },
  {
    id: "compass",
    name: "Compass",
    mark: "C",
    tone: "teal",
    description: "Development console",
    environment: "development",
  },
];

function EnvironmentBadge({
  environment,
  filled = false,
}: {
  environment: EnvironmentId;
  filled?: boolean;
}) {
  const label = environments.find((item) => item.id === environment)?.label;

  return (
    <span
      className="context-identity__environment"
      data-console-environment={environment}
      data-filled={filled || undefined}
    >
      <span aria-hidden="true" />
      {label}
    </span>
  );
}

function ServiceIdentity({ service }: { service: (typeof services)[number] }) {
  return (
    <article
      className="context-identity"
      data-console-service={service.id}
      data-console-service-tone={service.tone}
      data-console-environment={service.environment}
    >
      <header className="context-identity__header">
        <span className="context-identity__mark" aria-hidden="true">
          {service.mark}
        </span>
        <div className="context-identity__name">
          <strong>{service.name}</strong>
          <span>{service.description}</span>
        </div>
        <EnvironmentBadge environment={service.environment} filled />
      </header>

      <dl className="context-identity__facts">
        <div>
          <dt>Service</dt>
          <dd>{service.id}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>
            {
              environments.find(
                (environment) => environment.id === service.environment,
              )?.label
            }
          </dd>
        </div>
        <div>
          <dt>Context rule</dt>
          <dd>Always visible</dd>
        </div>
      </dl>
    </article>
  );
}

function ThemeIdentityPreview({ theme }: { theme: Theme }) {
  return (
    <section
      className="context-preview"
      data-console-theme={theme}
      aria-labelledby={`${theme}-context-title`}
    >
      <header className="context-preview__header">
        <div>
          <span>Context identity / {theme}</span>
          <h2 id={`${theme}-context-title`}>
            {theme === "light" ? "Light console" : "Dark console"}
          </h2>
          <p>
            Service and environment remain visible without implying a switcher.
          </p>
        </div>
        <span className="context-preview__theme">{theme}</span>
      </header>

      <div className="context-preview__services">
        {services.map((service) => (
          <ServiceIdentity key={service.id} service={service} />
        ))}
      </div>

      <section
        className="context-preview__vocabulary"
        aria-labelledby={`${theme}-environment-vocabulary`}
      >
        <div>
          <h3 id={`${theme}-environment-vocabulary`}>Environment vocabulary</h3>
          <p>Text is mandatory; color is a secondary position cue.</p>
        </div>
        <div className="context-preview__environments">
          {environments.map((environment) => (
            <EnvironmentBadge
              environment={environment.id}
              key={environment.id}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

function ContextIdentityComparison() {
  return (
    <main className="context-story">
      <header className="context-story__intro">
        <span>Console UI · CUI-023</span>
        <h1>Service and environment identity</h1>
        <p>
          Three related consoles keep one visual grammar while preserving the
          context needed to avoid wrong-service and wrong-environment actions.
        </p>
      </header>

      <div className="context-story__grid">
        <ThemeIdentityPreview theme="light" />
        <ThemeIdentityPreview theme="dark" />
      </div>
    </main>
  );
}

const meta = {
  title: "Foundation/Service and environment",
  component: ContextIdentityComparison,
} satisfies Meta<typeof ContextIdentityComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightAndDark = {} satisfies Story;
