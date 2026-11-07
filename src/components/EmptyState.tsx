import React from 'react';
import { PackageOpen, RotateCcw, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  hasSearchFilter: boolean;
  searchQuery?: string;
  onResetFilters: () => void;
  onLoadFallback?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchFilter,
  searchQuery,
  onResetFilters,
  onLoadFallback,
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-icon-circle">
        <PackageOpen size={36} className="empty-icon" />
      </div>

      <h3 className="empty-heading">No products available</h3>

      <p className="empty-description">
        {hasSearchFilter ? (
          <>
            No items matched your current filter
            {searchQuery ? (
              <>
                {' '}for &ldquo;<strong>{searchQuery}</strong>&rdquo;
              </>
            ) : null}
            . Try clearing your filters to see all available items.
          </>
        ) : (
          'The EXORA mock service returned an empty products collection []. You can add mock products in EXORA or populate demo data.'
        )}
      </p>

      <div className="empty-actions">
        {hasSearchFilter ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
          >
            <RotateCcw size={15} />
            <span>Clear Filters</span>
          </button>
        ) : (
          onLoadFallback && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onLoadFallback}
            >
              <Sparkles size={15} />
              <span>Load Demo Products</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
