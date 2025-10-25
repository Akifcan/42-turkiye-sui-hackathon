import { useCurrentAccount } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function HomePage() {
  const currentAccount = useCurrentAccount();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: 'var(--spacing-xl)',
        padding: 'var(--spacing-xl)',
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
        The decentralized platform connecting athletes with their supporters. 
        {currentAccount ? ' Ready to explore!' : ' Connect your wallet to get started.'}
      </p>

      {!currentAccount ? (
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
      ) : (
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-m)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link to="/create">
            <Button variant="accent">
              Create Profile
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary">
              Manage Content
            </Button>
          </Link>
        </div>
      )}

      <div
        style={{
          marginTop: 'var(--spacing-xxl)',
          textAlign: 'center',
        }}
      >
        <p style={{ 
          fontSize: 'var(--font-size-small)', 
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-family-body)',
          marginBottom: 'var(--spacing-s)',
        }}>
          Explore athlete profiles:
        </p>
        <p style={{ 
          fontSize: 'var(--font-size-body)', 
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family-body)',
        }}>
          Try visiting <code style={{ 
            padding: '2px 6px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-s)',
            fontFamily: 'monospace',
          }}>/usain-bolt</code> or any athlete username
        </p>
      </div>
    </div>
  );
}

