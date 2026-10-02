import * as stylex from "@stylexjs/stylex";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  forwardRef,
  type ReactNode,
  type Ref,
} from "react";

import { mergeClassNames } from "./shared.js";

export type ButtonSize = "lg" | "md" | "sm";
export type ButtonVariant = "danger" | "ghost" | "primary" | "secondary";

// Keep the current Console UI interaction contract exactly: native disabled
// buttons must not pick up hover or pressed visuals. StyleX statically evaluates
// same-file selector constants, so this remains component-owned rather than
// falling back to a separate stylesheet.
const HOVER_ENABLED = ":hover:not(:disabled)";
const ACTIVE_ENABLED = ":active:not(:disabled)";

const spin = stylex.keyframes({
  to: {
    transform: "rotate(360deg)",
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
    cursor: "pointer",
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
  disabled: {
    opacity: "var(--console-opacity-disabled)",
    cursor: "not-allowed",
    transform: "none",
  },
  pending: {
    cursor: "progress",
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

const sizeStyles = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

const variantStyles = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
} as const;

const expandedStyles = {
  primary: null,
  secondary: styles.secondaryExpanded,
  ghost: styles.ghostExpanded,
  danger: null,
} as const;

function isExpanded(value: unknown): boolean {
  return value === true || value === "true";
}

export type ActionLinkRenderProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  "data-stylex-spike-action-control": string;
  "data-stylex-spike-action-link": string;
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
    const sx = stylex.props(
      styles.control,
      sizeStyles[size],
      variantStyles[variant],
      isExpanded(ariaExpanded) && expandedStyles[variant],
    );

    const linkProps: ActionLinkRenderProps = {
      ...props,
      "aria-expanded": ariaExpanded,
      children: (
        <span
          {...stylex.props(styles.content)}
          data-stylex-spike-button-content=""
        >
          {children}
        </span>
      ),
      className: mergeClassNames(sx.className, className),
      "data-stylex-spike-action-control": "",
      "data-stylex-spike-action-link": "",
      "data-size": size,
      "data-variant": variant,
      ref,
      style: {
        ...(sx.style ?? {}),
        ...style,
      },
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
    const isDisabled = disabled || pending;
    const sx = stylex.props(
      styles.control,
      sizeStyles[size],
      variantStyles[variant],
      isExpanded(ariaExpanded) && expandedStyles[variant],
      isDisabled && styles.disabled,
      pending && styles.pending,
    );

    return (
      <button
        {...props}
        aria-busy={pending ? true : ariaBusy}
        aria-expanded={ariaExpanded}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-action-control=""
        data-stylex-spike-button=""
        data-pending={pending || undefined}
        data-size={size}
        data-variant={variant}
        disabled={isDisabled}
        ref={ref}
        style={{
          ...(sx.style ?? {}),
          ...style,
        }}
        type={type}
      >
        {pending ? (
          <span
            {...stylex.props(styles.spinner)}
            data-stylex-spike-button-spinner=""
            aria-hidden="true"
          />
        ) : null}
        <span
          {...stylex.props(styles.content)}
          data-stylex-spike-button-content=""
        >
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
      size = "md",
      variant = "secondary",
      ...props
    },
    ref,
  ) {
    return (
      <Button
        {...props}
        aria-label={pending && pendingLabel ? pendingLabel : label}
        data-stylex-spike-icon-button=""
        pending={pending}
        ref={ref}
        size={size}
        variant={variant}
      >
        {children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
