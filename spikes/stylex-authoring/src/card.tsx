import * as stylex from "@stylexjs/stylex";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

import { mergeClassNames } from "./shared.js";

export type CardSize = "md" | "sm";
export type CardElement = "article" | "div" | "section";
export type CardTitleElement = "div" | "h2" | "h3" | "h4" | "h5" | "h6";

const styles = stylex.create({
  card: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--console-border-default)",
    borderRadius: "var(--console-radius-lg)",
    backgroundColor: "var(--console-surface-default)",
    color: "var(--console-text-primary)",
    boxShadow: "var(--console-shadow-raised)",
    fontFamily: "inherit",
    fontSize: "var(--console-font-size-xs)",
    lineHeight: "var(--console-line-height-relaxed)",
  },
  cardMd: {
    gap: "var(--console-space-4)",
    paddingBlock: "var(--console-space-5)",
  },
  cardSm: {
    gap: "var(--console-space-3)",
    paddingBlock: "var(--console-space-4)",
  },
  section: {
    minWidth: 0,
    paddingInline: "var(--console-space-5)",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    columnGap: "var(--console-space-4)",
    rowGap: "var(--console-space-2)",
  },
  headerSeparated: {
    paddingBottom: "var(--console-space-5)",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "var(--console-border-default)",
  },
  title: {
    minWidth: 0,
    margin: 0,
    fontSize: "var(--console-font-size-sm)",
    fontWeight: "var(--console-font-weight-semibold)",
    lineHeight: "var(--console-line-height-tight)",
    letterSpacing: "-0.01em",
  },
  description: {
    minWidth: 0,
    margin: 0,
    color: "var(--console-text-muted)",
    fontSize: "var(--console-font-size-xs)",
    lineHeight: "var(--console-line-height-default)",
  },
  action: {
    gridColumn: "2",
    gridRow: "1 / span 2",
    alignSelf: "start",
    justifySelf: "end",
    minWidth: 0,
  },
  footer: {
    display: "flex",
    minHeight: "var(--console-control-height)",
    alignItems: "center",
    gap: "var(--console-space-2)",
  },
  footerSeparated: {
    paddingTop: "var(--console-space-5)",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "var(--console-border-default)",
  },
});

const cardSizeStyles = {
  md: styles.cardMd,
  sm: styles.cardSm,
} as const;

export interface CardProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: CardElement;
  children: ReactNode;
  size?: CardSize;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as = "div", children, className, size = "md", style, ...props },
  ref,
) {
  const sx = stylex.props(styles.card, cardSizeStyles[size]);
  const classNames = mergeClassNames(sx.className, className);
  const inlineStyle = { ...(sx.style ?? {}), ...style };

  if (as === "div") {
    return (
      <div
        {...props}
        className={classNames}
        data-stylex-spike-card=""
        data-size={size}
        ref={ref as Ref<HTMLDivElement>}
        style={inlineStyle}
      >
        {children}
      </div>
    );
  }

  const Component = as;

  return (
    <Component
      {...props}
      className={classNames}
      data-stylex-spike-card=""
      data-size={size}
      ref={ref}
      style={inlineStyle}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export interface CardHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  separated?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader(
    { children, className, separated = false, style, ...props },
    ref,
  ) {
    const sx = stylex.props(
      styles.section,
      styles.header,
      separated && styles.headerSeparated,
    );

    return (
      <div
        {...props}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-card-header=""
        data-stylex-spike-card-section=""
        data-separated={separated || undefined}
        ref={ref}
        style={{ ...(sx.style ?? {}), ...style }}
      >
        {children}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: CardTitleElement;
  children: ReactNode;
}

export const CardTitle = forwardRef<HTMLElement, CardTitleProps>(
  function CardTitle({ as = "div", children, className, style, ...props }, ref) {
    const sx = stylex.props(styles.title);
    const classNames = mergeClassNames(sx.className, className);
    const inlineStyle = { ...(sx.style ?? {}), ...style };

    if (as === "div") {
      return (
        <div
          {...props}
          className={classNames}
          data-stylex-spike-card-title=""
          ref={ref as Ref<HTMLDivElement>}
          style={inlineStyle}
        >
          {children}
        </div>
      );
    }

    const Component = as;

    return (
      <Component
        {...props}
        className={classNames}
        data-stylex-spike-card-title=""
        ref={ref as Ref<HTMLHeadingElement>}
        style={inlineStyle}
      >
        {children}
      </Component>
    );
  },
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, "children"> {
  children: ReactNode;
}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription({ children, className, style, ...props }, ref) {
  const sx = stylex.props(styles.description);

  return (
    <p
      {...props}
      className={mergeClassNames(sx.className, className)}
      data-stylex-spike-card-description=""
      ref={ref}
      style={{ ...(sx.style ?? {}), ...style }}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

export interface CardActionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
}

export const CardAction = forwardRef<HTMLDivElement, CardActionProps>(
  function CardAction({ children, className, style, ...props }, ref) {
    const sx = stylex.props(styles.action);

    return (
      <div
        {...props}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-card-action=""
        ref={ref}
        style={{ ...(sx.style ?? {}), ...style }}
      >
        {children}
      </div>
    );
  },
);

CardAction.displayName = "CardAction";

export interface CardContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ children, className, style, ...props }, ref) {
    const sx = stylex.props(styles.section);

    return (
      <div
        {...props}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-card-content=""
        data-stylex-spike-card-section=""
        ref={ref}
        style={{ ...(sx.style ?? {}), ...style }}
      >
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

export interface CardFooterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  separated?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter(
    { children, className, separated = false, style, ...props },
    ref,
  ) {
    const sx = stylex.props(
      styles.section,
      styles.footer,
      separated && styles.footerSeparated,
    );

    return (
      <div
        {...props}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-card-footer=""
        data-stylex-spike-card-section=""
        data-separated={separated || undefined}
        ref={ref}
        style={{ ...(sx.style ?? {}), ...style }}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";
