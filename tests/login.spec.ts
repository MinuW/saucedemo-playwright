import { test, expect } from '../fixtures/pageFixtures';
import { users, loginErrors } from '../test-data/users';
import { test as baseTest } from '@playwright/test';


// Login tests must start logged out, so ignore the saved session
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await expect(loginPage.errorMessage).toContainText(loginErrors.lockedOut);
  });

  test('wrong password shows an error', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toContainText(loginErrors.invalidCredentials);
  });

  test('empty username shows a required-field error', async ({ loginPage }) => {
    await loginPage.passwordInput.fill(users.standard.password);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toContainText(loginErrors.usernameRequired);
  });

  test('empty password shows a required-field error', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(users.standard.username);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toContainText(loginErrors.passwordRequired);
  });

  test('logged in user can log out', async ({ loginPage, header }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await header.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
