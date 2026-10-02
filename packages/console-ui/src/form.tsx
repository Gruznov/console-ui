import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export type FormGridColumns = 1 | 2;

export interface FormGridProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  columns?: FormGridColumns;
}

export const FormGrid = forwardRef<HTMLDivElement, FormGridProps>(
  function FormGrid({ children, className, columns = 1, ...props }, ref) {
    return (
      <div
        {...props}
        className={className}
        data-columns={columns}
        data-console-form-grid=""
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

FormGrid.displayName = "FormGrid";

export interface FormFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  controlId: string;
  description?: ReactNode;
  error?: ReactNode;
  label: ReactNode;
  optional?: ReactNode;
  wide?: boolean;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(
    {
      children,
      className,
      controlId,
      description,
      error,
      label,
      optional,
      wide = false,
      ...props
    },
    ref,
  ) {
    return (
      <div
        {...props}
        className={className}
        data-console-form-field=""
        data-invalid={error ? true : undefined}
        data-wide={wide || undefined}
        ref={ref}
      >
        <label data-console-form-field-label="" htmlFor={controlId}>
          <span>{label}</span>
          {optional !== undefined ? (
            <span data-console-form-field-optional="">{optional}</span>
          ) : null}
        </label>
        <div data-console-form-field-control="">{children}</div>
        {error ? (
          <div
            data-console-form-field-error=""
            id={`${controlId}-error`}
            role="alert"
          >
            {error}
          </div>
        ) : description ? (
          <div
            data-console-form-field-description=""
            id={`${controlId}-description`}
          >
            {description}
          </div>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { "aria-invalid": ariaInvalid, className, invalid = false, ...props },
  ref,
) {
  return (
    <input
      {...props}
      aria-invalid={invalid ? true : ariaInvalid}
      className={className}
      data-console-input=""
      data-invalid={invalid || undefined}
      ref={ref}
    />
  );
});

Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { "aria-invalid": ariaInvalid, className, invalid = false, ...props },
    ref,
  ) {
    return (
      <textarea
        {...props}
        aria-invalid={invalid ? true : ariaInvalid}
        className={className}
        data-console-textarea=""
        data-invalid={invalid || undefined}
        ref={ref}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { "aria-invalid": ariaInvalid, className, invalid = false, ...props },
    ref,
  ) {
    return (
      <select
        {...props}
        aria-invalid={invalid ? true : ariaInvalid}
        className={className}
        data-console-select=""
        data-invalid={invalid || undefined}
        ref={ref}
      />
    );
  },
);

Select.displayName = "Select";

export interface FormActionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  align?: "end" | "start";
  children: ReactNode;
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  function FormActions({ align = "end", children, className, ...props }, ref) {
    return (
      <div
        {...props}
        className={className}
        data-align={align}
        data-console-form-actions=""
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

FormActions.displayName = "FormActions";
