import { test as setup, expect } from "../fixtures/pageFixtures";
import { users, authFile } from "../test-data/users";

setup(
  "log in as standard user and save session",
  async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(inventoryPage.title).toHaveText("Products");

    await page.context().storageState({ path: authFile });
  },
);
