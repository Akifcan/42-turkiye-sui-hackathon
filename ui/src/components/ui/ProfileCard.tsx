import { AboutProfile, SocialLink, NFTItem } from "../../types";

interface ProfileCardProps {
  profile: AboutProfile | null;
  links?: SocialLink[];
  nfts?: NFTItem[];
}

export function ProfileCard({
  profile,
  links = [],
  nfts = [],
}: ProfileCardProps) {
  if (!profile) return null;

  const fallbackImage = (
    <img
      src="/primary.jpg"
      alt={`${profile.name} ${profile.lastname}`}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "clamp(10px, 2vw, 20px)",
        paddingLeft: "clamp(20px, 5vw, 40px)",
        paddingRight: "clamp(20px, 5vw, 40px)",
        paddingBottom: "clamp(40px, 8vw, 80px)",
        gap: "clamp(30px, 6vw, 60px)",
      }}
    >
      {/* Profile Card */}
      <div
        className="liquid-glass-target"
        style={{
          position: "relative",
          width: "clamp(280px, 50vw, 380px)",
          height: "clamp(280px, 50vw, 380px)",
          aspectRatio: "1 / 1",
          borderRadius: "clamp(32px, 6vw, 48px)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Fallback image always rendered */}
        {fallbackImage}

        {/* WebGL overlay - disabled temporarily to fix crash */}
        {/* <WebGLErrorBoundary fallback={null}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Canvas dpr={[1, 1]}>
              <Suspense fallback={null}>
                <LiquidGlass imageUrl="/primary.jpg" />
              </Suspense>
            </Canvas>
          </div>
        </WebGLErrorBoundary> */}

        {/* Gradient Overlay for text readability */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Text Content */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "clamp(20px, 4vw, 30px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(4px, 1vw, 8px)",
          }}
        >
          {/* Name */}
          <h1
            style={{
              fontSize: "clamp(24px, 4.5vw, 36px)",
              fontWeight: "600",
              fontFamily: "var(--font-family-heading)",
              color: "white",
              textAlign: "center",
              margin: 0,
              lineHeight: "1.1",
              textShadow: "0 2px 12px rgba(0, 0, 0, 0.5)",
              letterSpacing: "-0.02em",
            }}
          >
            {profile.name} {profile.lastname}
          </h1>

          {/* Role/Title */}
          {profile.about && (
            <p
              style={{
                fontSize: "clamp(14px, 2.5vw, 18px)",
                fontWeight: "400",
                fontFamily: "var(--font-family-body)",
                color: "rgba(255, 255, 255, 0.85)",
                textAlign: "center",
                margin: 0,
                textShadow: "0 1px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              {profile.about}
            </p>
          )}
        </div>
      </div>

      {/* Website & Social Links - Merged with Liquid Glass */}
      {(profile.website || links.length > 0) && (
        <div
          style={{
            width: "100%",
            maxWidth: "clamp(280px, 50vw, 600px)",
          }}
        >
          {/* SVG Filter for Glass Distortion */}
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <filter
              id="profile-glass-distortion"
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

          <div
            style={{
              position: "relative",
              padding: "clamp(20px, 4vw, 32px)",
              borderRadius: "clamp(20px, 4vw, 28px)",
              overflow: "hidden",
              boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Glass Backdrop Layer */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                overflow: "hidden",
                borderRadius: "clamp(20px, 4vw, 28px)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                filter: "url(#profile-glass-distortion)",
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
                borderRadius: "clamp(20px, 4vw, 28px)",
              }}
            />

            {/* Inner Glass Highlights */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                borderRadius: "clamp(20px, 4vw, 28px)",
                overflow: "hidden",
                boxShadow:
                  "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
              }}
            />

            {/* Content */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                gap: "clamp(20px, 3vw, 28px)",
              }}
            >
              {/* Website Section */}
              {profile.website && (
                <div>
                  <h3
                    style={{
                      fontSize: "clamp(18px, 3vw, 22px)",
                      fontWeight: "600",
                      fontFamily: "var(--font-family-heading)",
                      color: "rgba(0, 0, 0, 0.85)",
                      margin: "0 0 clamp(10px, 2vw, 14px) 0",
                    }}
                  >
                    🌐 Website
                  </h3>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#0066cc",
                      fontSize: "clamp(14px, 2.5vw, 16px)",
                      fontFamily: "var(--font-family-body)",
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "color 0.2s",
                      wordBreak: "break-all",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#0088ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#0066cc")}
                  >
                    {profile.website}
                  </a>
                </div>
              )}

              {/* Social Links */}
              {links.length > 0 && (
                <div>
                  {profile.website && (
                    <div
                      style={{
                        height: "1px",
                        background: "rgba(0, 0, 0, 0.1)",
                        margin: "clamp(8px, 2vw, 12px) 0 clamp(16px, 3vw, 24px) 0",
                      }}
                    />
                  )}
                  <h3
                    style={{
                      fontSize: "clamp(18px, 3vw, 22px)",
                      fontWeight: "600",
                      fontFamily: "var(--font-family-heading)",
                      color: "rgba(0, 0, 0, 0.85)",
                      margin: "0 0 clamp(12px, 2vw, 16px) 0",
                    }}
                  >
                    🔗 Social Links
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(10px, 2vw, 14px)",
                    }}
                  >
                    {links.map((link, index) => (
                      <a
                        key={index}
                        href={link.siteurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "clamp(12px, 2.5vw, 16px)",
                          borderRadius: "clamp(12px, 2.5vw, 16px)",
                          background: "rgba(0, 0, 0, 0.05)",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "clamp(10px, 2vw, 14px)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(0, 0, 0, 0.08)";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        {link.iconurl && (
                          <img
                            src={link.iconurl}
                            alt={link.sitename}
                            style={{
                              width: "clamp(28px, 5vw, 40px)",
                              height: "clamp(28px, 5vw, 40px)",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "clamp(15px, 2.8vw, 17px)",
                              fontWeight: "600",
                              fontFamily: "var(--font-family-heading)",
                              color: "rgba(0, 0, 0, 0.85)",
                              marginBottom: "2px",
                            }}
                          >
                            {link.sitename}
                          </div>
                          {link.description && (
                            <div
                              style={{
                                fontSize: "clamp(12px, 2.3vw, 13px)",
                                fontFamily: "var(--font-family-body)",
                                color: "rgba(0, 0, 0, 0.55)",
                              }}
                            >
                              {link.description}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NFT Gallery Section with Liquid Glass */}
      {nfts.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "clamp(280px, 90vw, 1200px)",
          }}
        >
          {/* SVG Filter for NFT Glass */}
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <filter
              id="nft-glass-distortion"
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

          <h2
            style={{
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: "600",
              fontFamily: "var(--font-family-heading)",
              color: "rgba(0, 0, 0, 0.85)",
              marginBottom: "clamp(16px, 3vw, 24px)",
              textAlign: "center",
            }}
          >
            🎨 NFT Gallery
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(clamp(200px, 30vw, 280px), 1fr))",
              gap: "clamp(16px, 3vw, 24px)",
            }}
          >
            {nfts.map((nft, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  borderRadius: "clamp(16px, 3vw, 24px)",
                  overflow: "hidden",
                  boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Glass Backdrop Layer */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    overflow: "hidden",
                    borderRadius: "clamp(16px, 3vw, 24px)",
                    backdropFilter: "blur(3px)",
                    WebkitBackdropFilter: "blur(3px)",
                    filter: "url(#nft-glass-distortion)",
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
                    borderRadius: "clamp(16px, 3vw, 24px)",
                  }}
                />

                {/* Inner Glass Highlights */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    borderRadius: "clamp(16px, 3vw, 24px)",
                    overflow: "hidden",
                    boxShadow:
                      "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
                  }}
                />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 10 }}>
                  <img
                    src={nft.nft_url}
                    alt={nft.title}
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      padding: "clamp(12px, 2.5vw, 16px)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "clamp(16px, 3vw, 18px)",
                        fontWeight: "600",
                        fontFamily: "var(--font-family-heading)",
                        color: "rgba(0, 0, 0, 0.85)",
                        margin: "0 0 clamp(6px, 1vw, 8px) 0",
                      }}
                    >
                      {nft.title}
                    </h3>
                    {nft.description && (
                      <p
                        style={{
                          fontSize: "clamp(13px, 2.5vw, 14px)",
                          fontFamily: "var(--font-family-body)",
                          color: "rgba(0, 0, 0, 0.6)",
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        {nft.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
