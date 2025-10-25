import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export function Header() {
  const currentAccount = useCurrentAccount();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--color-brand-primary)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: 'var(--spacing-m) var(--spacing-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-m)' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          AthliFi
        </h1>
        <span
          style={{
            fontSize: 'var(--font-size-s)',
            color: 'var(--color-accent-cyan)',
            fontWeight: '600',
            backgroundColor: 'rgba(7, 191, 217, 0.1)',
            padding: '4px 8px',
            borderRadius: '8px',
          }}
        >
          The Inner Circle
        </span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-s)', alignItems: 'center' }}>
        {currentAccount && (
          <button
            onClick={() => {
              window.open(`https://faucet.sui.io/?address=${currentAccount.address}`, '_blank');
            }}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-m)',
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-accent-blue)',
              backgroundColor: 'transparent',
              color: 'var(--color-accent-blue)',
              fontSize: 'var(--font-size-s)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Get Testnet SUI
          </button>
        )}
        <ConnectButton />
      </div>
    </header>
  );
}

