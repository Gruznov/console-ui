"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

export type TabsValue = string;
export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";
export type TabsListVariant = "line" | "surface";

interface TabsSharedProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange"
  > {
  children: ReactNode;
  onValueChange?: (value: TabsValue | null) => void;
  orientation?: TabsOrientation;
}

interface ControlledTabsProps {
  defaultValue?: never;
  value: TabsValue | null;
}

interface UncontrolledTabsProps {
  defaultValue: TabsValue | null;
  value?: never;
}

export type TabsProps = TabsSharedProps &
  (ControlledTabsProps | UncontrolledTabsProps);

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    children,
    className,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    value,
    ...props
  },
  ref,
) {
  return (
    <TabsPrimitive.Root
      {...props}
      className={className}
      data-console-tabs=""
      defaultValue={defaultValue}
      onValueChange={
        onValueChange
          ? (nextValue) => onValueChange(nextValue as TabsValue | null)
          : undefined
      }
      orientation={orientation}
      ref={ref}
      value={value}
    >
      {children}
    </TabsPrimitive.Root>
  );
});

Tabs.displayName = "Tabs";

export interface TabsListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  activationMode?: TabsActivationMode;
  children: ReactNode;
  loop?: boolean;
  variant?: TabsListVariant;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList(
    {
      activationMode = "manual",
      children,
      className,
      loop = true,
      variant = "surface",
      ...props
    },
    ref,
  ) {
    return (
      <TabsPrimitive.List
        {...props}
        activateOnFocus={activationMode === "automatic"}
        className={className}
        data-console-tabs-list=""
        data-variant={variant}
        loopFocus={loop}
        ref={ref}
      >
        {children}
      </TabsPrimitive.List>
    );
  },
);

TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "type" | "value"
  > {
  children: ReactNode;
  value: TabsValue;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ children, className, value, ...props }, ref) {
    return (
      <TabsPrimitive.Tab
        {...props}
        className={className}
        data-console-tabs-trigger=""
        ref={ref as Ref<HTMLElement>}
        type="button"
        value={value}
      >
        {children}
      </TabsPrimitive.Tab>
    );
  },
);

TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  keepMounted?: boolean;
  value: TabsValue;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent(
    { children, className, keepMounted, value, ...props },
    ref,
  ) {
    return (
      <TabsPrimitive.Panel
        {...props}
        className={className}
        data-console-tabs-content=""
        keepMounted={keepMounted}
        ref={ref}
        value={value}
      >
        {children}
      </TabsPrimitive.Panel>
    );
  },
);

TabsContent.displayName = "TabsContent";
