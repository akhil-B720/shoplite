import React from 'react';
import { X, PackageCheck, ShoppingBag, CheckCircle } from 'lucide-react';
import type { Order } from '../types/product';
import { formatPrice } from './ProductCard';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onStartShopping: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onStartShopping,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel orders-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <PackageCheck size={20} className="modal-header-icon" />
            <h2 className="modal-title">Your Orders</h2>
            <span className="modal-count-pill">{orders.length}</span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close orders modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Orders list */}
        <div className="modal-body">
          {orders.length === 0 ? (
            <div className="orders-empty-view">
              <ShoppingBag size={44} className="orders-empty-icon" />
              <h3>No orders placed yet</h3>
              <p>Items checked out during this session will appear here as simulated confirmed orders.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onStartShopping();
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">Order {order.id}</span>
                      <span className="order-date">{order.createdAt}</span>
                    </div>
                    <span className="order-status-badge">
                      <CheckCircle size={13} />
                      <span>{order.status}</span>
                    </span>
                  </div>

                  <div className="order-items-list">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item-row">
                        <span className="order-item-qty">{item.quantity}×</span>
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-price">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span className="order-total-label">Total Amount</span>
                    <span className="order-total-value">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
