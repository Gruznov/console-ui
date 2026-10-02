import * as stylex from "@stylexjs/stylex";
import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type StatusTone = "danger" | "info" | "neutral" | "success" | "warning";

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
  statusNeutral: {
    borderColor: "var(--console-status-neutral-border)",
    backgroundColor: "var(--console-status-neutral-surface)",
    color: "var(--console-status-neutral-text)",
    fontWeight: "var(--console-font-weight-semibold)",
  },
  statusInfo: {
    borderColor: "var(--console-status-info-border)",
    backgroundColor: "var(--console-status-info-surface)",
    color: "var(--console-status-info-text)",
    fontWeight: "var(--console-font-weight-semibold)",
  },
  statusSuccess: {
    borderColor: "var(--console-status-success-border)",
    backgroundColor: "var(--console-status-success-surface)",
    color: "var(--console-status-success-text)",
    fontWeight: "var(--console-font-weight-semibold)",
  },
  statusWarning: {
    borderColor: "var(--console-status-warning-border)",
    backgroundColor: "var(--console-status-warning-surface)",
    color: "var(--console-status-warning-text)",
    fontWeight: "var(--console-font-weight-semibold)",
  },
  statusDanger: {
    borderColor: "var(--console-status-danger-border)",
    backgroundColor: "var(--console-status-danger-surface)",
    color: "var(--console-status-danger-text)",
    fontWeight: "var(--console-font-weight-semibold)",
  },
  indicator: {
    width: "0.375rem",
    height: "0.375rem",
    flex: "0 0 auto",
    borderRadius: "var(--console-radius-full)",
    backgroundColor: "currentColor",
  },
});

// Every StyleX composition in this component is static. The runtime tone only
// selects one already-compiled props object; it never calls stylex.props().
// The pilot build asserts that @stylexjs/stylex contributes zero bytes to the
// distributed badge.js bundle.
const badgeRootStyleProps = stylex.props(styles.badge);
const badgeContentStyleProps = stylex.props(styles.content);
const statusRootStyleProps = {
  danger: stylex.props(styles.badge, styles.statusDanger),
  info: stylex.props(styles.badge, styles.statusInfo),
  neutral: stylex.props(styles.badge, styles.statusNeutral),
  success: stylex.props(styles.badge, styles.statusSuccess),
  warning: stylex.props(styles.badge, styles.statusWarning),
} as const;
const statusIndicatorStyleProps = stylex.props(styles.indicator);

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

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, className, style, ...props },
  ref,
) {
  return (
    <span
      {...props}
      className={mergeClassName(badgeRootStyleProps.className, className)}
      data-console-badge=""
      ref={ref}
      style={mergeInlineStyle(badgeRootStyleProps.style, style)}
    >
      <span {...badgeContentStyleProps} data-console-badge-content="">
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
    const rootStyleProps = statusRootStyleProps[tone];

    return (
      <span
        {...props}
        className={mergeClassName(rootStyleProps.className, className)}
        data-console-badge=""
        data-console-status-badge=""
        data-tone={tone}
        ref={ref}
        style={mergeInlineStyle(rootStyleProps.style, style)}
      >
        <span {...badgeContentStyleProps} data-console-badge-content="">
          {indicator ? (
            <span
              {...statusIndicatorStyleProps}
              data-console-status-indicator=""
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
