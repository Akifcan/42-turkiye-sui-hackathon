import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const currentAccount = useCurrentAccount();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: "sticky",
        top: "var(--spacing-m)",
        display: "flex",
        justifyContent: "center",
        padding: "0 var(--spacing-m)",
        zIndex: 100,
        marginBottom: "var(--spacing-l)",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-l)",
          width: "auto",
          padding: "var(--spacing-s) var(--spacing-l)",
          borderRadius: "var(--radius-l)",
          overflow: "hidden",
          boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* SVG Filter for Glass Distortion */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <filter
            id="header-glass-distortion"
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

        {/* Glass Backdrop Layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            borderRadius: "var(--radius-l)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            filter: "url(#header-glass-distortion)",
            isolation: "isolate",
          }}
        />

        {/* White overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "var(--radius-l)",
          }}
        />

        {/* Inner Glass Highlights */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            borderRadius: "var(--radius-l)",
            overflow: "hidden",
            boxShadow:
              "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
          }}
        />

        {/* Content Wrapper - needs higher z-index */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--spacing-l)",
            width: "100%",
          }}
        >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-m)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text-primary)",
              margin: 0,
              fontFamily: "var(--font-family-heading)",
              letterSpacing: "-0.5px",
              whiteSpace: "nowrap",
            }}
          >
            AthliFi
          </h1>

          <span
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-brand-primary)",
              fontWeight: "var(--font-weight-medium)",
              backgroundColor: "rgba(16, 149, 236, 0.15)",
              padding: "4px 10px",
              borderRadius: "var(--radius-s)",
              fontFamily: "var(--font-family-body)",
              whiteSpace: "nowrap",
            }}
          >
            The Inner Circle
          </span>
        </Link>

        {currentAccount && (
          <nav
            style={{
              display: "flex",
              gap: "var(--spacing-m)",
              alignItems: "center",
            }}
          >
            <Link
              to="/create"
              style={{
                textDecoration: "none",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: isActive("/create")
                  ? "var(--font-weight-bold)"
                  : "var(--font-weight-medium)",
                color: isActive("/create")
                  ? "var(--color-brand-primary)"
                  : "var(--color-text-primary)",
                padding: "var(--spacing-xs) var(--spacing-s)",
                borderRadius: "var(--radius-s)",
                backgroundColor: isActive("/create")
                  ? "rgba(16, 149, 236, 0.1)"
                  : "transparent",
                transition: "all 0.2s",
              }}
            >
              Create
            </Link>
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: isActive("/dashboard")
                  ? "var(--font-weight-bold)"
                  : "var(--font-weight-medium)",
                color: isActive("/dashboard")
                  ? "var(--color-brand-primary)"
                  : "var(--color-text-primary)",
                padding: "var(--spacing-xs) var(--spacing-s)",
                borderRadius: "var(--radius-s)",
                backgroundColor: isActive("/dashboard")
                  ? "rgba(16, 149, 236, 0.1)"
                  : "transparent",
                transition: "all 0.2s",
              }}
            >
              Dashboard
            </Link>
          </nav>
        )}

        <ConnectButton />
        </div>
      </div>
    </header>
  );
}
