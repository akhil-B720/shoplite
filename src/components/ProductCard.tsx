import React, { useState } from 'react';
import {
  Laptop,
  Headphones,
  Monitor,
  Keyboard,
  Mouse,
  Tv,
  HardDrive,
  Package,
  Plus,
  Check,
  Ban,
} from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

/**
 * Returns a fitting, clean vector icon based on product title / category.
 */
function getProductIcon(name: string, category?: string) {
  const query = `${name} ${category || ''}`.toLowerCase();
  if (query.includes('laptop') || query.includes('notebook')) return Laptop;
  if (query.includes('headphone') || query.includes('earbud') || query.includes('audio')) return Headphones;
  if (query.includes('monitor') || query.includes('display')) return Monitor;
  if (query.includes('keyboard')) return Keyboard;
  if (query.includes('mouse')) return Mouse;
  if (query.includes('tv') || query.includes('screen')) return Tv;
  if (query.includes('hub') || query.includes('drive') || query.includes('storage')) return HardDrive;
  return Package;
}

/**
 * Currency formatter for consistent display (INR/Rupees standard to match ₹55,000 / ₹2,000 in prompt).
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [justAdded, setJustAdded] = useState(false);
  const IconComponent = getProductIcon(product.name, product.category);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className={`product-card ${!product.inStock ? 'is-out-of-stock' : ''}`}>
      {/* Product Image / Illustration Canvas */}
      <div className="product-media-wrapper">
        <div className="product-media-canvas">
          <IconComponent size={48} className="product-media-icon" strokeWidth={1.5} />
        </div>
        <div className="product-media-tags">
          {product.category && (
            <span className="product-category-tag">{product.category}</span>
          )}
          <span className={`stock-badge ${product.inStock ? 'stock-in' : 'stock-out'}`}>
            <span className="stock-dot" />
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-body">
        <div className="product-title-row">
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
          <span className="product-id-tag">#{product.id}</span>
        </div>

        <p className="product-description">
          {product.description || 'Verified hardware catalog item provided via EXORA mock simulation.'}
        </p>

        <div className="product-footer">
          <div className="price-block">
            <span className="price-label">Price</span>
            <span className="price-value">{formatPrice(product.price)}</span>
          </div>

          <button
            type="button"
            className={`btn-add-cart ${justAdded ? 'btn-added' : ''} ${
              !product.inStock ? 'btn-disabled' : ''
            }`}
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={
              !product.inStock
                ? `${product.name} is out of stock`
                : justAdded
                ? `Added ${product.name} to cart`
                : `Add ${product.name} to cart`
            }
          >
            {!product.inStock ? (
              <>
                <Ban size={15} />
                <span>Unavailable</span>
              </>
            ) : justAdded ? (
              <>
                <Check size={15} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
