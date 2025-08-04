"use client"

import React, { useState, useEffect } from 'react';

interface TerramoreVideoProps {
  aspectRatio?: '16:9' | '14:9';
  className?: string;
}

export const TerramoreVideo: React.FC<TerramoreVideoProps> = ({ 
  aspectRatio = '16:9',
  className = ""
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const fps = 60;
  const totalFrames = 1800; // 30 seconds
  const duration = 30000; // 30 seconds in milliseconds
  
  // Animation timing
  const introDuration = 90; // 1.5 seconds
  const logoDuration = 180; // 3 seconds
  const taglineDuration = 270; // 4.5 seconds
  const subtitleDuration = 360; // 6 seconds
  const ctaDuration = 450; // 7.5 seconds
  const outroDuration = 540; // 9 seconds
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        const next = prev + 1;
        return next >= totalFrames ? 0 : next; // Loop
      });
    }, 1000 / fps);
    
    return () => clearInterval(interval);
  }, [isPlaying, totalFrames, fps]);
  
  // Animation calculations
  const progress = currentFrame / totalFrames;
  const gradientRotation = progress * 360;
  
  // Opacity calculations
  const logoOpacity = currentFrame >= 0 && currentFrame <= logoDuration ? 1 : 0;
  const taglineOpacity = currentFrame >= logoDuration - 30 && currentFrame <= taglineDuration ? 1 : 0;
  const subtitleOpacity = currentFrame >= taglineDuration - 30 && currentFrame <= subtitleDuration ? 1 : 0;
  const ctaOpacity = currentFrame >= subtitleDuration - 30 && currentFrame <= ctaDuration ? 1 : 0;
  const outroOpacity = currentFrame >= ctaDuration - 30 && currentFrame <= outroDuration ? 1 : 0;
  
  // Spring-like animations
  const logoScale = Math.min(1, (currentFrame - 30) / 60);
  const taglineTranslateY = Math.max(0, 50 - (currentFrame - logoDuration) * 0.5);
  const subtitleTranslateY = Math.max(0, 50 - (currentFrame - taglineDuration) * 0.5);
  const ctaTranslateY = Math.max(0, 50 - (currentFrame - subtitleDuration) * 0.5);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        background: `linear-gradient(${gradientRotation}deg, #1e3a8a 0%, #3b82f6 25%, #1e40af 50%, #1e3a8a 75%, #3b82f6 100%)`,
        aspectRatio: aspectRatio === '16:9' ? '16/9' : '14/9',
      }}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Animated background elements */}
      <div
        className="absolute top-[10%] left-[10%] w-32 h-32 bg-white/10 rounded-full"
        style={{
          transform: `translate(${progress * 100}px, ${progress * -50}px)`,
        }}
      />
      <div
        className="absolute bottom-[20%] right-[15%] w-24 h-24 bg-white/8 rounded-full"
        style={{
          transform: `translate(${progress * -80}px, ${progress * 30}px)`,
        }}
      />
      
      {/* Logo Section */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
            T
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-white/90 tracking-wider">
            TERRAMORE
          </div>
        </div>
      </div>
      
      {/* Tagline Section */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineTranslateY}px)`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <div className="text-center">
          <div className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to
          </div>
          <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
            TERRAMORE.IO
          </div>
        </div>
      </div>
      
      {/* Subtitle Section */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4"
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleTranslateY}px)`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <div className="text-center max-w-2xl">
          <div className="text-lg md:text-2xl font-medium text-white/90 mb-6 leading-relaxed">
            Building scalable frameworks that power
          </div>
          <div className="text-xl md:text-3xl font-semibold text-white drop-shadow-md">
            marketing, automation & growth
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaTranslateY}px)`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <div className="text-center">
          <div className="text-lg md:text-xl font-semibold text-white/90 mb-6">
            Ready to transform your business?
          </div>
          <div className="inline-block px-6 py-3 bg-white/15 border-2 border-white/30 rounded-full text-lg font-semibold text-white backdrop-blur-sm shadow-lg">
            Get Started Today
          </div>
        </div>
      </div>
      
      {/* Outro Section */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: outroOpacity,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            TERRAMORE
          </div>
          <div className="text-lg md:text-xl font-medium text-white/80 tracking-wide">
            Your Business Growth Partner
          </div>
        </div>
      </div>
      
      {/* Play/Pause indicator */}
      <div className="absolute top-4 right-4 text-white/60 text-sm">
        {isPlaying ? '⏸️' : '▶️'}
      </div>
    </div>
  );
}; 