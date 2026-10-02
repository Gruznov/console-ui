import * as stylex from "@stylexjs/stylex";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { mergeClassNames } from "./shared.js";

export type StatusTone =
  | "danger"
  | "info"
  | "neutral"
  | "success"
  | "warning";

const styles = stylex.create({
  badge: {
    display: "inline-flex",
    minWidth: 0,
    maxWidth: "100%",
    minHeight: "1.375rem",
    flex: "0 0 auto",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: "var(--console-space-2)",
    overflow: "hidden",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--console-border-default)",
    borderRadius: "var(--console-radius-full)",
    backgroundColor: "var(--console-surface-muted)",
    color: "var(--console-text-secondary)",
    fontFamily: "inherit",
    fontSize: "var(--console-font-size-xs)",
    fontWeight: "var(--console-font-weight-medium)",
    lineHeight: "var(--console-line-height-tight)",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  content: {
    display: "inline-flex",
    minWidth: 0,
    alignItems: "center",
    gap: "var(--console-space-1)",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  status: {
    borderColor: "var(--console-status-neutral-border)",
    backgroundColor: "var(--console-status-neutral-surface)",
    color: "var(--console-status-neutral-text)",
    fontWeight: "var(--console-font-weight-semibold)",
  },
  info: {
    borderColor: "var(--console-status-info-border)",
    backgroundColor: "var(--console-status-info-surface)",
    color: "var(--console-status-info-text)",
  },
  success: {
    borderColor: "var(--console-status-success-border)",
    backgroundColor: "var(--console-status-success-surface)",
    color: "var(--console-status-success-text)",
  },
  warning: {
    borderColor: "var(--console-status-warning-border)",
    backgroundColor: "var(--console-status-warning-surface)",
    color: "var(--console-status-warning-text)",
  },
  danger: {
    borderColor: "var(--console-status-danger-border)",
    backgroundColor: "var(--console-status-danger-surface)",
    color: "var(--console-status-danger-text)",
  },
  indicator: {
    width: "0.375rem",
    height: "0.375rem",
    flex: "0 0 auto",
    borderRadius: "var(--console-radius-full)",
    backgroundColor: "currentColor",
  },
});

const toneStyles = {
  neutral: null,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
} as const;

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, className, style, ...props },
  ref,
) {
  const root = stylex.props(styles.badge);
  const content = stylex.props(styles.content);

  return (
    <span
      {...props}
      className={mergeClassNames(root.className, className)}
      data-stylex-spike-badge=""
      ref={ref}
      style={{ ...(root.style ?? {}), ...style }}
    >
      <span {...content} data-stylex-spike-badge-content="">
        {children}
      </span>
    </span>
  );
});

Badge.displayName = "Badge";

export interface StatusBadgeProps extends BadgeProps {
  indicator?: boolean;
  tone?: StatusTone;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge(
    {
      children,
      className,
      indicator = true,
      style,
      tone = "neutral",
      ...props
    },
    ref,
  ) {
    const root = stylex.props(styles.badge, styles.status, toneStyles[tone]);

    return (
      <span
        {...props}
        className={mergeClassNames(root.className, className)}
        data-stylex-spike-badge=""
        data-stylex-spike-status-badge=""
        data-tone={tone}
        ref={ref}
        style={{ ...(root.style ?? {}), ...style }}
      >
        <span {...stylex.props(styles.content)} data-stylex-spike-badge-content="">
          {indicator ? (
            <span
              {...stylex.props(styles.indicator)}
              data-stylex-spike-status-indicator=""
              aria-hidden="true"
            />
          ) : null}
          {children}
        </span>
      </span>
    );
  },
);

StatusBadge.displayName = "StatusBadge";
