import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem } from '../types/product';
import { formatPrice } from './ProductCard';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number | string, delta: number) => void;
  onRemoveItem: (id: number | string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping for demo
  const grandTotal = subtotal + shipping;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} className="drawer-icon" />
            <h2 className="drawer-title">Shopping Cart</h2>
            <span className="drawer-count-pill">{totalItems} items</span>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-view">
              <ShoppingBag size={48} className="cart-empty-icon" />
              <h3>Your cart is empty</h3>
              <p>Explore the catalog and add products to start shopping.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onClose}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <ul className="cart-item-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item-row">
                  <div className="cart-item-info">
                    <div className="cart-item-title-row">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-unit-price">
                        {formatPrice(item.price)} each
                      </span>
                    </div>

                    <div className="cart-item-subline">
                      <span className="cart-item-category">
                        {item.category || 'Hardware'}
                      </span>
                      <span className="cart-item-total-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="cart-item-controls">
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="stepper-count">{item.quantity}</span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with summary and action */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-badge">FREE</span>
              </div>
              <div className="summary-row summary-grand-total">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="drawer-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={onCheckout}
              >
                <span>Checkout ({formatPrice(grandTotal)})</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-clear-cart"
                onClick={onClearCart}
              >
                Empty Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
