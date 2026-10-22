import { test, expect } from "../fixtures/pageFixtures";
import { products, PRODUCT_COUNT } from "../test-data/products";

test.describe("Inventory", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test("lists all products", { tag: "@smoke" }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(PRODUCT_COUNT);
  });

  test("adding a product updates the cart badge", async ({
    inventoryPage,
    header,
  }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await expect(header.cartBadge).toHaveText("1");
  });

  test("removing a product clears the cart badge", async ({
    inventoryPage,
    header,
  }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.removeFromCart(products.backpack.name);
    await expect(header.cartBadge).toBeHidden();
  });

  test("opens the product details page", async ({
    inventoryPage,
    productDetailsPage,
  }) => {
    await inventoryPage.openProduct(products.bikeLight.name);
    await expect(productDetailsPage.name).toHaveText(products.bikeLight.name);
    await expect(productDetailsPage.price).toHaveText(
      `$${products.bikeLight.price}`,
    );
  });
});
