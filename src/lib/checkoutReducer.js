/**
 * Checkout form state transitions.
 *
 * Kept apart from the page for the same reason `cartReducer` is: the rules
 * about when an error is allowed to appear are worth testing directly rather
 * than through a rendered form.
 *
 * The rule: a field says nothing until the shopper has left it once.
 * Complaining about an incomplete email halfway through typing it is noise, but
 * going quiet the moment it becomes valid is not. Submitting asks for
 * everything at once, so after a failed submit every field may speak.
 */
import { DEFAULT_SHIPPING_METHOD_ID } from './checkout';
import { DETAILS_FIELDS, emptyDetails, validateDetails, validateField } from './checkoutForm';

const fieldsByName = new Map(DETAILS_FIELDS.map((field) => [field.name, field]));

export const initialCheckoutState = {
  details: emptyDetails(),
  /** Only failing fields appear here. */
  errors: {},
  /** Fields the shopper has left at least once. */
  touched: {},
  shippingMethodId: DEFAULT_SHIPPING_METHOD_ID,
  isPlacing: false,
};

const withError = (errors, name, message) => {
  if (message) return { ...errors, [name]: message };
  if (!(name in errors)) return errors;

  const { [name]: _cleared, ...rest } = errors;
  return rest;
};

const allTouched = () =>
  Object.fromEntries(DETAILS_FIELDS.map((field) => [field.name, true]));

/**
 * @param {Object} state - Current checkout state.
 * @param {{type: string, payload?: any}} action - The action to apply.
 * @returns {Object} The next checkout state.
 */
export const checkoutReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD': {
      const { name, value } = action.payload;
      const details = { ...state.details, [name]: value };

      // Untouched fields stay silent; touched ones update as they are fixed.
      if (!state.touched[name]) return { ...state, details };

      return {
        ...state,
        details,
        errors: withError(state.errors, name, validateField(fieldsByName.get(name), value)),
      };
    }

    case 'BLUR_FIELD': {
      const name = action.payload;
      if (!fieldsByName.has(name)) return state;

      return {
        ...state,
        touched: { ...state.touched, [name]: true },
        errors: withError(
          state.errors,
          name,
          validateField(fieldsByName.get(name), state.details[name])
        ),
      };
    }

    // Whether the order may now be placed is the page's call; this only
    // records what the form has to say about itself. Both go through the same
    // `validateDetails`, so they cannot disagree.
    case 'SUBMIT':
      return { ...state, errors: validateDetails(state.details), touched: allTouched() };

    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethodId: action.payload };

    // One-way: the page navigates to the confirmation when the order lands, so
    // nothing ever unsets this.
    case 'PLACE_ORDER':
      return { ...state, isPlacing: true };

    default:
      return state;
  }
};

/**
 * The first field, in the order they are asked for, that is currently failing.
 * A failed submit sends focus here — on a form this long the error nearest the
 * top is usually off-screen, and a page that simply refuses to submit without
 * moving looks broken.
 * @param {Object} [errors={}] - The current errors.
 * @returns {string|undefined} The field name, when anything is failing.
 */
export const firstInvalidField = (errors = {}) =>
  DETAILS_FIELDS.find((field) => errors[field.name])?.name;
