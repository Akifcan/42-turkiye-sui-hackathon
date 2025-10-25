import { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  blur: number;
  opacity: number;
  color: string;
}

export function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate floating elements with different properties
  const elements: FloatingElement[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 300 + 100, // 100-400px
    x: Math.random() * 100, // 0-100%
    y: Math.random() * 100, // 0-100%
    duration: Math.random() * 20 + 15, // 15-35s
    delay: Math.random() * -20, // Staggered start
    blur: Math.random() * 40 + 10, // 10-50px blur for depth
    opacity: Math.random() * 0.15 + 0.05, // 0.05-0.2 opacity
    color: [
      'var(--color-brand-primary)',
      'var(--color-accent-1)',
      'var(--color-accent-3)',
      'var(--color-accent-4)',
    ][Math.floor(Math.random() * 4)],
  }));

  return (
    <>
      <style>
        {`
          @keyframes floatTowards {
            0% {
              transform: translate3d(0, 0, -1000px) scale(0.3);
              opacity: 0;
            }
            10% {
              opacity: var(--element-opacity);
            }
            90% {
              opacity: var(--element-opacity);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1.5);
              opacity: 0;
            }
          }

          .floating-element {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, var(--element-color), transparent);
            filter: blur(var(--element-blur));
            animation: floatTowards var(--element-duration) linear infinite;
            animation-delay: var(--element-delay);
            will-change: transform, opacity;
          }
        `}
      </style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {elements.map((element, index) => {
          // Calculate parallax offset based on scroll and element depth
          const parallaxSpeed = (index % 3) * 0.1 + 0.1; // Different speeds for layers
          const parallaxOffset = scrollY * parallaxSpeed;

          return (
            <div
              key={element.id}
              className="floating-element"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                width: `${element.size}px`,
                height: `${element.size}px`,
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s ease-out',
                // @ts-ignore - CSS custom properties
                '--element-duration': `${element.duration}s`,
                '--element-delay': `${element.delay}s`,
                '--element-blur': `${element.blur}px`,
                '--element-opacity': element.opacity,
                '--element-color': element.color,
              }}
            />
          );
        })}
      </div>
    </>
  );
}

