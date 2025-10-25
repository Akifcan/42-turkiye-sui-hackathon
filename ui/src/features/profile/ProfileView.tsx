import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useProfileData } from "../../hooks/useProfileData";
import { ProfileData } from "../../types";

export function ProfileView() {
  const currentAccount = useCurrentAccount();
  const { fetchProfile, loading, error } = useProfileData();
  
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const handleFetchProfile = async () => {
    try {
      const data = await fetchProfile(username);
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
              View Athlete Profile
            </h2>
            <p style={{ fontSize: 'var(--font-size-l)', color: 'rgba(0, 0, 0, 0.6)' }}>
              Enter an athlete's username to view their profile
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-s)' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Enter username (e.g., usain-bolt)"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleFetchProfile}
              disabled={loading || !username || !currentAccount}
              loading={loading}
              variant="accent"
            >
              View Profile
            </Button>
          </div>

          {!currentAccount && (
            <div
              style={{
                padding: 'var(--spacing-m)',
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'rgba(234, 67, 29, 0.1)',
                border: '1px solid var(--color-accent-orange)',
              }}
            >
              <p style={{ color: 'var(--color-accent-orange)', fontSize: 'var(--font-size-l)' }}>
                ⚠️ Please connect your wallet to view profiles
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: 'var(--spacing-m)',
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'rgba(234, 67, 29, 0.1)',
                border: '1px solid var(--color-accent-orange)',
              }}
            >
              <p style={{ color: 'var(--color-accent-orange)', fontSize: 'var(--font-size-l)' }}>
                ❌ {error}
              </p>
            </div>
          )}
        </div>
      </Card>

      {profileData && (
        <>
          {/* About Section */}
          {profileData.profile && (
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                  {profileData.profile.name} {profileData.profile.lastname}
                </h2>

                {profileData.profile.website && (
                  <div>
                    <p style={{ fontSize: 'var(--font-size-s)', fontWeight: '600', color: 'rgba(0, 0, 0, 0.6)', marginBottom: '4px' }}>
                      Website
                    </p>
                    <a
                      href={profileData.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-accent-blue)', fontSize: 'var(--font-size-l)' }}
                    >
                      {profileData.profile.website}
                    </a>
                  </div>
                )}

                {profileData.profile.about && (
                  <div>
                    <p style={{ fontSize: 'var(--font-size-s)', fontWeight: '600', color: 'rgba(0, 0, 0, 0.6)', marginBottom: '4px' }}>
                      About
                    </p>
                    <p style={{ fontSize: 'var(--font-size-l)', lineHeight: '1.6' }}>
                      {profileData.profile.about}
                    </p>
                  </div>
                )}

                <p style={{ fontSize: 'var(--font-size-s)', color: 'rgba(0, 0, 0, 0.5)' }}>
                  🔗 athlifi.com/{username}
                </p>
              </div>
            </Card>
          )}

          {/* Social Links Section */}
          {profileData.links.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
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
                      <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{link.sitename}</h4>
                      {link.description && (
                        <p style={{ fontSize: 'var(--font-size-l)', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {link.description}
                        </p>
                      )}
                      <a
                        href={link.siteurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-accent-blue)', fontSize: 'var(--font-size-l)' }}
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
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
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
                            backgroundColor: 'var(--color-bg-base)',
                            borderRadius: 'var(--radius-base)',
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
                      
                      <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{nft.title}</h4>
                      
                      {nft.description && (
                        <p style={{ fontSize: 'var(--font-size-l)', color: 'rgba(0, 0, 0, 0.6)' }}>
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
              <p style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}>
                No profile data found for this username
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

