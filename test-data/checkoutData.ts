import { faker } from '@faker-js/faker';

export type CheckoutInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

/** Builds a fresh set of random checkout details. Override any field you need. */
export function generateCheckoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    ...overrides,
  };
}

/** Same shape as before, so existing specs keep working. `valid` returns new random data on each access. */
export const checkoutInfo = {
  get valid(): CheckoutInfo {
    return generateCheckoutInfo();
  },
};

export const checkoutErrors = {
  firstNameRequired: 'First Name is required',
  lastNameRequired: 'Last Name is required',
  postalCodeRequired: 'Postal Code is required',
} as const;

export const ORDER_CONFIRMATION = 'Thank you for your order!';