import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function FormField({ label, error, hint, id, ...props }: FormFieldProps) {
  const fieldId = id ?? props.name;
  const descriptionId = `${fieldId}-description`;
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      <input
        {...props}
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
      />
      {(error || hint) && (
        <span id={descriptionId} className={error ? 'field-error' : 'sr-only'}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
}
