import { describe, expect, it } from 'vitest';
import {
  DEFAULT_COUNTRY,
  DETAILS_FIELDS,
  emptyDetails,
  formatAddressLines,
  validateDetails,
  validateField,
} from './checkoutForm';

const VALID = {
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

const fieldNamed = (name) => DETAILS_FIELDS.find((field) => field.name === name);

describe('emptyDetails', () => {
  it('covers every field, with the country defaulted', () => {
    const blank = emptyDetails();

    expect(Object.keys(blank).sort()).toEqual(DETAILS_FIELDS.map((f) => f.name).sort());
    expect(blank.country).toBe(DEFAULT_COUNTRY);
    expect(blank.email).toBe('');
  });
});

describe('validateField', () => {
  it('requires the fields marked required', () => {
    expect(validateField(fieldNamed('firstName'), '')).toMatch(/required/i);
    expect(validateField(fieldNamed('firstName'), '   ')).toMatch(/required/i);
  });

  it('lets optional fields be left blank', () => {
    expect(validateField(fieldNamed('address2'), '')).toBe('');
    expect(validateField(fieldNamed('phone'), '')).toBe('');
  });

  it('still checks an optional field that was filled in', () => {
    expect(validateField(fieldNamed('phone'), '123')).toMatch(/valid phone/i);
    expect(validateField(fieldNamed('phone'), '+44 20 7946 0958')).toBe('');
  });

  it('accepts real email addresses and rejects what is plainly not one', () => {
    expect(validateField(fieldNamed('email'), 'sam@example.com')).toBe('');
    expect(validateField(fieldNamed('email'), 'sam.okafor+tag@sub.example.co.uk')).toBe('');
    expect(validateField(fieldNamed('email'), 'sam@example')).toMatch(/valid email/i);
    expect(validateField(fieldNamed('email'), 'example.com')).toMatch(/valid email/i);
    expect(validateField(fieldNamed('email'), 'sam @example.com')).toMatch(/valid email/i);
  });

  it('accepts postal codes from more than one country', () => {
    for (const code of ['94103', 'SW1A 1AA', 'K1A 0B1', '1010', '75-008']) {
      expect(validateField(fieldNamed('postalCode'), code)).toBe('');
    }

    expect(validateField(fieldNamed('postalCode'), '!!')).toMatch(/valid postal/i);
  });

  it('only accepts a country from the list', () => {
    expect(validateField(fieldNamed('country'), 'GB')).toBe('');
    expect(validateField(fieldNamed('country'), 'ZZ')).toMatch(/country/i);
  });

  it('ignores whitespace around an otherwise valid value', () => {
    expect(validateField(fieldNamed('email'), '  sam@example.com  ')).toBe('');
  });

  it('says nothing about a field it does not know', () => {
    expect(validateField(undefined, 'anything')).toBe('');
  });
});

describe('validateDetails', () => {
  it('reports nothing for a complete form', () => {
    expect(validateDetails(VALID)).toEqual({});
  });

  it('reports only the fields that actually fail', () => {
    const errors = validateDetails({ ...VALID, email: 'nope', city: '' });

    expect(Object.keys(errors).sort()).toEqual(['city', 'email']);
  });

  it('rejects an empty form', () => {
    expect(Object.keys(validateDetails(emptyDetails())).length).toBeGreaterThan(0);
    expect(Object.keys(validateDetails({})).length).toBeGreaterThan(0);
    expect(Object.keys(validateDetails()).length).toBeGreaterThan(0);
  });
});

describe('formatAddressLines', () => {
  it('names the country rather than its code', () => {
    expect(formatAddressLines(VALID)).toEqual([
      'Sam Okafor',
      '12 Blackfriars Road',
      'London, Greater London, SE1 8NY',
      'United Kingdom',
    ]);
  });

  it('keeps the second address line when there is one', () => {
    expect(formatAddressLines({ ...VALID, address2: 'Flat 4' })).toContain('Flat 4');
  });

  it('drops the lines that were left blank instead of printing gaps', () => {
    expect(formatAddressLines({ firstName: 'Sam', country: 'US' })).toEqual([
      'Sam',
      'United States',
    ]);
  });
});
