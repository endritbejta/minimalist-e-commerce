import { describe, expect, it } from 'vitest';
import { checkoutReducer, firstInvalidField, initialCheckoutState } from './checkoutReducer';

const VALID_DETAILS = {
  email: 'sam@example.com',
  phone: '',
  firstName: 'Sam',
  lastName: 'Okafor',
  address1: '12 Blackfriars Road',
  address2: '',
  city: 'London',
  region: 'Greater London',
  postalCode: 'SE1 8NY',
  country: 'GB',
};

const completed = () => ({ ...initialCheckoutState, details: VALID_DETAILS });

const setField = (state, name, value) =>
  checkoutReducer(state, { type: 'SET_FIELD', payload: { name, value } });

const blur = (state, name) => checkoutReducer(state, { type: 'BLUR_FIELD', payload: name });

describe('typing into a field', () => {
  it('says nothing about a field that has not been left yet', () => {
    const state = setField(initialCheckoutState, 'email', 'sa');

    expect(state.details.email).toBe('sa');
    expect(state.errors).toEqual({});
  });

  it('speaks up once the field has been left', () => {
    const state = blur(setField(initialCheckoutState, 'email', 'sa'), 'email');

    expect(state.errors.email).toMatch(/valid email/i);
  });

  it('goes quiet again as soon as the value becomes valid', () => {
    const flagged = blur(setField(initialCheckoutState, 'email', 'sa'), 'email');
    const fixed = setField(flagged, 'email', 'sam@example.com');

    expect(fixed.errors).toEqual({});
  });

  it('ignores a field it does not know', () => {
    expect(blur(initialCheckoutState, 'cardNumber')).toBe(initialCheckoutState);
  });
});

describe('submitting', () => {
  it('reports everything that is wrong with an empty form', () => {
    const state = checkoutReducer(initialCheckoutState, { type: 'SUBMIT' });

    expect(Object.keys(state.errors).length).toBeGreaterThan(0);
  });

  it('marks every field touched, so all of them can speak', () => {
    const state = checkoutReducer(initialCheckoutState, { type: 'SUBMIT' });

    expect(state.touched.email).toBe(true);
    expect(state.touched.postalCode).toBe(true);
  });

  it('reports nothing wrong with a complete form', () => {
    expect(checkoutReducer(completed(), { type: 'SUBMIT' }).errors).toEqual({});
  });

  it('does not treat a blank optional field as an error', () => {
    const state = checkoutReducer(
      { ...completed(), details: { ...VALID_DETAILS, phone: '', address2: '' } },
      { type: 'SUBMIT' }
    );

    expect(state.errors).toEqual({});
  });

  it('clears errors that a later edit fixed', () => {
    const failed = checkoutReducer(initialCheckoutState, { type: 'SUBMIT' });
    const fixed = checkoutReducer(
      { ...failed, details: VALID_DETAILS },
      { type: 'SUBMIT' }
    );

    expect(fixed.errors).toEqual({});
  });
});

describe('firstInvalidField', () => {
  it('picks the earliest failing field in the order they are asked for', () => {
    // Not whichever key happens to come first out of the errors object: the
    // shopper is sent to the one nearest the top of the form.
    expect(firstInvalidField({ city: 'x', email: 'x' })).toBe('email');
    expect(firstInvalidField({ postalCode: 'x', firstName: 'x' })).toBe('firstName');
  });

  it('finds nothing when the form is clean', () => {
    expect(firstInvalidField({})).toBeUndefined();
    expect(firstInvalidField()).toBeUndefined();
  });

  it('ignores a key that is not a field on the form', () => {
    expect(firstInvalidField({ cardNumber: 'x' })).toBeUndefined();
  });
});

describe('delivery method', () => {
  it('starts on the default and takes a new choice', () => {
    expect(initialCheckoutState.shippingMethodId).toBe('standard');

    const state = checkoutReducer(initialCheckoutState, {
      type: 'SET_SHIPPING_METHOD',
      payload: 'overnight',
    });

    expect(state.shippingMethodId).toBe('overnight');
  });
});

describe('placing', () => {
  it('marks the order as being placed', () => {
    expect(initialCheckoutState.isPlacing).toBe(false);
    expect(checkoutReducer(initialCheckoutState, { type: 'PLACE_ORDER' }).isPlacing).toBe(true);
  });
});

describe('an unknown action', () => {
  it('changes nothing', () => {
    expect(checkoutReducer(initialCheckoutState, { type: 'PAY_WITH_CARD' }))
      .toBe(initialCheckoutState);
  });
});
