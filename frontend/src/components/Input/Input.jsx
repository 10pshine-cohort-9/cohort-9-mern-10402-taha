import { forwardRef, useId } from 'react';
import './Input.css';

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    placeholder,
    error,
    fullWidth = true,
    id,
    className = '',
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  const groupClasses = [
    'input-group',
    fullWidth ? 'input-group-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClasses = [
    'input-field',
    error ? 'input-field-error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={groupClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        className={fieldClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...rest}
      />
      {error && <span id={errorId} className="input-error-text">{error}</span>}
    </div>
  );
});

export default Input;
