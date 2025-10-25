import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useProfileData } from "../../hooks/useProfileData";
import { ProfileData } from "../../types";
import DonationWidget from "../donations/DonationWidget";
import DonationHistory from "../donations/DonationHistory";
import TopSupporters from "../donations/TopSupporters";

export function ProfileView() {
  const currentAccount = useCurrentAccount();
  const { fetchProfile, loading, error } = useProfileData();
  const { username: routeUsername } = useParams();

  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const handleFetchProfile = async (overrideUsername?: string) => {
    try {
      const target = (overrideUsername ?? username).trim();
      if (!target) return;
      const data = await fetchProfile(target);
      // Fallback for owner if backend doesn't return it
      if (!data.owner && currentAccount?.address) {
        data.owner = currentAccount.address;
      }
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Auto-load when hitting /:username routes
  useEffect(() => {
    if (routeUsername) {
      const normalized = routeUsername.toLowerCase();
      setUsername(normalized);
      handleFetchProfile(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeUsername]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xl)",
      }}
    >
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-m)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "var(--font-weight-bold)",
                fontFamily: "var(--font-family-heading)",
                marginBottom: "var(--spacing-xs)",
                color: "var(--color-text-primary)",
              }}
            >
              View Athlete Profile
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Enter an athlete's username to view their profile
            </p>
          </div>

          <div style={{ display: "flex", gap: "var(--spacing-s)" }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Enter username (e.g., usain-bolt)"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                disabled={loading}
              />
            </div>
            <Button
              onClick={() => handleFetchProfile()}
              disabled={loading || !username}
              loading={loading}
              variant="accent"
            >
              View Profile
            </Button>
          </div>

          {!currentAccount && (
            <div
              style={{
                padding: "var(--spacing-m)",
                borderRadius: "var(--radius-m)",
                backgroundColor: "rgba(236, 15, 235, 0.1)",
                border: "var(--border-width-none) solid var(--color-error)",
              }}
            >
              <p
                style={{
                  color: "var(--color-error)",
                  fontSize: "var(--font-size-body)",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                ⚠️ Please connect your wallet to donate (viewing works without it)
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "var(--spacing-m)",
                borderRadius: "var(--radius-m)",
                backgroundColor: "rgba(236, 15, 235, 0.1)",
                border: "var(--border-width-none) solid var(--color-error)",
              }}
            >
              <p
                style={{
                  color: "var(--color-error)",
                  fontSize: "var(--font-size-body)",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                ❌ {error}
              </p>
            </div>
          )}
        </div>
      </Card>

      {profileData && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-xl)",
            }}
          >
            {/* Donation Widget Section - always render when profile is loaded */}
            <DonationWidget
              recipientAddress={profileData.owner || currentAccount?.address || ""}
            />

            {/* Donation History Section */}
            <DonationHistory
              profileOwnerAddress={profileData.owner || currentAccount?.address || null}
            />

            {/* Top Supporters Section */}
            <TopSupporters
              profileOwnerAddress={profileData.owner || currentAccount?.address || null}
            />

            {/* About Section */}
            {profileData.profile && (
              <Card>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-m)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: "var(--font-weight-bold)",
                      fontFamily: "var(--font-family-heading)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {profileData.profile.name} {profileData.profile.lastname}
                  </h2>

                  {profileData.profile.website && (
                    <div>
                      <p
                        style={{
                          fontSize: "var(--font-size-small)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--color-text-secondary)",
                          marginBottom: "4px",
                          fontFamily: "var(--font-family-body)",
                        }}
                      >
                        Website
                      </p>
                      <a
                        href={profileData.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--color-brand-primary)",
                          fontSize: "var(--font-size-body)",
                          fontFamily: "var(--font-family-body)",
                        }}
                      >
                        {profileData.profile.website}
                      </a>
                    </div>
                  )}

                  {profileData.profile.about && (
                    <div>
                      <p
                        style={{
                          fontSize: "var(--font-size-small)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--color-text-secondary)",
                          marginBottom: "4px",
                          fontFamily: "var(--font-family-body)",
                        }}
                      >
                        About
                      </p>
                      <p
                        style={{
                          fontSize: "var(--font-size-body)",
                          lineHeight: "1.6",
                          color: "var(--color-text-primary)",
                          fontFamily: "var(--font-family-body)",
                        }}
                      >
                        {profileData.profile.about}
                      </p>
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: "var(--font-size-small)",
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-family-body)",
                    }}
                  >
                    🔗 athlifi.com/{username}
                  </p>
                </div>
              </Card>
            )}

            {/* Social Links Section */}
            {profileData.links.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-m)",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "var(--font-weight-bold)",
                    fontFamily: "var(--font-family-heading)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Social Links ({profileData.links.length})
                </h3>

                {profileData.links.map((link, index) => (
                  <Card key={index}>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--spacing-m)",
                        alignItems: "flex-start",
                      }}
                    >
                      {link.iconurl && (
                        <img
                          src={link.iconurl}
                          alt={link.sitename}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-xs)",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "18px",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "var(--font-family-body)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {link.sitename}
                        </h4>
                        {link.description && (
                          <p
                            style={{
                              fontSize: "var(--font-size-body)",
                              color: "var(--color-text-secondary)",
                              fontFamily: "var(--font-family-body)",
                            }}
                          >
                            {link.description}
                          </p>
                        )}
                        <a
                          href={link.siteurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "var(--color-brand-primary)",
                            fontSize: "var(--font-size-body)",
                            fontFamily: "var(--font-family-body)",
                          }}
                        >
                          {link.siteurl} →
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* NFT Gallery Section */}
            {profileData.nfts.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-m)",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "var(--font-weight-bold)",
                    fontFamily: "var(--font-family-heading)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  NFT Collection ({profileData.nfts.length})
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "var(--spacing-m)",
                  }}
                >
                  {profileData.nfts.map((nft, index) => (
                    <Card key={index}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-s)",
                        }}
                      >
                        {nft.nft_url && (
                          <div
                            style={{
                              width: "100%",
                              height: "200px",
                              backgroundColor: "var(--color-background-base)",
                              borderRadius: "var(--radius-m)",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={nft.nft_url}
                              alt={nft.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        )}

                        <h4
                          style={{
                            fontSize: "18px",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "var(--font-family-body)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {nft.title}
                        </h4>

                        {nft.description && (
                          <p
                            style={{
                              fontSize: "var(--font-size-body)",
                              color: "var(--color-text-secondary)",
                              fontFamily: "var(--font-family-body)",
                            }}
                          >
                            {nft.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!profileData.profile &&
              profileData.links.length === 0 &&
              profileData.nfts.length === 0 && (
                <Card>
                  <p
                    style={{
                      textAlign: "center",
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-family-body)",
                    }}
                  >
                    No profile data found for this username
                  </p>
                </Card>
              )}
          </div>
        </>
      )}
    </div>
  );
}
