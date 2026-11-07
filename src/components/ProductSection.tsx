import React, { useMemo, useState } from 'react';
import { Filter, RefreshCw, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import type { Product, ApiStatus } from '../types/product';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface ProductSectionProps {
  products: Product[];
  apiStatus: ApiStatus;
  errorMessage: string;
  endpointUrl: string;
  isFallback: boolean;
  searchQuery: string;
  onClearSearch: () => void;
  onRefresh: () => void;
  onUseFallback: () => void;
  onAddToCart: (product: Product) => void;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  apiStatus,
  errorMessage,
  endpointUrl,
  isFallback,
  searchQuery,
  onClearSearch,
  onRefresh,
  onUseFallback,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Dynamically compute unique categories from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (onlyInStock && !p.inStock) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(query);
          const matchCat = p.category?.toLowerCase().includes(query);
          const matchDesc = p.description?.toLowerCase().includes(query);
          if (!matchName && !matchCat && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, onlyInStock, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setOnlyInStock(false);
    setSortBy('default');
    onClearSearch();
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || onlyInStock || Boolean(searchQuery.trim());

  return (
    <section id="products-catalog" className="product-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2 className="section-title">Catalog</h2>
            <p className="section-subtitle">
              Simulated items served dynamically from EXORA mock endpoint.
            </p>
          </div>

          <div className="section-actions-wrap">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onRefresh}
              disabled={apiStatus === 'loading'}
              title="Re-fetch products from EXORA"
            >
              <RefreshCw
                size={14}
                className={apiStatus === 'loading' ? 'spin-icon' : ''}
              />
              <span>Refresh API</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (only shown if not in error state) */}
        {apiStatus !== 'error' && (
          <div className="catalog-toolbar">
            {/* Category pills */}
            <div className="category-pills-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${selectedCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* In-Stock & Sorting Controls */}
            <div className="toolbar-controls">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
                <span className="checkbox-text">In Stock Only</span>
              </label>

              <div className="sort-select-wrapper">
                <SlidersHorizontal size={14} className="sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="sort-select"
                  aria-label="Sort products by"
                >
                  <option value="default">Default Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search / Filter summary pill */}
        {hasActiveFilters && apiStatus !== 'error' && apiStatus !== 'loading' && (
          <div className="active-filters-bar">
            <div className="filters-text">
              <Filter size={13} />
              <span>
                Showing <strong>{filteredProducts.length}</strong> of{' '}
                <strong>{products.length}</strong> products
              </span>
            </div>
            <button
              type="button"
              className="clear-filters-link"
              onClick={handleResetFilters}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Catalog Main Content: Loading, Error, Empty, or Product Grid */}
        <div className="catalog-content">
          {apiStatus === 'loading' ? (
            <LoadingSkeleton count={6} />
          ) : apiStatus === 'error' ? (
            <ErrorState
              errorMessage={errorMessage}
              endpointUrl={endpointUrl}
              onRetry={onRefresh}
              onUseFallback={onUseFallback}
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              hasSearchFilter={hasActiveFilters}
              searchQuery={searchQuery}
              onResetFilters={handleResetFilters}
              onLoadFallback={onUseFallback}
            />
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Source metadata footer note */}
        {apiStatus === 'connected' && (
          <div className="data-source-note">
            <CheckCircle2 size={14} className="note-icon" />
            <span>
              Connected to EXORA mock service at <code>{endpointUrl}</code>{' '}
              {isFallback && '(running in client-side fallback demo mode)'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
