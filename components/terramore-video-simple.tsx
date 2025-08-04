"use client"

import React from 'react';

interface TerramoreVideoSimpleProps {
  aspectRatio?: '16:9' | '14:9';
  className?: string;
}

export const TerramoreVideoSimple: React.FC<TerramoreVideoSimpleProps> = ({ 
  aspectRatio = '16:9',
  className = ""
}) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-lg shadow-xl ${className}`}
      style={{
        aspectRatio: aspectRatio === '16:9' ? '16/9' : '14/9',
      }}
    >
      {/* Loom Video Embed */}
      <iframe
        src="https://www.loom.com/embed/bfc03194f27c4d75b6f17de144030128?sid=5a4754e8-6663-4b8d-81f8-a65b238d597a"
        frameBorder="0"
        className="w-full h-full rounded-lg"
        title="Terramore Introduction Video"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}; 