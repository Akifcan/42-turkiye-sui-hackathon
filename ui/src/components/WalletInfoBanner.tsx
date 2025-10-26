import { useCurrentAccount } from '@mysten/dapp-kit';

export function WalletInfoBanner() {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) return null;

  // Check if user is using zkLogin
  const hasZkLoginJwt = !!(
    (currentAccount as any).zkLoginJwt ||
    (currentAccount as any).jwt ||
    (currentAccount as any).session?.jwt ||
    (currentAccount as any).metadata?.jwt
  );

  // Only show banner if NOT using zkLogin
  if (hasZkLoginJwt) {
    return (
      <div
        style={{
          padding: 'var(--spacing-m)',
          borderRadius: 'var(--radius-m)',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          marginBottom: 'var(--spacing-m)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#4CAF50',
            fontSize: 'var(--font-size-small)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          ✅ <strong>Sponsored Transactions Active!</strong> You're connected with Enoki
          (Google OAuth) - all transactions are gas-free! 💰
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 'var(--spacing-m)',
        borderRadius: 'var(--radius-m)',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        border: '1px solid rgba(255, 193, 7, 0.3)',
        marginBottom: 'var(--spacing-m)',
      }}
    >
      <p
        style={{
          margin: '0 0 var(--spacing-xs) 0',
          color: '#F57C00',
          fontSize: 'var(--font-size-small)',
          fontFamily: 'var(--font-family-body)',
          fontWeight: 'var(--font-weight-bold)',
        }}
      >
        ℹ️ Regular Wallet Connected
      </p>
      <p
        style={{
          margin: 0,
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-small)',
          fontFamily: 'var(--font-family-body)',
        }}
      >
        You'll pay gas fees for transactions. For <strong>free transactions</strong>,
        disconnect and select the <strong>"Enoki"</strong> wallet option (Google OAuth).
      </p>
    </div>
  );
}

