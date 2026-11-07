import type { Product, ProductsApiResponse } from '../types/product';
import { FALLBACK_PRODUCTS } from './mockData';

/**
 * API configuration for EXORA mock service integration.
 * The endpoint path and base URL are isolated here for easy modification.
 */
export const API_CONFIG = {
  // Reads from Vite environment variable VITE_API_BASE_URL (defaults to http://localhost:8080)
  baseUrl: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, ''),
  
  // Endpoint path for retrieving mock products from EXORA
  productsEndpoint: '/mock/products',
  
  // Default request timeout in milliseconds
  timeoutMs: 6000,
};

/**
 * Returns the fully qualified URL for product requests.
 */
export function getProductsApiUrl(customBaseUrl?: string, customEndpoint?: string): string {
  const base = (customBaseUrl || API_CONFIG.baseUrl).replace(/\/$/, '');
  const endpoint = customEndpoint || API_CONFIG.productsEndpoint;
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${formattedEndpoint}`;
}

export interface FetchProductsResult {
  products: Product[];
  isFallback: boolean;
  endpoint: string;
}

/**
 * Retrieves products via fetch() from the configured EXORA mock API.
 * Real API integration is the primary architecture.
 *
 * @param options.useFallback - Optional flag to force local demo/fallback data
 * @param options.customBaseUrl - Optional runtime override for API base URL
 * @param options.signal - AbortSignal for aborting in-flight requests
 */
export async function fetchProducts(options?: {
  useFallback?: boolean;
  customBaseUrl?: string;
  signal?: AbortSignal;
}): Promise<FetchProductsResult> {
  // If explicitly requested to use fallback mode, return mock data immediately
  if (options?.useFallback) {
    // Artificial small delay to make state transitions feel natural
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      products: [...FALLBACK_PRODUCTS],
      isFallback: true,
      endpoint: 'Local Fallback (Demo Mode)',
    };
  }

  const endpointUrl = getProductsApiUrl(options?.customBaseUrl);

  // Setup abort controller for timeout if no signal is provided
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);
  const signal = options?.signal || controller.signal;

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with HTTP ${response.status}: ${response.statusText}`);
    }

    const data: unknown = await response.json();

    // Support standard EXORA response { products: [...] } or direct array [...]
    let productsList: Product[] = [];

    if (data && typeof data === 'object') {
      const apiResponse = data as Partial<ProductsApiResponse> & { [key: string]: unknown };
      if (Array.isArray(apiResponse.products)) {
        productsList = apiResponse.products;
      } else if (Array.isArray(data)) {
        productsList = data as Product[];
      } else {
        throw new Error('Invalid response structure: expected a "products" array');
      }
    } else {
      throw new Error('Invalid JSON received from mock API');
    }

    return {
      products: productsList,
      isFallback: false,
      endpoint: endpointUrl,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Connection timed out after ${API_CONFIG.timeoutMs}ms trying to reach ${endpointUrl}`);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to EXORA at ${endpointUrl}. Verify the server is running.`);
    }

    throw error;
  }
}

/**
 * Returns isolated fallback products for standalone testing.
 */
export function getFallbackProducts(): Product[] {
  return [...FALLBACK_PRODUCTS];
}
