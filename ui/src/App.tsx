import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { Header } from "./components/layout/Header";
import { AthleteProfileForm } from "./features/athlete/AthleteProfileForm";
import { SocialLinksManager } from "./features/athlete/SocialLinksManager";
import { NFTGalleryManager } from "./features/athlete/NFTGalleryManager";
import { ProfileView } from "./features/profile/ProfileView";

function App() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'manage'>('view');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-base)' }}>
      <Header />
      
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--spacing-xxl) var(--spacing-xl)',
        }}
      >
        {currentAccount ? (
          <>
            {/* Tab Navigation */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-s)',
                marginBottom: 'var(--spacing-xxl)',
                borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
                paddingBottom: 'var(--spacing-s)',
              }}
            >
              <button
                onClick={() => setActiveTab('view')}
                style={{
                  padding: 'var(--spacing-s) var(--spacing-l)',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'view' ? '3px solid var(--color-accent-cyan)' : 'none',
                  color: activeTab === 'view' ? 'var(--color-text-primary)' : 'rgba(0, 0, 0, 0.5)',
                  fontWeight: activeTab === 'view' ? '700' : '400',
                  fontSize: 'var(--font-size-l)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                View Profiles
              </button>
              <button
                onClick={() => setActiveTab('create')}
                style={{
                  padding: 'var(--spacing-s) var(--spacing-l)',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'create' ? '3px solid var(--color-accent-cyan)' : 'none',
                  color: activeTab === 'create' ? 'var(--color-text-primary)' : 'rgba(0, 0, 0, 0.5)',
                  fontWeight: activeTab === 'create' ? '700' : '400',
                  fontSize: 'var(--font-size-l)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Create Profile
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                style={{
                  padding: 'var(--spacing-s) var(--spacing-l)',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'manage' ? '3px solid var(--color-accent-cyan)' : 'none',
                  color: activeTab === 'manage' ? 'var(--color-text-primary)' : 'rgba(0, 0, 0, 0.5)',
                  fontWeight: activeTab === 'manage' ? '700' : '400',
                  fontSize: 'var(--font-size-l)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Manage Content
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'view' && (
              <div>
                <ProfileView />
              </div>
            )}

            {activeTab === 'create' && (
              <div style={{ maxWidth: '600px' }}>
                <AthleteProfileForm />
              </div>
            )}

            {activeTab === 'manage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxl)', maxWidth: '600px' }}>
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
            <h1 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center' }}>
              Welcome to AthliFi
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.6)', textAlign: 'center', maxWidth: '500px' }}>
              The decentralized platform connecting athletes with their supporters. Connect your wallet to get started.
            </p>
            <div
              style={{
                padding: 'var(--spacing-xl)',
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'rgba(7, 191, 217, 0.1)',
                border: '2px solid var(--color-accent-cyan)',
              }}
            >
              <p style={{ fontSize: 'var(--font-size-l)', color: 'var(--color-accent-cyan)', fontWeight: '600' }}>
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