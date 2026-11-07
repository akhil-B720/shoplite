import React from 'react';
import { ArrowDown, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onBrowseClick: () => void;
  onOpenApiInfo: () => void;
  apiEndpoint: string;
  isApiConnected: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onBrowseClick,
  onOpenApiInfo,
  apiEndpoint,
  isApiConnected,
}) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-pill">
          <Zap size={14} className="hero-pill-icon" />
          <span>API Simulation Client Example</span>
        </div>

        <h1 className="hero-heading">
          Everything you need, <br className="hero-break" />
          <span className="hero-highlight">in one place.</span>
        </h1>

        <p className="hero-subheading">
          A realistic e-commerce frontend demonstrating standalone client architecture.
          All product data, inventory status, and prices are dynamically fetched from
          mock REST APIs simulated by <strong>EXORA</strong>.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onBrowseClick}
          >
            <span>Browse Products</span>
            <ArrowDown size={16} />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenApiInfo}
          >
            <span>API Architecture</span>
            <span className={`inline-dot ${isApiConnected ? 'dot-green' : 'dot-amber'}`} />
          </button>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-icon-box">
              <Cpu size={16} />
            </div>
            <div className="feature-text">
              <div className="feature-title">EXORA Mock Engine</div>
              <div className="feature-desc">Consuming {apiEndpoint}</div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <ShieldCheck size={16} />
            </div>
            <div className="feature-text">
              <div className="feature-title">Backend-Independent</div>
              <div className="feature-desc">Clean contract & typed models</div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <Zap size={16} />
            </div>
            <div className="feature-text">
              <div className="feature-title">Reactive Client</div>
              <div className="feature-desc">Live cart, search & filters</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
