import React from 'react';
import { X, Network, RefreshCw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import type { ApiStatus } from '../types/product';
import { API_CONFIG } from '../services/api';

interface ApiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiStatus: ApiStatus;
  isFallback: boolean;
  endpointUrl: string;
  errorMessage: string;
  onRetry: () => void;
  onToggleFallback: (enableFallback: boolean) => void;
}

export const ApiInfoModal: React.FC<ApiInfoModalProps> = ({
  isOpen,
  onClose,
  apiStatus,
  isFallback,
  endpointUrl,
  errorMessage,
  onRetry,
  onToggleFallback,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel api-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Network size={20} className="modal-header-icon" />
            <h2 className="modal-title">EXORA API Architecture</h2>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close API info modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body api-modal-body">
          {/* Status Banner */}
          <div className={`api-status-banner banner-${apiStatus === 'connected' ? 'success' : isFallback ? 'demo' : 'error'}`}>
            <div className="banner-icon-wrap">
              {apiStatus === 'connected' ? (
                <CheckCircle2 size={18} />
              ) : isFallback ? (
                <Sparkles size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </div>
            <div className="banner-text">
              <strong>
                {apiStatus === 'connected'
                  ? 'Connected to EXORA API'
                  : isFallback
                  ? 'Running in Demo Fallback Mode'
                  : 'API Currently Unavailable'}
              </strong>
              <p>
                {apiStatus === 'connected'
                  ? 'Live REST API responses are currently being consumed from EXORA.'
                  : isFallback
                  ? 'Local mock products are active so you can evaluate the frontend independently.'
                  : errorMessage || 'Could not establish connection to the EXORA mock server.'}
              </p>
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="info-section">
            <h4 className="info-title">Configured Request Endpoint</h4>
            <div className="code-card">
              <div className="code-header">
                <span className="http-method">GET</span>
                <span className="code-endpoint">{endpointUrl}</span>
              </div>
              <div className="code-meta">
                <span>Base URL: <code>{API_CONFIG.baseUrl}</code></span>
                <span>Path: <code>{API_CONFIG.productsEndpoint}</code></span>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="info-section">
            <h4 className="info-title">Data Source Mode</h4>
            <div className="source-toggle-group">
              <button
                type="button"
                className={`toggle-option-btn ${!isFallback ? 'is-selected' : ''}`}
                onClick={() => onToggleFallback(false)}
              >
                <div className="toggle-btn-title">Primary: Live EXORA API</div>
                <div className="toggle-btn-sub">Fetches from {endpointUrl}</div>
              </button>

              <button
                type="button"
                className={`toggle-option-btn ${isFallback ? 'is-selected' : ''}`}
                onClick={() => onToggleFallback(true)}
              >
                <div className="toggle-btn-title">Standalone: Demo Fallback</div>
                <div className="toggle-btn-sub">Runs client-only without EXORA</div>
              </button>
            </div>
          </div>

          {/* Schema Explanation */}
          <div className="info-section">
            <h4 className="info-title">Expected EXORA JSON Contract</h4>
            <pre className="schema-pre">
{`{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 55000,
      "inStock": true
    },
    {
      "id": 2,
      "name": "Headphones",
      "price": 2000,
      "inStock": true
    }
  ]
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-doc-hint">
            <span>Environment key: <code>VITE_API_BASE_URL</code></span>
          </div>

          <div className="modal-footer-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onRetry();
                onClose();
              }}
            >
              <RefreshCw size={14} />
              <span>Retry Fetch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
