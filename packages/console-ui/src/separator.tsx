import { forwardRef, type HTMLAttributes } from "react";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps
  extends Omit<
    HTMLAttributes<HTMLHRElement>,
    "aria-hidden" | "aria-orientation" | "children" | "role"
  > {
  decorative?: boolean;
  orientation?: SeparatorOrientation;
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  function Separator(
    { className, decorative = false, orientation = "horizontal", ...props },
    ref,
  ) {
    if (decorative) {
      return (
        <hr
          {...props}
          className={className}
          data-console-separator=""
          data-decorative="true"
          data-orientation={orientation}
          ref={ref}
          role="presentation"
        />
      );
    }

    return (
      <hr
        {...props}
        aria-orientation={orientation}
        className={className}
        data-console-separator=""
        data-orientation={orientation}
        ref={ref}
      />
    );
  },
);

Separator.displayName = "Separator";
