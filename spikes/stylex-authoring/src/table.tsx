import * as stylex from "@stylexjs/stylex";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  type ReactNode,
} from "react";

import { mergeClassNames } from "./shared.js";

const styles = stylex.create({
  frame: {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    overflow: "auto",
    overscrollBehaviorX: "contain",
    overscrollBehaviorY: "auto",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--console-border-default)",
    borderRadius: "var(--console-radius-md)",
    backgroundColor: "var(--console-surface-default)",
    scrollbarGutter: "stable",
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
  },
  frameWidth: {
    width: "max-content",
    minWidth: "100%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: 0,
    captionSide: "bottom",
    color: "var(--console-text-primary)",
    fontFamily: "inherit",
    fontSize: "var(--console-font-size-xs)",
    lineHeight: "var(--console-line-height-default)",
    textAlign: "left",
  },
  header: {
    backgroundColor: "var(--console-surface-muted)",
  },
  footer: {
    backgroundColor: "var(--console-surface-muted)",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "var(--console-border-default)",
    fontWeight: "var(--console-font-weight-medium)",
  },
  row: {
    height: "var(--console-row-min-height)",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "var(--console-border-subtle)",
    transitionProperty: "background-color",
    transitionDuration: "var(--console-duration-fast)",
    transitionTimingFunction: "var(--console-easing-standard)",
  },
  cell: {
    height: "var(--console-row-min-height)",
    paddingBlock: "var(--console-space-3)",
    paddingInline: "var(--console-space-4)",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  head: {
    color: "var(--console-text-muted)",
    fontWeight: "var(--console-font-weight-medium)",
  },
  caption: {
    paddingBlockStart: "var(--console-space-4)",
    color: "var(--console-text-muted)",
    fontSize: "var(--console-font-size-xs)",
    textAlign: "left",
  },
});

export interface DataTableFrameProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  children: ReactNode;
  label: string;
  maxHeight?: CSSProperties["maxHeight"];
  minWidth?: CSSProperties["minWidth"];
  stickyHeader?: boolean;
}

export const DataTableFrame = forwardRef<HTMLElement, DataTableFrameProps>(
  function DataTableFrame(
    {
      children,
      className,
      label,
      maxHeight,
      minWidth,
      stickyHeader = false,
      style,
      tabIndex = 0,
      ...props
    },
    ref,
  ) {
    const minimumContentWidth =
      typeof minWidth === "number" ? `${minWidth}px` : minWidth;
    const resolvedMinimumWidth =
      minimumContentWidth === undefined
        ? undefined
        : `max(100%, ${minimumContentWidth})`;
    const root = stylex.props(styles.frame);
    const width = stylex.props(styles.frameWidth);

    return (
      <section
        {...props}
        aria-label={label}
        className={mergeClassNames(root.className, className)}
        data-stylex-spike-data-table-frame=""
        data-sticky-header={stickyHeader || undefined}
        ref={ref}
        style={{
          ...(root.style ?? {}),
          ...style,
          maxHeight,
        }}
        tabIndex={tabIndex}
      >
        <div
          className={width.className}
          data-stylex-spike-data-table-frame-width=""
          style={{
            ...(width.style ?? {}),
            minWidth: resolvedMinimumWidth,
          }}
        >
          {children}
        </div>
      </section>
    );
  },
);

DataTableFrame.displayName = "DataTableFrame";

export type TableProps = ComponentPropsWithoutRef<"table">;

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, style, ...props },
  ref,
) {
  const sx = stylex.props(styles.table);
  return (
    <table
      {...props}
      className={mergeClassNames(sx.className, className)}
      data-stylex-spike-table=""
      ref={ref}
      style={{ ...(sx.style ?? {}), ...style }}
    />
  );
});

Table.displayName = "Table";

export type TableHeaderProps = ComponentPropsWithoutRef<"thead">;

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(function TableHeader({ className, style, ...props }, ref) {
  const sx = stylex.props(styles.header);
  return (
    <thead
      {...props}
      className={mergeClassNames(sx.className, className)}
      data-stylex-spike-table-header=""
      ref={ref}
      style={{ ...(sx.style ?? {}), ...style }}
    />
  );
});

TableHeader.displayName = "TableHeader";

export type TableBodyProps = ComponentPropsWithoutRef<"tbody">;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, ...props }, ref) {
    return (
      <tbody
        {...props}
        className={className}
        data-stylex-spike-table-body=""
        ref={ref}
      />
    );
  },
);

TableBody.displayName = "TableBody";

export type TableFooterProps = ComponentPropsWithoutRef<"tfoot">;

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(function TableFooter({ className, style, ...props }, ref) {
  const sx = stylex.props(styles.footer);
  return (
    <tfoot
      {...props}
      className={mergeClassNames(sx.className, className)}
      data-stylex-spike-table-footer=""
      ref={ref}
      style={{ ...(sx.style ?? {}), ...style }}
    />
  );
});

TableFooter.displayName = "TableFooter";

export type TableRowProps = ComponentPropsWithoutRef<"tr">;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, style, ...props }, ref) {
    const sx = stylex.props(styles.row);
    return (
      <tr
        {...props}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-table-row=""
        ref={ref}
        style={{ ...(sx.style ?? {}), ...style }}
      />
    );
  },
);

TableRow.displayName = "TableRow";

export type TableHeadProps = ComponentPropsWithoutRef<"th">;

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  function TableHead({ className, style, ...props }, ref) {
    const sx = stylex.props(styles.cell, styles.head);
    return (
      <th
        {...props}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-table-head=""
        ref={ref}
        style={{ ...(sx.style ?? {}), ...style }}
      />
    );
  },
);

TableHead.displayName = "TableHead";

export type TableCellProps = ComponentPropsWithoutRef<"td">;

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className, style, ...props }, ref) {
    const sx = stylex.props(styles.cell);
    return (
      <td
        {...props}
        className={mergeClassNames(sx.className, className)}
        data-stylex-spike-table-cell=""
        ref={ref}
        style={{ ...(sx.style ?? {}), ...style }}
      />
    );
  },
);

TableCell.displayName = "TableCell";

export type TableCaptionProps = ComponentPropsWithoutRef<"caption">;

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(function TableCaption({ className, style, ...props }, ref) {
  const sx = stylex.props(styles.caption);
  return (
    <caption
      {...props}
      className={mergeClassNames(sx.className, className)}
      data-stylex-spike-table-caption=""
      ref={ref}
      style={{ ...(sx.style ?? {}), ...style }}
    />
  );
});

TableCaption.displayName = "TableCaption";
