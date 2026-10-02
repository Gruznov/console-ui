import {
  type CSSProperties,
  type FieldsetHTMLAttributes,
  forwardRef,
  type InputHTMLAttributes,
  type OlHTMLAttributes,
  type ReactNode,
} from "react";

export type ChoiceGroupColumns = 1 | 2 | 3;

export interface ChoiceGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children"> {
  children: ReactNode;
  columns?: ChoiceGroupColumns;
  description?: ReactNode;
  legend: ReactNode;
}

export const ChoiceGroup = forwardRef<HTMLFieldSetElement, ChoiceGroupProps>(
  function ChoiceGroup(
    { children, className, columns = 1, description, legend, ...props },
    ref,
  ) {
    return (
      <fieldset
        {...props}
        className={className}
        data-columns={columns}
        data-console-choice-group=""
        ref={ref}
      >
        <legend data-console-choice-group-legend="">{legend}</legend>
        {description ? (
          <div data-console-choice-group-description="">{description}</div>
        ) : null}
        <div data-console-choice-group-options="">{children}</div>
      </fieldset>
    );
  },
);

ChoiceGroup.displayName = "ChoiceGroup";

export type ChoiceCardControl = "checkbox" | "radio";

export interface ChoiceCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type"> {
  description?: ReactNode;
  icon?: ReactNode;
  label: ReactNode;
  type?: ChoiceCardControl;
}

export const ChoiceCard = forwardRef<HTMLInputElement, ChoiceCardProps>(
  function ChoiceCard(
    {
      className,
      description,
      disabled = false,
      icon,
      label,
      type = "radio",
      ...props
    },
    ref,
  ) {
    return (
      <label
        className={className}
        data-console-choice-card=""
        data-disabled={disabled || undefined}
      >
        <input
          {...props}
          data-console-choice-card-input=""
          disabled={disabled}
          ref={ref}
          type={type}
        />
        {icon ? (
          <span aria-hidden="true" data-console-choice-card-icon="">
            {icon}
          </span>
        ) : null}
        <span data-console-choice-card-copy="">
          <strong data-console-choice-card-label="">{label}</strong>
          {description ? (
            <span data-console-choice-card-description="">{description}</span>
          ) : null}
        </span>
        <span aria-hidden="true" data-console-choice-card-indicator="" />
      </label>
    );
  },
);

ChoiceCard.displayName = "ChoiceCard";

export type ProgressStepState = "complete" | "current" | "upcoming";

export type ProgressStep = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  marker?: ReactNode;
  state: ProgressStepState;
};

export interface ProgressStepsProps
  extends Omit<OlHTMLAttributes<HTMLOListElement>, "children"> {
  label: string;
  steps: readonly ProgressStep[];
}

export const ProgressSteps = forwardRef<HTMLOListElement, ProgressStepsProps>(
  function ProgressSteps({ className, label, steps, style, ...props }, ref) {
    return (
      <ol
        {...props}
        aria-label={label}
        className={className}
        data-console-progress-steps=""
        ref={ref}
        style={
          {
            ...style,
            "--_console-step-count": Math.max(steps.length, 1),
          } as CSSProperties
        }
      >
        {steps.map((step, index) => (
          <li
            aria-current={step.state === "current" ? "step" : undefined}
            data-console-progress-step=""
            data-state={step.state}
            key={step.id}
          >
            <span aria-hidden="true" data-console-progress-step-marker="">
              {step.marker ?? index + 1}
            </span>
            <span data-console-progress-step-copy="">
              <strong data-console-progress-step-label="">{step.label}</strong>
              {step.description ? (
                <span data-console-progress-step-description="">
                  {step.description}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    );
  },
);

ProgressSteps.displayName = "ProgressSteps";
