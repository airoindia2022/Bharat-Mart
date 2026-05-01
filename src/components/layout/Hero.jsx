import React from 'react';
import { Search } from 'lucide-react';
import './Hero.css';

const Hero = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className="hero-text-content">
          <h1 className="hero-title">
            Your Gateway to <span className="highlight">Indian Commerce</span>
          </h1>
          <p className="hero-subtitle">
            Connecting premium buyers with verified manufacturers and trusted sellers across the nation.
          </p>
          
          <div className="hero-search-container">
            <form onSubmit={handleSearch} className="hero-search-form">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search products, brands or manufacturers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="hero-search-input"
                />
              </div>
              <button type="submit" className="hero-search-btn">
                Search
              </button>
            </form>
            <div className="hero-badges">
              <span className="badge">1M+ Products</span>
              <span className="badge">Verified Sellers</span>
              <span className="badge">Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
