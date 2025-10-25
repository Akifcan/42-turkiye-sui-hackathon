import { useEffect, useState, useMemo } from 'react';

interface Cloud {
  id: number;
  scale: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  depth: number;
}

export function CloudBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate clouds with varying properties using useMemo for performance
  const clouds: Cloud[] = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        scale: Math.random() * 0.5 + 0.3, // 0.3-0.8 scale
        top: Math.random() * 90, // 0-90% (keep clouds in view)
        left: Math.random() * 120 - 20, // -20% to 100% (some start off-screen)
        duration: Math.random() * 25 + 15, // 15-40s for horizontal drift
        delay: Math.random() * -30, // Staggered start times
        opacity: Math.random() * 0.5 + 0.4, // 0.4-0.9 opacity
        depth: i % 5, // 5 depth layers for parallax
      })),
    []
  );

  return (
    <>
      <style>
        {`
          /* Performant keyframes using transform: translateX() */
          @keyframes cloudDrift {
            0% {
              transform: translateX(-150%);
            }
            100% {
              transform: translateX(calc(100vw + 150%));
            }
          }

          .cloud-element {
            position: absolute;
            /* Base cloud shape with gradient for depth */
            background: #fff;
            background: linear-gradient(to bottom, #fff 5%, #f1f1f1 100%);
            border-radius: 100px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            height: 120px;
            width: 350px;
            animation: cloudDrift var(--cloud-duration) linear infinite;
            animation-delay: var(--cloud-delay);
            opacity: var(--cloud-opacity);
            will-change: transform;
            pointer-events: none;
          }

          /* Pseudo-elements for fluffy, multi-lobed cloud appearance */
          .cloud-element::before,
          .cloud-element::after {
            content: '';
            position: absolute;
            background: #fff;
            z-index: -1;
          }

          .cloud-element::after {
            border-radius: 100px;
            height: 100px;
            width: 100px;
            left: 50px;
            top: -50px;
          }

          .cloud-element::before {
            border-radius: 200px;
            width: 180px;
            height: 180px;
            right: 50px;
            top: -90px;
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
          background: 'linear-gradient(to bottom, #87CEEB 0%, #FFFFFF 100%)',
        }}
      >
        {clouds.map((cloud) => {
          // Calculate true parallax offset based on scroll and cloud depth
          // Deeper clouds (higher depth value) move slower
          const parallaxSpeed = cloud.depth * 0.08 + 0.05; // 0.05 to 0.37
          const parallaxOffset = -scrollY * parallaxSpeed;

          return (
            <div
              key={cloud.id}
              className="cloud-element"
              style={{
                top: `${cloud.top}%`,
                left: `${cloud.left}%`,
                transform: `scale(${cloud.scale}) translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s ease-out',
                // @ts-ignore - CSS custom properties
                '--cloud-duration': `${cloud.duration}s`,
                '--cloud-delay': `${cloud.delay}s`,
                '--cloud-opacity': cloud.opacity,
              }}
            />
          );
        })}
      </div>
    </>
  );
}

