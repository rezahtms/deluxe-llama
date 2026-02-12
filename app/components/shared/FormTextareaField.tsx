"use client";
import { cn } from "@/app/libs/utils/utils";
import { TextareaHTMLAttributes, useId } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<
  T extends FieldValues,
> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  className?: string;
  required?: true;
}

export function FormTextareaField<T extends FieldValues>({
  control,
  name,
  placeholder = "",
  className,
  label,
  required,
  id,
  "aria-describedby": ariaDescribedby,
  ...props
}: Props<T>) {
  const generatedId = useId();
  const textareaId = id || `${name}-${generatedId}`;
  const errorId = `${textareaId}-error`;

  return (
    <div className="textarea-field">
      {label && (
        <label
          htmlFor={textareaId}
          className="textarea-field__label"
        >
          {label}
          {required && <span className="textarea-field__label-required">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          return (
            <div className="textarea-field__control">
              <textarea
                {...props}
                placeholder={placeholder}
                id={textareaId}
                {...field}
                value={field.value ?? ""}
                className={cn(
                  "textarea-field__input",
                  fieldState?.error && "textarea-field__input--error",
                  className,
                )}
                aria-invalid={fieldState.error ? "true" : "false"}
                aria-describedby={`${fieldState.error ? errorId : ""} ${
                  ariaDescribedby || ""
                }`.trim()}
                aria-required={required ? "true" : undefined}
              />
              {fieldState.error && (
                <p
                  id={errorId}
                  className="textarea-field__error"
                  role="alert"
                  aria-live="assertive"
                >
                  {fieldState.error.message}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
