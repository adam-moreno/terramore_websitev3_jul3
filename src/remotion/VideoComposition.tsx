import { Composition } from 'remotion';
import { TerramoreVideo } from './TerramoreVideo';

export const RemotionVideo: React.FC = () => {
  return (
    <>
      {/* Mobile/Standard 16:9 Composition */}
      <Composition
        id="TerramoreVideo16x9"
        component={TerramoreVideo}
        durationInFrames={1800} // 30 seconds at 60fps
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          aspectRatio: '16:9',
        }}
      />
      
      {/* Desktop 14:9 Composition */}
      <Composition
        id="TerramoreVideo14x9"
        component={TerramoreVideo}
        durationInFrames={1800} // 30 seconds at 60fps
        fps={60}
        width={1920}
        height={1234} // 14:9 aspect ratio
        defaultProps={{
          aspectRatio: '14:9',
        }}
      />
    </>
  );
}; 