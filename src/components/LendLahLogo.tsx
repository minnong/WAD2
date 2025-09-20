import React from 'react';

interface ShareLahLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ShareLahLogo: React.FC<ShareLahLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg relative ${className}`}>
      {/* Handshake Icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-white"
        fill="currentColor"
      >
        {/* Left hand/arm */}
        <path d="M4 14c0-1.1.9-2 2-2h2l2-2c.6-.6 1.4-1 2.2-1H14c.6 0 1 .4 1 1s-.4 1-1 1h-1.8c-.3 0-.6.1-.8.3L10 13h4c1.1 0 2 .9 2 2v1c0 .6-.4 1-1 1H6c-1.1 0-2-.9-2-2v-1z" />
        
        {/* Right hand/arm */}
        <path d="M20 10c0 1.1-.9 2-2 2h-2l-2 2c-.6.6-1.4 1-2.2 1H10c-.6 0-1-.4-1-1s.4-1 1-1h1.8c.3 0 .6-.1.8-.3L14 11h-4c-1.1 0-2-.9-2-2V8c0-.6.4-1 1-1h9c1.1 0 2 .9 2 2v1z" />
        
        {/* Connection/grip area */}
        <ellipse cx="12" cy="12" rx="1.5" ry="0.8" className="opacity-80" />
      </svg>
    </div>
  );
};

export default ShareLahLogo; 