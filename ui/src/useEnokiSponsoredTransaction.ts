import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from "react";

const BACKEND_API_URL = 'http://localhost:3001';
const USE_SPONSORED_TRANSACTIONS = false; // Set to true when allow-list is configured

/**
 * Hook for executing Enoki sponsored transactions
 * Implementation based on: https://docs.enoki.mystenlabs.com/ts-sdk/sponsored-transactions
 * 
 * This requires a backend service with Enoki private API key
 * 
 * NOTE: Currently disabled because contract methods need to be added to Enoki allow-list
 * Visit https://portal.enoki.mystenlabs.com/ to configure allow-list
 */
export function useEnokiSponsoredTransaction() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [isExecuting, setIsExecuting] = useState(false);

  const executeSponsoredTransaction = async (
    transaction: Transaction,
    options?: {
      onSuccess?: (result: any) => void;
      onError?: (error: any) => void;
    }
  ) => {
    if (!currentAccount) {
      console.error('❌ No wallet connected');
      if (options?.onError) {
        options.onError(new Error('No wallet connected'));
      }
      return;
    }

    // If sponsored transactions are disabled, use regular transaction
    if (!USE_SPONSORED_TRANSACTIONS) {
      console.log('💳 Using regular transaction (sponsored transactions disabled)');
      console.log('ℹ️ To enable sponsored transactions, add your contract methods to Enoki allow-list');
      
      signAndExecute(
        { transaction },
        {
          onSuccess: (result) => {
            console.log('✅ Transaction executed successfully!');
            console.log('Transaction digest:', result.digest);
            if (options?.onSuccess) {
              options.onSuccess(result);
            }
          },
          onError: (error) => {
            console.error('❌ Transaction failed:', error);
            if (options?.onError) {
              options.onError(error);
            }
          },
        }
      );
      return;
    }

    setIsExecuting(true);
    console.log('💰 Starting Enoki sponsored transaction...');

    try {
      // Step 1: Build transaction with onlyTransactionKind
      console.log('📝 Step 1: Building transaction bytes...');
      console.log('Current Account:', currentAccount);
      
      const transactionBlockKindBytes = await transaction.build({
        client: suiClient,
        onlyTransactionKind: true,
      });

      // Convert Uint8Array to base64
      const transactionBlockKindBytesBase64 = btoa(
        String.fromCharCode(...Array.from(transactionBlockKindBytes))
      );

      console.log('Transaction bytes length:', transactionBlockKindBytes.length);

      // Get zkLogin JWT from the account
      // Try different possible locations for the JWT
      const zkLoginJwt = 
        (currentAccount as any).zkLoginJwt || 
        (currentAccount as any).jwt ||
        (currentAccount as any).session?.jwt ||
        (currentAccount as any).metadata?.jwt ||
        undefined;

      console.log('zkLogin JWT found:', zkLoginJwt ? 'Yes ✅' : 'No ❌');
      console.log('JWT preview:', zkLoginJwt ? zkLoginJwt.substring(0, 50) + '...' : 'N/A');

      // Prepare the request payload
      const payload: any = {
        transactionBlockKindBytes: transactionBlockKindBytesBase64,
        sender: currentAccount.address,
      };

      // Only add zkLoginJwt if it exists
      if (zkLoginJwt) {
        payload.zkLoginJwt = zkLoginJwt;
      }

      console.log('Payload to backend:', {
        transactionBlockKindBytes: payload.transactionBlockKindBytes.substring(0, 50) + '...',
        sender: payload.sender,
        zkLoginJwt: payload.zkLoginJwt ? 'Present ✅' : 'Missing ❌',
      });

      // Step 2: Request sponsorship from backend
      console.log('📝 Step 2: Requesting sponsorship from backend...');
      console.log('Backend URL:', BACKEND_API_URL);
      
      const sponsorResponse = await fetch(`${BACKEND_API_URL}/api/sponsor-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!sponsorResponse.ok) {
        const errorData = await sponsorResponse.json();
        throw new Error(errorData.error || 'Failed to sponsor transaction');
      }

      const sponsorData = await sponsorResponse.json();
      console.log('✅ Step 2 Complete: Transaction sponsored');
      console.log('Transaction Digest:', sponsorData.digest);

      // Step 3: Sign the transaction bytes
      console.log('📝 Step 3: Signing transaction...');
      // Convert base64 to Uint8Array
      const bytesToSign = Uint8Array.from(atob(sponsorData.bytes), c => c.charCodeAt(0));
      
      // Use wallet to sign the bytes
      const signature = await (currentAccount as any).signTransactionBlock?.({
        transactionBlock: bytesToSign,
      });

      if (!signature) {
        throw new Error('Failed to sign transaction');
      }

      console.log('✅ Step 3 Complete: Transaction signed');

      // Step 4: Execute sponsored transaction
      console.log('📝 Step 4: Executing sponsored transaction...');
      const executePayload: any = {
        digest: sponsorData.digest,
        signature: signature,
      };

      // Only add zkLoginJwt if it exists
      if (zkLoginJwt) {
        executePayload.zkLoginJwt = zkLoginJwt;
      }

      const executeResponse = await fetch(`${BACKEND_API_URL}/api/execute-sponsored-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(executePayload),
      });

      if (!executeResponse.ok) {
        const errorData = await executeResponse.json();
        throw new Error(errorData.error || 'Failed to execute sponsored transaction');
      }

      const executeData = await executeResponse.json();
      console.log('✅ Step 4 Complete: Transaction executed successfully!');
      console.log('💰 Gas fees sponsored by Enoki');
      console.log('Final Digest:', executeData.digest);

      setIsExecuting(false);

      if (options?.onSuccess) {
        options.onSuccess(executeData);
      }

      return executeData;

    } catch (error: any) {
      console.error('❌ Sponsored transaction failed:', error);
      setIsExecuting(false);

      if (options?.onError) {
        options.onError(error);
      }
      
      throw error;
    }
  };

  return {
    executeSponsoredTransaction,
    isExecuting,
  };
}

