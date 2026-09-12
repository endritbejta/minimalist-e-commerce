/**
 * FormField Component
 * A labelled input or select, with its error and hint wired to it.
 *
 * The error is `role="alert"` and referenced by `aria-describedby`, so it is
 * announced when it appears and read out again whenever the field is focused —
 * a red line under a box says nothing to anyone not looking at it.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.field - The field description from `DETAILS_FIELDS`.
 * @param {string} props.id - The input's DOM id.
 * @param {string} props.value - The current value.
 * @param {string} [props.error] - The validation message, when the field fails.
 * @param {Function} props.onChange - Called with (name, value).
 * @param {Function} props.onBlur - Called with (name), to validate on leaving.
 */
function FormField({ field, id, value, error, onChange, onBlur }) {
  const describedBy = [error && `${id}-error`, field.hint && `${id}-hint`]
    .filter(Boolean)
    .join(' ');

  const controlClasses = `w-full border p-3 rounded-md bg-white transition-colors focus:outline-none ${
    error
      ? 'border-red-400 focus:border-red-500'
      : 'border-gray-200 focus:border-black'
  }`;

  const shared = {
    id,
    name: field.name,
    value,
    autoComplete: field.autoComplete,
    required: field.required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
    onChange: (event) => onChange(field.name, event.target.value),
    onBlur: () => onBlur(field.name),
    className: controlClasses,
  };

  return (
    <div className={field.width === 'half' ? 'sm:col-span-1' : 'sm:col-span-2'}>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest mb-2">
        {field.label}
        {!field.required && (
          <span className="ml-1 font-medium normal-case tracking-normal text-gray-400">
            (optional)
          </span>
        )}
      </label>

      {field.type === 'select' ? (
        <select {...shared}>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...shared} type={field.type} />
      )}

      {field.hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] text-gray-500">
          {field.hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
