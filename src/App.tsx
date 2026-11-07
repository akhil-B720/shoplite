import { useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, Order, ApiStatus } from './types/product';
import { fetchProducts, getProductsApiUrl, API_CONFIG } from './services/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { CartDrawer } from './components/CartDrawer';
import { OrdersModal } from './components/OrdersModal';
import { ApiInfoModal } from './components/ApiInfoModal';
import { Footer } from './components/Footer';
import './App.css';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [endpointUrl, setEndpointUrl] = useState<string>(getProductsApiUrl());

  // UI state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [isApiInfoOpen, setIsApiInfoOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart & Orders state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shoplite_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shoplite_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart & orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shoplite_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shoplite_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /**
   * Primary API fetching logic.
   * Real API integration is the primary architecture.
   */
  const loadProducts = useCallback(async (opts?: { useFallback?: boolean }) => {
    setApiStatus('loading');
    setErrorMessage('');

    try {
      const result = await fetchProducts({
        useFallback: opts?.useFallback,
      });

      setProducts(result.products);
      setIsFallback(result.isFallback);
      setEndpointUrl(result.endpoint);
      setApiStatus('connected');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred';
      setErrorMessage(msg);
      setApiStatus('error');
      setProducts([]);
    }
  }, []);

  // Initial load: Attempt real connection to EXORA API
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (id: number | string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `EX-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cartItems],
      subtotal: total,
      total,
      status: 'Confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrdersOpen(true);
    showToast(`Order ${newOrder.id} confirmed!`);
  };

  const handleScrollToProducts = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <Header
        apiStatus={apiStatus}
        isFallback={isFallback}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemCount={totalCartCount}
        orderCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenApiInfo={() => setIsApiInfoOpen(true)}
        onScrollToProducts={handleScrollToProducts}
      />

      {/* Hero Section */}
      <main className="main-content">
        <Hero
          onBrowseClick={handleScrollToProducts}
          onOpenApiInfo={() => setIsApiInfoOpen(true)}
          apiEndpoint={`GET ${API_CONFIG.productsEndpoint}`}
          isApiConnected={apiStatus === 'connected'}
        />

        {/* Product Catalog Section with Loading, Error, Empty, or Products */}
        <ProductSection
          products={products}
          apiStatus={apiStatus}
          errorMessage={errorMessage}
          endpointUrl={endpointUrl}
          isFallback={isFallback}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onRefresh={() => loadProducts({ useFallback: false })}
          onUseFallback={() => loadProducts({ useFallback: true })}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Footer */}
      <Footer
        onScrollToProducts={handleScrollToProducts}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenApiInfo={() => setIsApiInfoOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* Orders Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onStartShopping={handleScrollToProducts}
      />

      {/* API Details & Simulation Settings Modal */}
      <ApiInfoModal
        isOpen={isApiInfoOpen}
        onClose={() => setIsApiInfoOpen(false)}
        apiStatus={apiStatus}
        isFallback={isFallback}
        endpointUrl={endpointUrl}
        errorMessage={errorMessage}
        onRetry={() => loadProducts({ useFallback: false })}
        onToggleFallback={(enableFallback) =>
          loadProducts({ useFallback: enableFallback })
        }
      />
    </div>
  );
}

export default App;
