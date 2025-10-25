import { Canvas } from "@react-three/fiber";
import { LiquidGlass } from "./LiquidGlass";
import { Component, ErrorInfo, ReactNode } from "react";

interface LiquidGlassBackgroundProps {
  imageUrl?: string;
  opacity?: number;
}

// Error boundary to catch WebGL crashes
class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(
      "WebGL/Three.js error (gracefully handled):",
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return null; // Silently fail, show nothing
    }
    return this.props.children;
  }
}

export function LiquidGlassBackground({
  imageUrl = "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2000&auto=format&fit=crop",
  opacity = 0.3,
}: LiquidGlassBackgroundProps) {
  return (
    <WebGLErrorBoundary>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          opacity,
          pointerEvents: "none",
        }}
      >
        <Canvas dpr={[1, 1.5]}>
          <LiquidGlass imageUrl={imageUrl} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
