import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProfileData } from "../hooks/useProfileData";
import { Card } from "../components/ui/Card";
import { ProfileData } from "../types";

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { fetchProfile, loading, error } = useProfileData();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (username) {
        try {
          const data = await fetchProfile(username);
          setProfileData(data);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <p style={{ 
          fontSize: 'var(--font-size-body)', 
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family-body)',
        }}>
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-m)',
        minHeight: '50vh',
        justifyContent: 'center',
      }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: 'var(--color-error)', 
              fontSize: 'var(--font-size-body)',
              fontFamily: 'var(--font-family-body)',
              marginBottom: 'var(--spacing-m)',
            }}>
              ❌ {error}
            </p>
            <Link 
              to="/"
              style={{ 
                color: 'var(--color-brand-primary)',
                textDecoration: 'none',
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-m)' }}>
        <Link 
          to="/"
          style={{ 
            color: 'var(--color-brand-primary)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-body)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          ← Back to Home
        </Link>
      </div>

      {/* About Section */}
      {profileData.profile && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'var(--font-weight-bold)', 
              fontFamily: 'var(--font-family-heading)',
              color: 'var(--color-text-primary)',
            }}>
              {profileData.profile.name} {profileData.profile.lastname}
            </h2>

            {profileData.profile.website && (
              <div>
                <p style={{ 
                  fontSize: 'var(--font-size-small)', 
                  fontWeight: 'var(--font-weight-medium)', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '4px',
                  fontFamily: 'var(--font-family-body)',
                }}>
                  Website
                </p>
                <a
                  href={profileData.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'var(--color-brand-primary)', 
                    fontSize: 'var(--font-size-body)',
                    fontFamily: 'var(--font-family-body)',
                  }}
                >
                  {profileData.profile.website}
                </a>
              </div>
            )}

            {profileData.profile.about && (
              <div>
                <p style={{ 
                  fontSize: 'var(--font-size-small)', 
                  fontWeight: 'var(--font-weight-medium)', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '4px',
                  fontFamily: 'var(--font-family-body)',
                }}>
                  About
                </p>
                <p style={{ 
                  fontSize: 'var(--font-size-body)', 
                  lineHeight: '1.6',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-family-body)',
                }}>
                  {profileData.profile.about}
                </p>
              </div>
            )}

            <p style={{ 
              fontSize: 'var(--font-size-small)', 
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-family-body)',
            }}>
              🔗 trwal.app/{username}
            </p>
          </div>
        </Card>
      )}

      {/* Social Links Section */}
      {profileData.links.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'var(--font-weight-bold)',
            fontFamily: 'var(--font-family-heading)',
            color: 'var(--color-text-primary)',
          }}>
            Social Links ({profileData.links.length})
          </h3>
          
          {profileData.links.map((link, index) => (
            <Card key={index}>
              <div style={{ display: 'flex', gap: 'var(--spacing-m)', alignItems: 'flex-start' }}>
                {link.iconurl && (
                  <img
                    src={link.iconurl}
                    alt={link.sitename}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: 'var(--font-family-body)',
                    color: 'var(--color-text-primary)',
                  }}>{link.sitename}</h4>
                  {link.description && (
                    <p style={{ 
                      fontSize: 'var(--font-size-body)', 
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-family-body)',
                    }}>
                      {link.description}
                    </p>
                  )}
                  <a
                    href={link.siteurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--color-brand-primary)', 
                      fontSize: 'var(--font-size-body)',
                      fontFamily: 'var(--font-family-body)',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'var(--font-weight-bold)',
            fontFamily: 'var(--font-family-heading)',
            color: 'var(--color-text-primary)',
          }}>
            NFT Collection ({profileData.nfts.length})
          </h3>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 'var(--spacing-m)',
            }}
          >
            {profileData.nfts.map((nft, index) => (
              <Card key={index}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
                  {nft.nft_url && (
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: 'var(--color-background-base)',
                        borderRadius: 'var(--radius-m)',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={nft.nft_url}
                        alt={nft.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: 'var(--font-family-body)',
                    color: 'var(--color-text-primary)',
                  }}>{nft.title}</h4>
                  
                  {nft.description && (
                    <p style={{ 
                      fontSize: 'var(--font-size-body)', 
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-family-body)',
                    }}>
                      {nft.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!profileData.profile && profileData.links.length === 0 && profileData.nfts.length === 0 && (
        <Card>
          <p style={{ 
            textAlign: 'center', 
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-family-body)',
          }}>
            No profile data found for this username
          </p>
        </Card>
      )}
    </div>
  );
}

