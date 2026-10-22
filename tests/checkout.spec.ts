import { test, expect } from '../fixtures/pageFixtures';
import { products } from '../test-data/products';
import { checkoutInfo, checkoutErrors } from '../test-data/checkoutData';

test.describe('Checkout', () => {
  // Every test starts on checkout step one with one item in the cart
  test.beforeEach(async ({ inventoryPage, header, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack.name);
    await header.openCart();
    await cartPage.checkout();
  });

  test('first name is required', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.fillInformation('', checkoutInfo.valid.lastName, checkoutInfo.valid.postalCode);
    await checkoutInfoPage.continue();
    await expect(checkoutInfoPage.errorMessage).toContainText(checkoutErrors.firstNameRequired);
  });

  test('last name is required', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.fillInformation(checkoutInfo.valid.firstName, '', checkoutInfo.valid.postalCode);
    await checkoutInfoPage.continue();
    await expect(checkoutInfoPage.errorMessage).toContainText(checkoutErrors.lastNameRequired);
  });

  test('postal code is required', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.fillInformation(checkoutInfo.valid.firstName, checkoutInfo.valid.lastName, '');
    await checkoutInfoPage.continue();
    await expect(checkoutInfoPage.errorMessage).toContainText(checkoutErrors.postalCodeRequired);
  });

  test('cancel returns to the cart', async ({ checkoutInfoPage, page }) => {
    await checkoutInfoPage.cancel();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('overview shows the correct totals', async ({ checkoutInfoPage, checkoutOverviewPage }) => {
    const { firstName, lastName, postalCode } = checkoutInfo.valid;
    await checkoutInfoPage.fillInformation(firstName, lastName, postalCode);
    await checkoutInfoPage.continue();

    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();

    expect(subtotal).toBe(products.backpack.price);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});
