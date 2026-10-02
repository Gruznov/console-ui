"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

export type TooltipAlign = "center" | "end" | "start";
export type TooltipSide = "bottom" | "left" | "right" | "top";

export interface TooltipProps {
  align?: TooltipAlign;
  children: ReactElement;
  closeDelay?: number;
  content: ReactNode;
  defaultOpen?: boolean;
  delay?: number;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  side?: TooltipSide;
  sideOffset?: number;
}

export function Tooltip({
  align = "center",
  children,
  closeDelay = 0,
  content,
  defaultOpen = false,
  delay = 400,
  disabled = false,
  onOpenChange,
  open,
  side = "top",
  sideOffset = 8,
}: TooltipProps) {
  return (
    <BaseTooltip.Root
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={onOpenChange}
      open={open}
    >
      <BaseTooltip.Trigger
        closeDelay={closeDelay}
        delay={delay}
        render={children}
      />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          align={align}
          data-console-tooltip-positioner=""
          side={side}
          sideOffset={sideOffset}
        >
          <BaseTooltip.Popup data-console-tooltip-popup="">
            {content}
            <BaseTooltip.Arrow data-console-tooltip-arrow="" />
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
