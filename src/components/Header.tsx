import React from 'react';
import { ShoppingBag, Search, X, PackageCheck, ShoppingCart } from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';
import type { ApiStatus } from '../types/product';

interface HeaderProps {
  apiStatus: ApiStatus;
  isFallback: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemCount: number;
  orderCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenApiInfo: () => void;
  onScrollToProducts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  isFallback,
  searchQuery,
  onSearchChange,
  cartItemCount,
  orderCount,
  onOpenCart,
  onOpenOrders,
  onOpenApiInfo,
  onScrollToProducts,
}) => {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <div className="brand-group">
          <button
            type="button"
            className="brand-logo"
            onClick={onScrollToProducts}
            aria-label="ShopLite Home"
          >
            <div className="logo-icon-wrap">
              <ShoppingBag size={20} className="logo-icon" />
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">ShopLite</span>
              <span className="brand-badge">EXORA Client</span>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation & Actions */}
        <nav className="header-nav">
          <button
            type="button"
            className="nav-link-btn"
            onClick={onScrollToProducts}
          >
            Products
          </button>

          <button
            type="button"
            className="nav-link-btn"
            onClick={onOpenOrders}
            title="View placed orders"
          >
            <PackageCheck size={17} />
            <span>Orders</span>
            {orderCount > 0 && (
              <span className="nav-badge">{orderCount}</span>
            )}
          </button>

          <button
            type="button"
            className="cart-btn"
            onClick={onOpenCart}
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <ShoppingCart size={18} />
            <span className="cart-text">Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>

          {/* API Status Indicator */}
          <StatusIndicator
            status={apiStatus}
            isFallback={isFallback}
            onOpenDetails={onOpenApiInfo}
          />
        </nav>
      </div>
    </header>
  );
};
