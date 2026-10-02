import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

export type CardSize = "md" | "sm";
export type CardElement = "article" | "div" | "section";
export type CardTitleElement = "div" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: CardElement;
  children: ReactNode;
  size?: CardSize;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as = "div", children, className, size = "md", ...props },
  ref,
) {
  if (as === "div") {
    return (
      <div
        {...props}
        className={className}
        data-console-card=""
        data-size={size}
        ref={ref as Ref<HTMLDivElement>}
      >
        {children}
      </div>
    );
  }

  const Component = as;

  return (
    <Component
      {...props}
      className={className}
      data-console-card=""
      data-size={size}
      ref={ref}
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
    { children, className, separated = false, ...props },
    ref,
  ) {
    return (
      <div
        {...props}
        className={className}
        data-console-card-header=""
        data-separated={separated || undefined}
        ref={ref}
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
  function CardTitle({ as = "div", children, className, ...props }, ref) {
    if (as === "div") {
      return (
        <div
          {...props}
          className={className}
          data-console-card-title=""
          ref={ref as Ref<HTMLDivElement>}
        >
          {children}
        </div>
      );
    }

    const Component = as;

    return (
      <Component
        {...props}
        className={className}
        data-console-card-title=""
        ref={ref as Ref<HTMLHeadingElement>}
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
>(function CardDescription({ children, className, ...props }, ref) {
  return (
    <p
      {...props}
      className={className}
      data-console-card-description=""
      ref={ref}
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
  function CardAction({ children, className, ...props }, ref) {
    return (
      <div
        {...props}
        className={className}
        data-console-card-action=""
        ref={ref}
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
  function CardContent({ children, className, ...props }, ref) {
    return (
      <div
        {...props}
        className={className}
        data-console-card-content=""
        ref={ref}
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
    { children, className, separated = false, ...props },
    ref,
  ) {
    return (
      <div
        {...props}
        className={className}
        data-console-card-footer=""
        data-separated={separated || undefined}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";
