import * as stylex from "@stylexjs/stylex";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  forwardRef,
  type ReactNode,
  type Ref,
} from "react";

export type ButtonSize = "lg" | "md" | "sm";
export type ButtonVariant = "danger" | "ghost" | "primary" | "secondary";

const HOVER_ENABLED = ":hover:not(:disabled)";
const ACTIVE_ENABLED = ":active:not(:disabled)";

const spin = stylex.keyframes({
  to: {
    transform: "rotate(1turn)",
  },
});

const styles = stylex.create({
  control: {
    display: "inline-flex",
    minWidth: 0,
    flex: "0 0 auto",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--console-space-2)",
    appearance: "none",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "var(--console-radius-md)",
    fontFamily: "inherit",
    fontWeight: "var(--console-font-weight-medium)",
    lineHeight: "var(--console-line-height-tight)",
    textAlign: "center",
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
    },
    opacity: {
      default: 1,
      ":disabled": "var(--console-opacity-disabled)",
    },
    userSelect: "none",
    transitionProperty: "background-color, border-color, color, transform",
    transitionDuration: "var(--console-duration-fast)",
    transitionTimingFunction: "var(--console-easing-standard)",
    outlineWidth: {
      default: 0,
      ":focus-visible": 2,
    },
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: {
      default: 0,
      ":focus-visible": 2,
    },
    boxShadow: {
      default: "none",
      ":focus-visible":
        "0 0 0 2px var(--console-focus-offset), 0 0 0 4px var(--console-focus-ring)",
    },
    transform: {
      default: "none",
      [ACTIVE_ENABLED]: "translateY(1px)",
      ":disabled": "none",
    },
  },
  sizeSm: {
    height: "1.5rem",
    paddingInline: "var(--console-space-3)",
    fontSize: "var(--console-font-size-xs)",
  },
  sizeMd: {
    height: "var(--console-control-height)",
    paddingInline: "var(--console-space-4)",
    fontSize: "var(--console-font-size-sm)",
  },
  sizeLg: {
    height: "var(--console-row-min-height)",
    paddingInline: "var(--console-space-5)",
    fontSize: "var(--console-font-size-md)",
  },
  primary: {
    backgroundColor: {
      default: "var(--console-action-primary)",
      [HOVER_ENABLED]: "var(--console-action-primary-hover)",
      [ACTIVE_ENABLED]: "var(--console-action-primary-active)",
    },
    color: "var(--console-action-primary-foreground)",
  },
  secondary: {
    borderColor: "var(--console-border-default)",
    backgroundColor: {
      default: "var(--console-action-neutral)",
      [HOVER_ENABLED]: "var(--console-action-neutral-hover)",
      [ACTIVE_ENABLED]: "var(--console-action-neutral-active)",
    },
    color: "var(--console-action-neutral-foreground)",
  },
  secondaryExpanded: {
    backgroundColor: "var(--console-action-neutral-active)",
  },
  ghost: {
    backgroundColor: {
      default: "transparent",
      [HOVER_ENABLED]: "var(--console-surface-muted)",
      [ACTIVE_ENABLED]: "var(--console-surface-emphasis)",
    },
    color: {
      default: "var(--console-text-secondary)",
      [HOVER_ENABLED]: "var(--console-text-primary)",
      [ACTIVE_ENABLED]: "var(--console-text-primary)",
    },
  },
  ghostExpanded: {
    backgroundColor: "var(--console-surface-emphasis)",
    color: "var(--console-text-primary)",
  },
  danger: {
    backgroundColor: {
      default: "var(--console-action-danger)",
      [HOVER_ENABLED]: "var(--console-action-danger-hover)",
      [ACTIVE_ENABLED]: "var(--console-action-danger-active)",
    },
    color: "var(--console-action-danger-foreground)",
  },
  content: {
    display: "inline-flex",
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--console-space-2)",
  },
  spinner: {
    width: "1em",
    height: "1em",
    flex: "0 0 auto",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: "currentColor",
    borderRightColor: "transparent",
    borderRadius: "var(--console-radius-full)",
    animationName: spin,
    animationDuration: "700ms",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
});

// Button has more runtime variants than Badge, so this pilot deliberately
// precompiles every size / intent / expanded-state combination. Runtime code
// only selects an already-compiled props object. This keeps stylex.props() off
// the render path and lets the generalized package build enforce zero StyleX
// runtime bytes across multiple production entries.
const actionStyleProps = {
  sm: {
    primary: {
      collapsed: stylex.props(styles.control, styles.sizeSm, styles.primary),
      expanded: stylex.props(styles.control, styles.sizeSm, styles.primary),
    },
    secondary: {
      collapsed: stylex.props(styles.control, styles.sizeSm, styles.secondary),
      expanded: stylex.props(
        styles.control,
        styles.sizeSm,
        styles.secondary,
        styles.secondaryExpanded,
      ),
    },
    ghost: {
      collapsed: stylex.props(styles.control, styles.sizeSm, styles.ghost),
      expanded: stylex.props(
        styles.control,
        styles.sizeSm,
        styles.ghost,
        styles.ghostExpanded,
      ),
    },
    danger: {
      collapsed: stylex.props(styles.control, styles.sizeSm, styles.danger),
      expanded: stylex.props(styles.control, styles.sizeSm, styles.danger),
    },
  },
  md: {
    primary: {
      collapsed: stylex.props(styles.control, styles.sizeMd, styles.primary),
      expanded: stylex.props(styles.control, styles.sizeMd, styles.primary),
    },
    secondary: {
      collapsed: stylex.props(styles.control, styles.sizeMd, styles.secondary),
      expanded: stylex.props(
        styles.control,
        styles.sizeMd,
        styles.secondary,
        styles.secondaryExpanded,
      ),
    },
    ghost: {
      collapsed: stylex.props(styles.control, styles.sizeMd, styles.ghost),
      expanded: stylex.props(
        styles.control,
        styles.sizeMd,
        styles.ghost,
        styles.ghostExpanded,
      ),
    },
    danger: {
      collapsed: stylex.props(styles.control, styles.sizeMd, styles.danger),
      expanded: stylex.props(styles.control, styles.sizeMd, styles.danger),
    },
  },
  lg: {
    primary: {
      collapsed: stylex.props(styles.control, styles.sizeLg, styles.primary),
      expanded: stylex.props(styles.control, styles.sizeLg, styles.primary),
    },
    secondary: {
      collapsed: stylex.props(styles.control, styles.sizeLg, styles.secondary),
      expanded: stylex.props(
        styles.control,
        styles.sizeLg,
        styles.secondary,
        styles.secondaryExpanded,
      ),
    },
    ghost: {
      collapsed: stylex.props(styles.control, styles.sizeLg, styles.ghost),
      expanded: stylex.props(
        styles.control,
        styles.sizeLg,
        styles.ghost,
        styles.ghostExpanded,
      ),
    },
    danger: {
      collapsed: stylex.props(styles.control, styles.sizeLg, styles.danger),
      expanded: stylex.props(styles.control, styles.sizeLg, styles.danger),
    },
  },
} as const;

const contentStyleProps = stylex.props(styles.content);
const spinnerStyleProps = stylex.props(styles.spinner);

function isExpanded(value: unknown): boolean {
  return value === true || value === "true";
}

function resolveActionStyleProps(
  size: ButtonSize,
  variant: ButtonVariant,
  ariaExpanded: unknown,
) {
  return actionStyleProps[size][variant][
    isExpanded(ariaExpanded) ? "expanded" : "collapsed"
  ];
}

function mergeClassName(
  generated: string | undefined,
  consumer: string | undefined,
): string | undefined {
  return [generated, consumer].filter(Boolean).join(" ") || undefined;
}

function mergeInlineStyle(
  generated: object | undefined,
  consumer: CSSProperties | undefined,
): CSSProperties | undefined {
  if (generated === undefined) {
    return consumer;
  }

  return { ...(generated as CSSProperties), ...consumer };
}

export type ActionLinkRenderProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  "data-console-action-control": string;
  "data-console-action-link": string;
  "data-size": ButtonSize;
  "data-variant": ButtonVariant;
  ref?: Ref<HTMLAnchorElement>;
};

export type ActionLinkRenderer = (props: ActionLinkRenderProps) => ReactNode;

export interface ActionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  children: ReactNode;
  renderLink?: ActionLinkRenderer;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const ActionLink = forwardRef<HTMLAnchorElement, ActionLinkProps>(
  function ActionLink(
    {
      "aria-expanded": ariaExpanded,
      children,
      className,
      renderLink,
      size = "md",
      style,
      variant = "secondary",
      ...props
    },
    ref,
  ) {
    const rootStyleProps = resolveActionStyleProps(size, variant, ariaExpanded);
    const linkProps: ActionLinkRenderProps = {
      ...props,
      "aria-expanded": ariaExpanded,
      children: (
        <span {...contentStyleProps} data-console-button-content="">
          {children}
        </span>
      ),
      className: mergeClassName(rootStyleProps.className, className),
      "data-console-action-control": "",
      "data-console-action-link": "",
      "data-size": size,
      "data-variant": variant,
      ref,
      style: mergeInlineStyle(rootStyleProps.style, style),
    };

    return renderLink ? renderLink(linkProps) : <a {...linkProps} />;
  },
);

ActionLink.displayName = "ActionLink";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  pending?: boolean;
  pendingLabel?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      "aria-busy": ariaBusy,
      "aria-expanded": ariaExpanded,
      children,
      className,
      disabled = false,
      pending = false,
      pendingLabel,
      size = "md",
      style,
      type = "button",
      variant = "primary",
      ...props
    },
    ref,
  ) {
    const content =
      pending && pendingLabel !== undefined ? pendingLabel : children;
    const rootStyleProps = resolveActionStyleProps(size, variant, ariaExpanded);

    return (
      <button
        {...props}
        aria-busy={pending ? true : ariaBusy}
        aria-expanded={ariaExpanded}
        className={mergeClassName(rootStyleProps.className, className)}
        data-console-action-control=""
        data-console-button=""
        data-pending={pending || undefined}
        data-size={size}
        data-variant={variant}
        disabled={disabled || pending}
        ref={ref}
        style={mergeInlineStyle(rootStyleProps.style, style)}
        type={type}
      >
        {pending ? (
          <span
            {...spinnerStyleProps}
            data-console-button-spinner=""
            aria-hidden="true"
          />
        ) : null}
        <span {...contentStyleProps} data-console-button-content="">
          {content}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export interface IconButtonProps
  extends Omit<ButtonProps, "aria-label" | "children" | "pendingLabel"> {
  children: ReactNode;
  label: string;
  pendingLabel?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      children,
      label,
      pending = false,
      pendingLabel,
      variant = "secondary",
      ...props
    },
    ref,
  ) {
    return (
      <Button
        {...props}
        aria-label={pending && pendingLabel ? pendingLabel : label}
        data-console-icon-button=""
        pending={pending}
        ref={ref}
        variant={variant}
      >
        {children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
