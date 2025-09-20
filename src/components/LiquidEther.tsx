import React from 'react';

const LiquidEther: React.FC = () => {
  return (
    <div className="liquid-ether-container">
      {/* Main animated background */}
      <div className="liquid-ether-bg">
        {/* Multiple animated blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
      </div>
      
      {/* Overlay gradient */}
      <div className="liquid-overlay"></div>
      
      {/* Additional animated elements */}
      <div className="ether-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>
      
      {/* Debug element to make sure component is rendering */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        padding: '5px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        Liquid Ether Loaded
      </div>
    </div>
  );
};

export default LiquidEther; 