import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { parsePrice, toSlug } from '../utils/helpers';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async getProductNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map(parsePrice);
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async addToCart(productName: string) {
    await this.page.getByTestId(`add-to-cart-${toSlug(productName)}`).click();
  }

  async removeFromCart(productName: string) {
    await this.page.getByTestId(`remove-${toSlug(productName)}`).click();
  }

  async openProduct(productName: string) {
    await this.itemNames.filter({ hasText: productName }).first().click();
    await this.page.getByTestId('back-to-products').waitFor();
  }
}
