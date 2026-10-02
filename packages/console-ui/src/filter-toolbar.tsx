import {
  type ButtonHTMLAttributes,
  type FieldsetHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export interface FilterToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  actions?: ReactNode;
  children: ReactNode;
}

export const FilterToolbar = forwardRef<HTMLDivElement, FilterToolbarProps>(
  function FilterToolbar({ actions, children, className, ...props }, ref) {
    return (
      <div
        {...props}
        className={className}
        data-console-filter-toolbar=""
        ref={ref}
      >
        {children}
        {actions ? (
          <div data-console-filter-toolbar-actions="">{actions}</div>
        ) : null}
      </div>
    );
  },
);

FilterToolbar.displayName = "FilterToolbar";

export interface FilterGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children"> {
  children: ReactNode;
  label: string;
}

export const FilterGroup = forwardRef<HTMLFieldSetElement, FilterGroupProps>(
  function FilterGroup({ children, className, label, ...props }, ref) {
    return (
      <fieldset
        {...props}
        className={className}
        data-console-filter-group=""
        ref={ref}
      >
        <legend data-console-visually-hidden="">{label}</legend>
        {children}
      </fieldset>
    );
  },
);

FilterGroup.displayName = "FilterGroup";

export interface FilterButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-pressed" | "children"
  > {
  children: ReactNode;
  selected?: boolean;
}

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  function FilterButton(
    { children, className, selected = false, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        {...props}
        aria-pressed={selected}
        className={className}
        data-console-filter-button=""
        data-selected={selected || undefined}
        ref={ref}
        type={type}
      >
        {children}
      </button>
    );
  },
);

FilterButton.displayName = "FilterButton";
