/**
 * The checkout details form: which fields are asked for, and what counts as a
 * usable answer.
 *
 * The field list is data rather than markup so the form, its validation and
 * the address printed back on the confirmation all read from one description.
 * Adding a field is a line here, not three edits that can fall out of step.
 */

export const COUNTRIES = [
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'IE', label: 'Ireland' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'AL', label: 'Albania' },
  { code: 'AU', label: 'Australia' },
];

export const DEFAULT_COUNTRY = 'US';

// Deliberately permissive: it rejects what is plainly not an address — no @,
// nothing before or after it, a bare domain — and leaves the rest alone. A
// stricter pattern buys nothing without a backend to confirm the address and
// starts costing real shoppers with unusual but valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Alphanumeric, optionally broken by one space or dash. Covers "94103",
// "SW1A 1AA" and "K1A 0B1" without pretending to know each country's rules.
const POSTAL_PATTERN = /^[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/;

const DIGITS = /\d/g;

/**
 * Every field on the details step, in the order it is asked for.
 * `width` is a layout hint the form reads; everything else is validation.
 */
export const DETAILS_FIELDS = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    group: 'contact',
    width: 'full',
    required: true,
    hint: 'Your order confirmation goes here.',
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    autoComplete: 'tel',
    group: 'contact',
    width: 'full',
    required: false,
    hint: 'Optional — for delivery updates only.',
  },
  {
    name: 'firstName',
    label: 'First name',
    type: 'text',
    autoComplete: 'given-name',
    group: 'address',
    width: 'half',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last name',
    type: 'text',
    autoComplete: 'family-name',
    group: 'address',
    width: 'half',
    required: true,
  },
  {
    name: 'address1',
    label: 'Address',
    type: 'text',
    autoComplete: 'address-line1',
    group: 'address',
    width: 'full',
    required: true,
  },
  {
    name: 'address2',
    label: 'Apartment, suite, etc.',
    type: 'text',
    autoComplete: 'address-line2',
    group: 'address',
    width: 'full',
    required: false,
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    autoComplete: 'address-level2',
    group: 'address',
    width: 'half',
    required: true,
  },
  {
    name: 'region',
    label: 'State / Province',
    type: 'text',
    autoComplete: 'address-level1',
    group: 'address',
    width: 'half',
    required: true,
  },
  {
    name: 'postalCode',
    label: 'Postal code',
    type: 'text',
    autoComplete: 'postal-code',
    group: 'address',
    width: 'half',
    required: true,
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    autoComplete: 'country',
    group: 'address',
    width: 'half',
    required: true,
    options: COUNTRIES.map(({ code, label }) => ({ value: code, label })),
  },
];

/** A blank form, with the one field that has a sensible default filled in. */
export const emptyDetails = () =>
  Object.fromEntries(
    DETAILS_FIELDS.map((field) => [
      field.name,
      field.name === 'country' ? DEFAULT_COUNTRY : '',
    ])
  );

const trim = (value) => String(value ?? '').trim();

/**
 * Checks one field's value.
 * @param {Object} field - The field description from `DETAILS_FIELDS`.
 * @param {string} value - What the shopper typed.
 * @returns {string} An error message, or an empty string when the value is fine.
 */
export const validateField = (field, value) => {
  if (!field) return '';

  const trimmed = trim(value);

  if (!trimmed) {
    // An optional field left blank is not an error; it is a field left blank.
    return field.required ? `${field.label} is required.` : '';
  }

  switch (field.name) {
    case 'email':
      return EMAIL_PATTERN.test(trimmed) ? '' : 'Enter a valid email address.';
    case 'phone':
      // Counting digits rather than matching a shape: phone numbers are
      // written a dozen ways and only the digit count is meaningfully wrong.
      return (trimmed.match(DIGITS) ?? []).length >= 7
        ? ''
        : 'Enter a valid phone number.';
    case 'postalCode':
      return POSTAL_PATTERN.test(trimmed) ? '' : 'Enter a valid postal code.';
    case 'country':
      return COUNTRIES.some((country) => country.code === trimmed)
        ? ''
        : 'Choose a country.';
    default:
      return '';
  }
};

/**
 * Checks the whole details form.
 * @param {Object} [values={}] - The current form values.
 * @returns {Object<string, string>} Field name to error message, for failing fields only.
 */
export const validateDetails = (values = {}) =>
  Object.fromEntries(
    DETAILS_FIELDS.map((field) => [field.name, validateField(field, values[field.name])])
      .filter(([, message]) => message)
  );

/**
 * Formats an address for display, dropping the lines that were left blank.
 * @param {Object} [values={}] - The submitted details.
 * @returns {string[]} The address, one entry per line.
 */
export const formatAddressLines = (values = {}) => {
  const country = COUNTRIES.find((entry) => entry.code === values.country);

  return [
    [trim(values.firstName), trim(values.lastName)].filter(Boolean).join(' '),
    trim(values.address1),
    trim(values.address2),
    [trim(values.city), trim(values.region), trim(values.postalCode)]
      .filter(Boolean)
      .join(', '),
    country?.label ?? trim(values.country),
  ].filter(Boolean);
};
