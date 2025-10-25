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

      {/* Website Link */}
      {profile.website && (
        <div
          className="liquid-glass"
          style={{
            width: "100%",
            maxWidth: "clamp(280px, 50vw, 600px)",
            padding: "clamp(16px, 3vw, 24px)",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: "600",
              fontFamily: "var(--font-family-heading)",
              color: "rgba(0, 0, 0, 0.85)",
              margin: "0 0 clamp(8px, 1.5vw, 12px) 0",
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
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0088ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#0066cc")}
          >
            {profile.website}
          </a>
        </div>
      )}

      {/* Social Links Section */}
      {links.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "clamp(280px, 50vw, 600px)",
          }}
        >
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
            🔗 Social Links
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 2vw, 16px)",
            }}
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.siteurl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "clamp(16px, 3vw, 20px)",
                  borderRadius: "clamp(16px, 3vw, 20px)",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(12px, 2vw, 16px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.22)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(0, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.3)";
                }}
              >
                {link.iconurl && (
                  <img
                    src={link.iconurl}
                    alt={link.sitename}
                    style={{
                      width: "clamp(32px, 6vw, 48px)",
                      height: "clamp(32px, 6vw, 48px)",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "clamp(16px, 3vw, 18px)",
                      fontWeight: "600",
                      fontFamily: "var(--font-family-heading)",
                      color: "rgba(0, 0, 0, 0.85)",
                      marginBottom: "4px",
                    }}
                  >
                    {link.sitename}
                  </div>
                  {link.description && (
                    <div
                      style={{
                        fontSize: "clamp(13px, 2.5vw, 14px)",
                        fontFamily: "var(--font-family-body)",
                        color: "rgba(0, 0, 0, 0.6)",
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

      {/* NFT Gallery Section */}
      {nfts.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "clamp(280px, 90vw, 1200px)",
          }}
        >
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
                  borderRadius: "clamp(16px, 3vw, 24px)",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(0, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.3)";
                }}
              >
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
