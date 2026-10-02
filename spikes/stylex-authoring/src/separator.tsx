import * as stylex from "@stylexjs/stylex";
import { forwardRef, type HTMLAttributes } from "react";

import { mergeClassNames } from "./shared.js";

export type SeparatorOrientation = "horizontal" | "vertical";

const styles = stylex.create({
  base: {
    display: "block",
    flex: "0 0 auto",
    margin: 0,
    border: 0,
    backgroundColor: "var(--console-border-subtle)",
  },
  horizontal: {
    width: "100%",
    height: 1,
  },
  vertical: {
    width: 1,
    alignSelf: "stretch",
  },
});

const orientationStyles = {
  horizontal: styles.horizontal,
  vertical: styles.vertical,
} as const;

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
    {
      className,
      decorative = false,
      orientation = "horizontal",
      style,
      ...props
    },
    ref,
  ) {
    const sx = stylex.props(styles.base, orientationStyles[orientation]);
    const shared = {
      ...props,
      className: mergeClassNames(sx.className, className),
      "data-stylex-spike-separator": "",
      "data-orientation": orientation,
      ref,
      style: { ...(sx.style ?? {}), ...style },
    };

    if (decorative) {
      return <hr {...shared} data-decorative="true" role="presentation" />;
    }

    return <hr {...shared} aria-orientation={orientation} />;
  },
);

Separator.displayName = "Separator";
