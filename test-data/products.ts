import * as fs from 'fs';
import * as path from 'path';

export type Product = { name: string; price: number };

// Keep this list in sync with the "key" column in products.csv
export type ProductKey =
  | 'backpack'
  | 'bikeLight'
  | 'boltTShirt'
  | 'fleeceJacket'
  | 'onesie'
  | 'redTShirt';

function loadProducts(): Record<ProductKey, Product> {
  const filePath = path.join(__dirname, 'products.csv');
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, ''); // strip BOM Excel may add
  const [, ...rows] = raw.split(/\r?\n/).filter((line) => line.trim() !== ''); // skip header

  const result: Record<string, Product> = {};
  for (const row of rows) {
    const [key, name, price] = row.split(',').map((cell) => cell.trim());
    if (!key || !name || Number.isNaN(Number(price))) {
      throw new Error(`Invalid row in products.csv: "${row}"`);
    }
    result[key] = { name, price: Number(price) };
  }
  return result as Record<ProductKey, Product>;
}

export const products = loadProducts();
export const PRODUCT_COUNT = Object.keys(products).length;