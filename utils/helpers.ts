/** "Sauce Labs Backpack" -> "sauce-labs-backpack" (matches Sauce Demo's add-to-cart / remove data-test ids) */
export function toSlug(productName: string): string {
  return productName.toLowerCase().replace(/ /g, '-');
}

/** "Item total: $29.99" -> 29.99 */
export function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
