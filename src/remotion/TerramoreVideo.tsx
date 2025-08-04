import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';

interface TerramoreVideoProps {
  aspectRatio?: '16:9' | '14:9';
}

export const TerramoreVideo: React.FC<TerramoreVideoProps> = ({ 
  aspectRatio = '16:9' 
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Calculate dimensions based on aspect ratio
  const width = 1920;
  const height = aspectRatio === '16:9' ? 1080 : Math.round(width * 9 / 14);
  
  // Animation timing (30 seconds = 1800 frames at 60fps)
  const introDuration = 90; // 1.5 seconds
  const logoDuration = 180; // 3 seconds
  const taglineDuration = 270; // 4.5 seconds
  const subtitleDuration = 360; // 6 seconds
  const ctaDuration = 450; // 7.5 seconds
  const outroDuration = 540; // 9 seconds
  
  // Spring animations
  const logoSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  
  const taglineSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  
  const subtitleSpring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 60 },
  });
  
  const ctaSpring = spring({
    frame: frame - 240,
    fps,
    config: { damping: 10, stiffness: 50 },
  });
  
  // Opacity animations
  const logoOpacity = interpolate(
    frame,
    [0, introDuration, logoDuration, logoDuration + 60],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const taglineOpacity = interpolate(
    frame,
    [logoDuration - 30, logoDuration, taglineDuration, taglineDuration + 60],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const subtitleOpacity = interpolate(
    frame,
    [taglineDuration - 30, taglineDuration, subtitleDuration, subtitleDuration + 60],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const ctaOpacity = interpolate(
    frame,
    [subtitleDuration - 30, subtitleDuration, ctaDuration, ctaDuration + 60],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const outroOpacity = interpolate(
    frame,
    [ctaDuration - 30, ctaDuration, outroDuration, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, durationInFrames], [0, 360]);
  
  return (
    <AbsoluteFill
      style={{
        width,
        height,
        background: `linear-gradient(${gradientRotation}deg, #1e3a8a 0%, #3b82f6 25%, #1e40af 50%, #1e3a8a 75%, #3b82f6 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: `translate(${interpolate(frame, [0, durationInFrames], [0, 100])}px, ${interpolate(frame, [0, durationInFrames], [0, -50])}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          transform: `translate(${interpolate(frame, [0, durationInFrames], [0, -80])}px, ${interpolate(frame, [0, durationInFrames], [0, 30])}px)`,
        }}
      />
      
      {/* Logo Section */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoSpring})`,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            marginBottom: '20px',
          }}
        >
          T
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '2px',
          }}
        >
          TERRAMORE
        </div>
      </div>
      
      {/* Tagline Section */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${interpolate(taglineSpring, [0, 1], [50, 0])}px)`,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            marginBottom: '30px',
            lineHeight: 1.2,
          }}
        >
          Welcome to
        </div>
        <div
          style={{
            fontSize: '72px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            letterSpacing: '1px',
          }}
        >
          TERRAMORE.IO
        </div>
      </div>
      
      {/* Subtitle Section */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [50, 0])}px)`,
          textAlign: 'center',
          zIndex: 10,
          maxWidth: '800px',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Building scalable frameworks that power
        </div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: '600',
            color: 'white',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          marketing, automation & growth
        </div>
      </div>
      
      {/* CTA Section */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${interpolate(ctaSpring, [0, 1], [50, 0])}px)`,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '30px',
          }}
        >
          Ready to transform your business?
        </div>
        <div
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          Get Started Today
        </div>
      </div>
      
      {/* Outro Section */}
      <div
        style={{
          opacity: outroOpacity,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            marginBottom: '20px',
          }}
        >
          TERRAMORE
        </div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.8)',
            letterSpacing: '1px',
          }}
        >
          Your Business Growth Partner
        </div>
      </div>
    </AbsoluteFill>
  );
}; 