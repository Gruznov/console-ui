import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

export type ConsolePageHeaderElement = "div" | "header";
export type ConsolePageHeadingElement = "h1" | "h2" | "h3";

export interface ConsolePageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  actions?: ReactNode;
  as?: ConsolePageHeaderElement;
  description?: ReactNode;
  headingAs?: ConsolePageHeadingElement;
  icon?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
}

export const ConsolePageHeader = forwardRef<
  HTMLElement,
  ConsolePageHeaderProps
>(function ConsolePageHeader(
  {
    actions,
    as = "header",
    className,
    description,
    headingAs = "h2",
    icon,
    status,
    title,
    ...props
  },
  ref,
) {
  const Component = as;
  const Heading = headingAs;

  return (
    <Component
      {...props}
      className={className}
      data-console-page-header=""
      ref={ref as Ref<HTMLDivElement & HTMLElement>}
    >
      {icon ? (
        <span aria-hidden="true" data-console-page-header-icon="">
          {icon}
        </span>
      ) : null}
      <div data-console-page-header-copy="">
        <div data-console-page-header-title-row="">
          <Heading data-console-page-header-title="">{title}</Heading>
          {status ? (
            <div data-console-page-header-status="">{status}</div>
          ) : null}
        </div>
        {description ? (
          <p data-console-page-header-description="">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div data-console-page-header-actions="">{actions}</div>
      ) : null}
    </Component>
  );
});

ConsolePageHeader.displayName = "ConsolePageHeader";
