import React from "react";
import { ConnectButton } from "@mysten/dapp-kit";

export function Header() {
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

        <ConnectButton />
      </div>
    </header>
  );
}

