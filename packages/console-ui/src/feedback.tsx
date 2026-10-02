import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import type { StatusTone } from "./badge.js";

export type FeedbackStateKind = "checking" | "empty" | "error" | "unavailable";

const defaultFeedbackTones: Record<FeedbackStateKind, StatusTone> = {
  checking: "info",
  empty: "neutral",
  error: "danger",
  unavailable: "warning",
};

export interface FeedbackStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  state: FeedbackStateKind;
  title: ReactNode;
  tone?: StatusTone;
}

export const FeedbackState = forwardRef<HTMLDivElement, FeedbackStateProps>(
  function FeedbackState(
    {
      "aria-busy": ariaBusy,
      action,
      children,
      className,
      description,
      icon,
      state,
      title,
      tone = defaultFeedbackTones[state],
      ...props
    },
    ref,
  ) {
    return (
      <div
        {...props}
        aria-busy={state === "checking" ? true : ariaBusy}
        className={className}
        data-console-feedback-state=""
        data-state={state}
        data-tone={tone}
        ref={ref}
      >
        <span aria-hidden="true" data-console-feedback-state-visual="">
          {icon ?? <span data-console-feedback-state-indicator="" />}
        </span>
        <div data-console-feedback-state-copy="">
          <strong data-console-feedback-state-title="">{title}</strong>
          {description ? (
            <div data-console-feedback-state-description="">{description}</div>
          ) : null}
          {children ? (
            <div data-console-feedback-state-detail="">{children}</div>
          ) : null}
        </div>
        {action ? (
          <div data-console-feedback-state-action="">{action}</div>
        ) : null}
      </div>
    );
  },
);

FeedbackState.displayName = "FeedbackState";

export interface InlineNoticeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
  tone?: StatusTone;
  value?: ReactNode;
}

export const InlineNotice = forwardRef<HTMLDivElement, InlineNoticeProps>(
  function InlineNotice(
    {
      action,
      className,
      description,
      icon,
      title,
      tone = "neutral",
      value,
      ...props
    },
    ref,
  ) {
    return (
      <div
        {...props}
        className={className}
        data-console-inline-notice=""
        data-tone={tone}
        ref={ref}
      >
        {icon ? (
          <span aria-hidden="true" data-console-inline-notice-icon="">
            {icon}
          </span>
        ) : null}
        <div data-console-inline-notice-copy="">
          <strong data-console-inline-notice-title="">{title}</strong>
          {description ? (
            <div data-console-inline-notice-description="">{description}</div>
          ) : null}
        </div>
        {value !== undefined ? (
          <div data-console-inline-notice-value="">{value}</div>
        ) : null}
        {action ? (
          <div data-console-inline-notice-action="">{action}</div>
        ) : null}
      </div>
    );
  },
);

InlineNotice.displayName = "InlineNotice";
