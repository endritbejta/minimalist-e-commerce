import { DETAILS_FIELDS } from '../../lib/checkoutForm';
import FormField from './FormField';

const GROUPS = [
  { id: 'contact', title: 'Contact' },
  { id: 'address', title: 'Delivery address' },
];

/**
 * DetailsFields Component
 * Contact details and the delivery address, as two fieldsets of the checkout
 * form. Owns no form or buttons of its own — the page has one of each.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.values - The current field values.
 * @param {Object} props.errors - Field name to error message, for failing fields.
 * @param {(name: string) => string} props.fieldId - Maps a field name to its DOM id.
 * @param {Function} props.onChange - Called with (name, value).
 * @param {Function} props.onBlur - Called with (name) when a field is left.
 */
function DetailsFields({ values, errors, fieldId, onChange, onBlur }) {
  return (
    <>
      {GROUPS.map((group) => (
        <fieldset key={group.id}>
          <legend className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">
            {group.title}
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            {DETAILS_FIELDS.filter((field) => field.group === group.id).map((field) => (
              <FormField
                key={field.name}
                field={field}
                id={fieldId(field.name)}
                value={values[field.name] ?? ''}
                error={errors[field.name]}
                onChange={onChange}
                onBlur={onBlur}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </>
  );
}

export default DetailsFields;
