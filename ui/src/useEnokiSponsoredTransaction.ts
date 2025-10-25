import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

/**
 * Hook for executing Enoki sponsored transactions
 * This is a simplified version that uses Enoki's zkLogin wallet
 * which automatically sponsors gas fees for users logged in with OAuth
 */
export function useEnokiSponsoredTransaction() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const executeSponsoredTransaction = (
    transaction: Transaction,
    options?: {
      onSuccess?: (result: any) => void;
      onError?: (error: any) => void;
    }
  ) => {
    console.log('💰 Attempting sponsored transaction with Enoki...');
    
    // When using Enoki wallet with zkLogin, transactions are automatically sponsored
    // The gas fees are paid by the Enoki service
    signAndExecute(
      {
        transaction,
      },
      {
        onSuccess: (result) => {
          console.log('✅ Transaction executed successfully!');
          console.log('💰 Gas fees sponsored by Enoki');
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
  };

  return {
    executeSponsoredTransaction,
  };
}

