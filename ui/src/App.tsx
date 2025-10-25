import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Button } from "./components/ui/Button";
import { AthleteProfileForm } from "./features/athlete/AthleteProfileForm";
import { SocialLinksManager } from "./features/athlete/SocialLinksManager";
import { NFTGalleryManager } from "./features/athlete/NFTGalleryManager";
import { ProfileView } from "./features/profile/ProfileView";
import { useProfileData } from './hooks/useProfileData';

function App() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'manage'>('view');
  const { profileData } = useProfileData();

  // Log connected wallet address
  useEffect(() => {
    if (currentAccount) {
      console.log("🔗 Wallet Connected!");
      console.log("📍 Address:", currentAccount.address);
      console.log("👛 Wallet:", currentAccount);
    } else {
      console.log("❌ No wallet connected");
    }
  }, [currentAccount]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      
      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--spacing-xxl) var(--spacing-xl)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {currentAccount ? (
          <>
            {/* Tab Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-xxl)' }}>
              <div
                style={{
                  display: 'inline-flex',
                  padding: 'var(--spacing-xs)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-l)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <Button
                  variant="tab"
                  active={activeTab === 'view'}
                  onClick={() => setActiveTab('view')}
                >
                  View Profiles
                </Button>
                <Button
                  variant="tab"
                  active={activeTab === 'create'}
                  onClick={() => setActiveTab('create')}
                >
                  Create Profile
                </Button>
                <Button
                  variant="tab"
                  active={activeTab === 'manage'}
                  onClick={() => setActiveTab('manage')}
                >
                  Manage Content
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'view' && (
              <div>
                <ProfileView profileData={profileData} />
              </div>
            )}

            {activeTab === 'create' && (
              <div>
                <AthleteProfileForm />
              </div>
            )}

            {activeTab === 'manage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxl)' }}>
                <SocialLinksManager />
                <NFTGalleryManager />
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              gap: 'var(--spacing-xl)',
            }}
          >
            <h1 style={{ 
              fontSize: 'var(--font-size-heading)', 
              fontWeight: 'var(--font-weight-bold)', 
              fontFamily: 'var(--font-family-heading)',
              textAlign: 'center',
              color: 'var(--color-text-primary)',
            }}>
              Welcome to AthliFi
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: 'var(--color-text-secondary)', 
              textAlign: 'center', 
              maxWidth: '500px',
              fontFamily: 'var(--font-family-body)',
              lineHeight: '1.6',
            }}>
              The decentralized platform connecting athletes with their supporters. Connect your wallet to get started.
            </p>
            <div
              style={{
                padding: 'var(--spacing-xl)',
                borderRadius: 'var(--radius-m)',
                backgroundColor: 'rgba(16, 149, 236, 0.15)',
                border: 'var(--border-width-xs) solid var(--color-brand-primary)',
              }}
            >
              <p style={{ 
                fontSize: 'var(--font-size-body)', 
                color: 'var(--color-brand-primary)', 
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family-body)',
              }}>
                👋 Please connect your wallet to continue
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;