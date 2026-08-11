import { forwardRef } from 'react';
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
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        className={fieldClasses}
        {...rest}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
});

export default Input;
