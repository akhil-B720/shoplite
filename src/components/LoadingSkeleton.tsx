import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="loading-state-container">
      <div className="loading-banner">
        <Loader2 size={18} className="spin-icon" />
        <span>Fetching live mock product catalog from EXORA...</span>
      </div>

      <div className="product-grid skeleton-grid">
        {items.map((key) => (
          <div key={key} className="product-card skeleton-card" aria-hidden="true">
            <div className="skeleton-media shimmer" />
            <div className="product-body">
              <div className="skeleton-line skeleton-title shimmer" />
              <div className="skeleton-line skeleton-text shimmer" />
              <div className="skeleton-line skeleton-text-short shimmer" />
              <div className="skeleton-footer">
                <div className="skeleton-price shimmer" />
                <div className="skeleton-btn shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
