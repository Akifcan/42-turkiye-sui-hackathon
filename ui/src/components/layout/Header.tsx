import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const currentAccount = useCurrentAccount();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 'var(--spacing-m)',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 var(--spacing-m)',
        zIndex: 100,
        marginBottom: 'var(--spacing-l)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--spacing-l)',
          width: 'auto',
          padding: 'var(--spacing-s) var(--spacing-l)',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: 'var(--radius-l)',
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.15)',
        }}
      >
        <Link 
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-m)',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              margin: 0,
              fontFamily: 'var(--font-family-heading)',
              letterSpacing: '-0.5px',
              whiteSpace: 'nowrap',
            }}
          >
            AthliFi
          </h1>
          
          <span
            style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-brand-primary)',
              fontWeight: 'var(--font-weight-medium)',
              backgroundColor: 'rgba(16, 149, 236, 0.15)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-s)',
              fontFamily: 'var(--font-family-body)',
              whiteSpace: 'nowrap',
            }}
          >
            The Inner Circle
          </span>
        </Link>

        {currentAccount && (
          <nav style={{ 
            display: 'flex', 
            gap: 'var(--spacing-m)',
            alignItems: 'center',
          }}>
            <Link
              to="/create"
              style={{
                textDecoration: 'none',
                fontSize: 'var(--font-size-body)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: isActive('/create') ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive('/create') ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                padding: 'var(--spacing-xs) var(--spacing-s)',
                borderRadius: 'var(--radius-s)',
                backgroundColor: isActive('/create') ? 'rgba(16, 149, 236, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              Create
            </Link>
            <Link
              to="/dashboard"
              style={{
                textDecoration: 'none',
                fontSize: 'var(--font-size-body)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: isActive('/dashboard') ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive('/dashboard') ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                padding: 'var(--spacing-xs) var(--spacing-s)',
                borderRadius: 'var(--radius-s)',
                backgroundColor: isActive('/dashboard') ? 'rgba(16, 149, 236, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              Dashboard
            </Link>
          </nav>
        )}

        <ConnectButton />
      </div>
    </header>
  );
}

