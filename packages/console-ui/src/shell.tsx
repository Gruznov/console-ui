"use client";

import {
  type AnchorHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useId,
  useState,
} from "react";

export type ConsoleEnvironment =
  | "development"
  | "local"
  | "production"
  | "staging";
export type ConsoleServiceTone = "neutral" | "teal" | "violet";

export type ConsoleServiceDescriptor = {
  description?: ReactNode;
  environment: ConsoleEnvironment;
  environmentLabel?: string;
  id: string;
  mark: ReactNode;
  name: ReactNode;
  tone: ConsoleServiceTone;
};

const environmentLabels: Record<ConsoleEnvironment, string> = {
  development: "Development",
  local: "Local",
  production: "Production",
  staging: "Staging",
};

export interface ConsoleIdentityProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  service: ConsoleServiceDescriptor;
}

export const ConsoleIdentity = forwardRef<HTMLDivElement, ConsoleIdentityProps>(
  function ConsoleIdentity({ className, service, ...props }, ref) {
    const environmentLabel =
      service.environmentLabel ?? environmentLabels[service.environment];

    return (
      <div
        {...props}
        className={className}
        data-console-environment={service.environment}
        data-console-identity=""
        data-console-service={service.id}
        data-console-service-tone={service.tone}
        ref={ref}
      >
        <span
          aria-hidden="true"
          data-console-identity-mark=""
          {...(typeof service.name === "string" ? { title: service.name } : {})}
        >
          {service.mark}
        </span>
        <span data-console-identity-copy="">
          <strong data-console-identity-name="">{service.name}</strong>
          {service.description ? (
            <span data-console-identity-description="">
              {service.description}
            </span>
          ) : null}
        </span>
        <span
          data-console-environment={service.environment}
          data-console-environment-label=""
          title={`Environment: ${environmentLabel}`}
        >
          <span aria-hidden="true" data-console-environment-indicator="" />
          <span data-console-visually-hidden="">Environment: </span>
          <span data-console-environment-name="">{environmentLabel}</span>
        </span>
      </div>
    );
  },
);

ConsoleIdentity.displayName = "ConsoleIdentity";

export type ConsoleNavigationItem = {
  current?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  href: string;
  icon?: ReactNode;
  id: string;
  indicator?: boolean;
  label: ReactNode;
  level?: 1 | 2;
};

export type ConsoleNavigationGroup = {
  id: string;
  items: ConsoleNavigationItem[];
  label: ReactNode;
};

export type ConsoleNavigationLinkProps =
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    "data-console-navigation-link": string;
    "data-current"?: boolean;
    "data-disabled"?: boolean;
    "data-level": 1 | 2;
  };
export type ConsoleNavigationLinkRenderer = (
  item: ConsoleNavigationItem,
  props: ConsoleNavigationLinkProps,
) => ReactNode;

export interface ConsoleNavigationProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  collapsed?: boolean;
  groups: ConsoleNavigationGroup[];
  renderLink?: ConsoleNavigationLinkRenderer;
}

export const ConsoleNavigation = forwardRef<
  HTMLElement,
  ConsoleNavigationProps
>(function ConsoleNavigation(
  {
    "aria-label": ariaLabel = "Console navigation",
    className,
    collapsed = false,
    groups,
    renderLink,
    ...props
  },
  ref,
) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={className}
      data-collapsed={collapsed || undefined}
      data-console-navigation=""
      ref={ref}
    >
      {groups.map((group) => (
        <section data-console-navigation-group="" key={group.id}>
          <h2 data-console-navigation-group-label="">{group.label}</h2>
          <ul data-console-navigation-list="">
            {group.items.map((item) => {
              const linkProps: ConsoleNavigationLinkProps = {
                ...(item.current
                  ? { "aria-current": "page", "data-current": true }
                  : {}),
                ...(item.disabled
                  ? {
                      "aria-disabled": true,
                      "data-disabled": true,
                      tabIndex: -1,
                    }
                  : { href: item.href }),
                children: (
                  <>
                    {item.icon ? (
                      <span aria-hidden="true" data-console-navigation-icon="">
                        {item.icon}
                      </span>
                    ) : item.indicator ? (
                      <span
                        aria-hidden="true"
                        data-console-navigation-indicator=""
                      />
                    ) : null}
                    <span data-console-navigation-copy="">
                      <span data-console-navigation-label="">{item.label}</span>
                      {item.description ? (
                        <span data-console-navigation-description="">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </>
                ),
                "data-console-navigation-link": "",
                "data-level": item.level ?? 1,
                ...(collapsed && typeof item.label === "string"
                  ? { title: item.label }
                  : {}),
              };

              return (
                <li data-console-navigation-item="" key={item.id}>
                  {renderLink ? (
                    renderLink(item, linkProps)
                  ) : (
                    <a {...linkProps} />
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
});

ConsoleNavigation.displayName = "ConsoleNavigation";

export interface ConsoleShellProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: ConsoleShellElement;
  children: ReactNode;
  contentWidth?: ConsoleShellContentWidth;
  density?: ConsoleShellDensity;
  defaultNavigationCollapsed?: boolean;
  navigation: ConsoleNavigationGroup[];
  navigationCollapseLabel?: string;
  navigationCollapsible?: boolean;
  navigationExpandLabel?: string;
  navigationLabel?: string;
  navigationToggleLabel?: ReactNode;
  renderNavigationLink?: ConsoleNavigationLinkRenderer;
  service: ConsoleServiceDescriptor;
  sidebarFooter?: ReactNode;
  topbar?: ReactNode;
}

export type ConsoleShellContentWidth = "contained" | "fluid";
export type ConsoleShellDensity = "comfortable" | "compact";
export type ConsoleShellElement = "div" | "main";

export const ConsoleShell = forwardRef<HTMLElement, ConsoleShellProps>(
  function ConsoleShell(
    {
      as = "main",
      children,
      className,
      contentWidth = "contained",
      density = "comfortable",
      defaultNavigationCollapsed = false,
      navigation,
      navigationCollapseLabel = "Collapse navigation",
      navigationCollapsible = false,
      navigationExpandLabel = "Expand navigation",
      navigationLabel,
      navigationToggleLabel = "Navigation",
      renderNavigationLink,
      service,
      sidebarFooter,
      topbar,
      ...props
    },
    ref,
  ) {
    const Component = as;
    const navigationId = useId();
    const [navigationOpen, setNavigationOpen] = useState(false);
    const [navigationCollapsed, setNavigationCollapsed] = useState(
      defaultNavigationCollapsed,
    );
    const isNavigationCollapsed = navigationCollapsible && navigationCollapsed;
    const currentNavigationItem = navigation
      .flatMap((group) => group.items)
      .find((item) => item.current);

    return (
      <Component
        {...props}
        className={className}
        data-content-width={contentWidth}
        data-console-environment={service.environment}
        data-console-service={service.id}
        data-console-service-tone={service.tone}
        data-console-shell=""
        data-density={density}
        data-navigation-collapsed={isNavigationCollapsed || undefined}
        ref={ref as Ref<HTMLDivElement & HTMLElement>}
      >
        <aside data-console-shell-sidebar="">
          <ConsoleIdentity service={service} />
          {navigationCollapsible ? (
            <button
              aria-controls={navigationId}
              aria-expanded={!isNavigationCollapsed}
              aria-label={
                isNavigationCollapsed
                  ? navigationExpandLabel
                  : navigationCollapseLabel
              }
              data-console-shell-collapse-toggle=""
              onClick={() => setNavigationCollapsed((collapsed) => !collapsed)}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20">
                <path d="m12 5-5 5 5 5" />
              </svg>
            </button>
          ) : null}
          <button
            aria-controls={navigationId}
            aria-expanded={navigationOpen}
            data-console-shell-navigation-toggle=""
            onClick={() => setNavigationOpen((open) => !open)}
            type="button"
          >
            <span data-console-shell-navigation-toggle-label="">
              {navigationToggleLabel}
            </span>
            {currentNavigationItem ? (
              <span data-console-shell-navigation-toggle-current="">
                <span data-console-visually-hidden="">Current: </span>
                {currentNavigationItem.label}
              </span>
            ) : null}
            <span
              aria-hidden="true"
              data-console-shell-navigation-toggle-chevron=""
            />
          </button>
          <div
            {...(navigationOpen ? { "data-open": true } : {})}
            data-console-shell-navigation-panel=""
          >
            <ConsoleNavigation
              {...(navigationLabel ? { "aria-label": navigationLabel } : {})}
              collapsed={isNavigationCollapsed}
              groups={navigation}
              id={navigationId}
              onClick={() => setNavigationOpen(false)}
              {...(renderNavigationLink
                ? { renderLink: renderNavigationLink }
                : {})}
            />
            {sidebarFooter ? (
              <div data-console-shell-sidebar-footer="">{sidebarFooter}</div>
            ) : null}
          </div>
        </aside>
        <section data-console-shell-workspace="">
          {topbar ? (
            <header data-console-shell-topbar="">{topbar}</header>
          ) : null}
          <div data-console-shell-content="">{children}</div>
        </section>
      </Component>
    );
  },
);

ConsoleShell.displayName = "ConsoleShell";
