import React from 'react';
import { AlertCircle, RefreshCw, Sparkles, Terminal } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  endpointUrl: string;
  onRetry: () => void;
  onUseFallback: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  endpointUrl,
  onRetry,
  onUseFallback,
}) => {
  return (
    <div className="error-state-card" role="alert">
      <div className="error-icon-circle">
        <AlertCircle size={32} className="error-icon" />
      </div>

      <div className="error-content">
        <h2 className="error-heading">Unable to load products</h2>
        <p className="error-description">
          ShopLite could not fetch product data from the simulated API service.
          Make sure your EXORA mock server is running and accessible at the configured endpoint.
        </p>

        <div className="error-endpoint-box">
          <Terminal size={14} className="endpoint-icon" />
          <span className="endpoint-label">Attempted Endpoint:</span>
          <code className="endpoint-code">{endpointUrl}</code>
        </div>

        {errorMessage && (
          <div className="error-detail-msg">
            <strong>Detail:</strong> {errorMessage}
          </div>
        )}

        <div className="error-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onRetry}
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onUseFallback}
            title="Load built-in mock products to test the UI without EXORA running"
          >
            <Sparkles size={16} />
            <span>Load Demo Mock Data</span>
          </button>
        </div>

        <div className="error-hint">
          <span>💡 <strong>Quick Fix:</strong> Start your EXORA platform on <code>localhost:8080</code> or configure <code>VITE_API_BASE_URL</code> in your <code>.env</code> file. Alternatively, click "Load Demo Mock Data" above to explore the interface right away.</span>
        </div>
      </div>
    </div>
  );
};
