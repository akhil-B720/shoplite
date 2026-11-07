import React from 'react';
import { Wifi, WifiOff, RefreshCw, Sparkles } from 'lucide-react';
import type { ApiStatus } from '../types/product';

interface StatusIndicatorProps {
  status: ApiStatus;
  isFallback: boolean;
  onOpenDetails: () => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  isFallback,
  onOpenDetails,
}) => {
  let badgeClass = 'status-connected';
  let label = 'API Connected';
  let Icon = Wifi;

  if (status === 'loading') {
    badgeClass = 'status-loading';
    label = 'Connecting API...';
    Icon = RefreshCw;
  } else if (isFallback) {
    badgeClass = 'status-demo';
    label = 'Demo Fallback';
    Icon = Sparkles;
  } else if (status === 'error') {
    badgeClass = 'status-error';
    label = 'API Unavailable';
    Icon = WifiOff;
  }

  return (
    <button
      type="button"
      className={`status-pill ${badgeClass}`}
      onClick={onOpenDetails}
      title="Click to view EXORA API connection details"
      aria-label={`API Status: ${label}`}
    >
      <span className="status-dot-wrapper">
        <span className="status-dot"></span>
        <span className="status-ping"></span>
      </span>
      <Icon size={14} className={status === 'loading' ? 'spin-icon' : ''} />
      <span className="status-text">{label}</span>
    </button>
  );
};
