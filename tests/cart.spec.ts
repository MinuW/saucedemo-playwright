import { test, expect } from '../fixtures/pageFixtures';
import { products } from '../test-data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('added product appears in the cart', { tag: '@smoke' }, async ({ inventoryPage, header, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await header.openCart();
    expect(await cartPage.getItemNames()).toEqual([products.backpack.name]);
  });

  test('removing a product leaves the others', async ({ inventoryPage, header, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.onesie.name);
    await header.openCart();

    await cartPage.removeItem(products.backpack.name);

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([products.onesie.name]);
  });

  test('continue shopping returns to the product list', async ({ header, cartPage, inventoryPage }) => {
    await header.openCart();
    await cartPage.continueShopping();
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('checkout button opens the information step', async ({ inventoryPage, header, cartPage, page }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await header.openCart();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
