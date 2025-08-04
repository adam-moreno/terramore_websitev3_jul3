"use client"

import React, { useState, useEffect } from 'react';

interface TerramoreVideoSimpleProps {
  aspectRatio?: '16:9' | '14:9';
  className?: string;
}

export const TerramoreVideoSimple: React.FC<TerramoreVideoSimpleProps> = ({ 
  aspectRatio = '16:9',
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  // Show video after a short delay to allow other content to load first
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 100); // Small delay to prioritize other content

    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg shadow-xl ${className}`}
      style={{
        aspectRatio: aspectRatio === '16:9' ? '16/9' : '14/9',
      }}
    >
      {/* Loading Skeleton Animation */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="text-gray-500 text-sm font-medium">Loading video...</div>
            </div>
          </div>
        </div>
      )}

      {/* Loom Video Embed */}
      {showVideo && (
        <iframe
          src="https://www.loom.com/embed/bfc03194f27c4d75b6f17de144030128?sid=5a4754e8-6663-4b8d-81f8-a65b238d597a"
          frameBorder="0"
          className={`w-full h-full rounded-lg transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          title="Terramore Introduction Video"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleIframeLoad}
          loading="lazy"
        />
      )}
    </div>
  );
}; 