import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  type ReactNode,
} from "react";

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

    return (
      <section
        {...props}
        aria-label={label}
        className={className}
        data-console-data-table-frame=""
        data-sticky-header={stickyHeader || undefined}
        ref={ref}
        style={{ ...style, maxHeight }}
        tabIndex={tabIndex}
      >
        <div
          data-console-data-table-frame-width=""
          style={{ minWidth: resolvedMinimumWidth }}
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
  { className, ...props },
  ref,
) {
  return (
    <table {...props} className={className} data-console-table="" ref={ref} />
  );
});

Table.displayName = "Table";

export type TableHeaderProps = ComponentPropsWithoutRef<"thead">;

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      {...props}
      className={className}
      data-console-table-header=""
      ref={ref}
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
        data-console-table-body=""
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
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      {...props}
      className={className}
      data-console-table-footer=""
      ref={ref}
    />
  );
});

TableFooter.displayName = "TableFooter";

export type TableRowProps = ComponentPropsWithoutRef<"tr">;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        {...props}
        className={className}
        data-console-table-row=""
        ref={ref}
      />
    );
  },
);

TableRow.displayName = "TableRow";

export type TableHeadProps = ComponentPropsWithoutRef<"th">;

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  function TableHead({ className, ...props }, ref) {
    return (
      <th
        {...props}
        className={className}
        data-console-table-head=""
        ref={ref}
      />
    );
  },
);

TableHead.displayName = "TableHead";

export type TableCellProps = ComponentPropsWithoutRef<"td">;

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className, ...props }, ref) {
    return (
      <td
        {...props}
        className={className}
        data-console-table-cell=""
        ref={ref}
      />
    );
  },
);

TableCell.displayName = "TableCell";

export type TableCaptionProps = ComponentPropsWithoutRef<"caption">;

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      {...props}
      className={className}
      data-console-table-caption=""
      ref={ref}
    />
  );
});

TableCaption.displayName = "TableCaption";
