import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider, useSuiClientContext } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import { registerEnokiWallets } from "@mysten/enoki";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";

const queryClient = new QueryClient();

// Enoki Wallet Registration Component
function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    const ENOKI_API_KEY = 'enoki_public_9e02d6ce14c6c38c00f4faaddaad379c';
    const GOOGLE_CLIENT_ID = '989645441623-54j99gj548febdd95mvef9limf3ct4of.apps.googleusercontent.com';

    try {
      const { unregister } = registerEnokiWallets({
        apiKey: ENOKI_API_KEY,
        providers: {
          google: {
            clientId: GOOGLE_CLIENT_ID,
          },
        },
        client: client as any,
        network: network as 'testnet' | 'mainnet',
      });

      console.log('✅ Enoki wallets registered successfully with Google OAuth!');
      console.log('🔑 Google Client ID configured');
      return unregister;
    } catch (error) {
      console.error('❌ Failed to register Enoki wallets:', error);
    }
  }, [client, network]);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <RegisterEnokiWallets />
          <WalletProvider autoConnect>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
