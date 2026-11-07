export interface Product {
  id: number | string;
  name: string;
  price: number;
  inStock: boolean;
  description?: string;
  category?: string;
  image?: string;
}

export interface ProductsApiResponse {
  products: Product[];
  message?: string;
  total?: number;
}

export type ApiStatus = 'idle' | 'loading' | 'connected' | 'error';

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'Processing' | 'Confirmed' | 'Shipped';
}
