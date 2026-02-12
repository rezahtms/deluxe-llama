"use client";

import { InputHTMLAttributes, useId } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

const normalizeNumber = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => {
    const index = "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
    return String(index);
  });

const toPersianDigits = (value: string) =>
  value.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

interface FormInputFieldProps<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  type?: HTMLInputElement["type"];
  nuSeparator?: boolean;
  required?: true;
  "aria-describedby"?: string;
}

function FormInputField<T extends FieldValues>({
  label,
  name,
  control,
  className,
  rules,
  type,
  nuSeparator = false,
  required,
  "aria-describedby": ariaDescribedby,
  id,
  ...props
}: FormInputFieldProps<T>) {
  const generatedId = useId();
  const inputId = id || `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="form-input__label">
          {label}
          {required && (
            <span className="form-input__label-required" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only">(اجباری)</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) => {
          const displayValue =
            field.value === undefined || field.value === null
              ? ""
              : type === "number" && nuSeparator
                ? toPersianDigits(
                    String(field.value).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  )
                : String(field.value);

          return (
            <>
              <input
                {...props}
                type={type}
                id={inputId}
                inputMode={type === "number" ? "numeric" : undefined}
                value={displayValue}
                onChange={(e) => {
                  if (type !== "number" || !nuSeparator) {
                    field.onChange(e.target.value);
                    return;
                  }

                  const raw = normalizeNumber(e.target.value).replace(/,/g, "");
                  const num = Number(raw);
                  field.onChange(!isNaN(num) ? num : undefined);
                }}
                className={`form-input__input ${
                  fieldState.error ? "form-input__input--error" : ""
                } ${className || ""}`}
                aria-invalid={fieldState.error ? "true" : "false"}
                aria-describedby={`${fieldState.error ? errorId : ""} ${
                  ariaDescribedby || ""
                }`.trim()}
                aria-required={required ? "true" : undefined}
              />
              {fieldState.error && (
                <p
                  id={errorId}
                  className="form-input__error"
                  role="alert"
                  aria-live="assertive"
                >
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

export { FormInputField };
