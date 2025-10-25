import { Canvas } from '@react-three/fiber';
import { LiquidGlass } from './LiquidGlass';

interface LiquidGlassBackgroundProps {
  imageUrl?: string;
  opacity?: number;
}

export function LiquidGlassBackground({ 
  imageUrl = 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2000&auto=format&fit=crop',
  opacity = 0.3,
}: LiquidGlassBackgroundProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <Canvas dpr={[1, 1.5]}>
        <LiquidGlass imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}

