import type { Product } from '../types/product';

/**
 * Fallback / Demo mock products dataset.
 * Used when EXORA is not yet running, or for instant local demonstrations.
 * Contains the sample products expected from the EXORA mock API simulation.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 55000,
    inStock: true,
    description: 'High-performance ultra-thin laptop with 16GB RAM and fast NVMe storage.',
    category: 'Computers',
  },
  {
    id: 2,
    name: 'Headphones',
    price: 2000,
    inStock: true,
    description: 'Comfortable over-ear studio headphones with crisp audio and deep bass.',
    category: 'Audio',
  },
  {
    id: 3,
    name: '4K Ultra-Slim Monitor',
    price: 28500,
    inStock: true,
    description: '27-inch 4K IPS display with 99% sRGB color accuracy and USB-C connectivity.',
    category: 'Displays',
  },
  {
    id: 4,
    name: 'Mechanical Gaming Keyboard',
    price: 4500,
    inStock: true,
    description: 'Tenkeyless RGB mechanical keyboard with tactile hot-swappable switches.',
    category: 'Accessories',
  },
  {
    id: 5,
    name: 'Ergonomic Wireless Mouse',
    price: 1800,
    inStock: true,
    description: 'Precision wireless optical mouse with ergonomic grip and rechargeable battery.',
    category: 'Accessories',
  },
  {
    id: 6,
    name: 'Active Noise-Cancelling Earbuds',
    price: 6999,
    inStock: false,
    description: 'Compact wireless earbuds with hybrid noise cancellation and 24h battery life.',
    category: 'Audio',
  },
  {
    id: 7,
    name: 'USB-C Multiport Hub',
    price: 2499,
    inStock: true,
    description: '7-in-1 aluminum hub with 4K HDMI, USB 3.0 ports, and 100W Power Delivery.',
    category: 'Accessories',
  },
  {
    id: 8,
    name: 'Aluminum Laptop Stand',
    price: 1599,
    inStock: true,
    description: 'Adjustable ergonomic aluminum riser for better posture and airflow cooling.',
    category: 'Accessories',
  },
];
