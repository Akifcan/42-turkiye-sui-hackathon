"use client";

import React from "react";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

interface DockIcon {
  src: string;
  alt: string;
  onClick?: () => void;
}

// Glass Effect Wrapper Component
const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    fontWeight: 600,
    overflow: "hidden",
    color: "black",
    cursor: "pointer",
    transition: "all 700ms",
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div style={glassStyle} className={className}>
      {/* Glass Backdrop Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "24px",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      
      {/* White overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: "24px",
        }}
      />
      
      {/* Inner Glass Highlights */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 30 }}>{children}</div>
    </div>
  );

  return href ? (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      style={{ display: "block" }}
    >
      {content}
    </a>
  ) : (
    content
  );
};

// Dock Component
const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({
  icons,
  href,
}) => {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <GlassEffect
        href={href}
        style={{
          borderRadius: hover ? "32px" : "24px",
          padding: hover ? "16px" : "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            borderRadius: "24px",
            padding: "12px",
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: "2px",
            paddingRight: "2px",
            overflow: "hidden",
          }}
        >
          {icons.map((icon, index) => (
            <img
              key={index}
              src={icon.src}
              alt={icon.alt}
              style={{
                width: "24px",
                height: "24px",
                transition: "all 700ms",
                transformOrigin: "center center",
                transitionTimingFunction:
                  "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={icon.onClick}
            />
          ))}
        </div>
      </GlassEffect>
    </div>
  );
};

// Button Component
const GlassButton: React.FC<{ children: React.ReactNode; href?: string }> = ({
  children,
  href,
}) => {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <GlassEffect
        href={href}
        style={{
          borderRadius: hover ? "32px" : "24px",
          paddingLeft: hover ? "44px" : "40px",
          paddingRight: hover ? "44px" : "40px",
          paddingTop: hover ? "28px" : "24px",
          paddingBottom: hover ? "28px" : "24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transition: "all 700ms",
            transform: hover ? "scale(0.95)" : "scale(1)",
            transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
          }}
        >
          {children}
        </div>
      </GlassEffect>
    </div>
  );
};

// SVG Filter Component
const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="200"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

// Main Component
export const Component = () => {
  const dockIcons: DockIcon[] = [
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/a13d1acfd046f503f987c1c95af582c8_low_res_Claude.png",
      alt: "Claude",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png",
      alt: "Finder",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c2c4a538c2d42a8dc0927d7d6530d125_low_res_ChatGPT___Liquid_Glass__Default_.png",
      alt: "Chatgpt",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/6d26d432bd65c522b0708185c0768ec3_low_res_Maps.png",
      alt: "Maps",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/7c59c945731aecf4f91eb8c2c5f867ce_low_res_Safari.png",
      alt: "Safari",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/b7f24edc7183f63dbe34c1943bef2967_low_res_Steam___Liquid_Glass__Default_.png",
      alt: "Steam",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 300,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        background: `url("https://images.unsplash.com/photo-1432251407527-504a6b4174a2?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center center`,
        backgroundSize: "100% 1100%",
        animation: "moveBackground 60s linear infinite",
      }}
    >
      <GlassFilter />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <GlassDock icons={dockIcons} href="https://x.com/notsurajgaud" />

        <GlassButton href="https://x.com/notsurajgaud">
          <div style={{ fontSize: "20px", color: "white" }}>
            <p>How can i help you today?</p>
          </div>
        </GlassButton>
      </div>
    </div>
  );
};
