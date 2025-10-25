import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient, useSignTransaction } from "@mysten/dapp-kit";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

/**
 * ⚠️ WARNING: ONLY FOR DEMO/TESTING!
 * NEVER put private keys in frontend code in production!
 * This should only be used for hackathons/demos
 */

// Generate a sponsor keypair (do this once and save it)
// const sponsorKeypair = new Ed25519Keypair();
// console.log('Sponsor Address:', sponsorKeypair.getPublicKey().toSuiAddress());
// console.log('Sponsor Private Key (base64):', Buffer.from(sponsorKeypair.getSecretKey()).toString('base64'));
// Then fund this address with SUI from faucet

// ⚠️ DEMO ONLY: Replace with your sponsor keypair
const DEMO_SPONSOR_PRIVATE_KEY = "YOUR_BASE64_PRIVATE_KEY_HERE"; // Get from env or generate

export function useSponsoredTransactionSimple() {
  const suiClient = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();

  const executeSponsoredTransaction = async (tx: Transaction) => {
    try {
      // Create sponsor keypair from private key
      const sponsorKeypair = Ed25519Keypair.fromSecretKey(
        Buffer.from(DEMO_SPONSOR_PRIVATE_KEY, 'base64')
      );
      const sponsorAddress = sponsorKeypair.getPublicKey().toSuiAddress();

      console.log('🔐 Sponsor Address:', sponsorAddress);

      // Set sponsor as gas payer
      tx.setSender(sponsorAddress); // User's address
      tx.setGasOwner(sponsorAddress); // Sponsor pays gas
      tx.setGasBudget(100000000);

      // Build transaction
      const txBytes = await tx.build({ client: suiClient });

      // Get user's signature
      const { signature: userSignature } = await signTransaction({
        transaction: tx,
      });

      // Get sponsor's signature
      const sponsorSignature = await sponsorKeypair.signTransaction(txBytes);

      // Combine signatures and execute
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: txBytes,
        signature: [userSignature, sponsorSignature.signature],
      });

      console.log('✅ Sponsored transaction executed!');
      console.log('💰 Gas paid by sponsor:', sponsorAddress);
      console.log('Transaction:', result.digest);

      return result;

    } catch (error) {
      console.error('❌ Sponsored transaction failed:', error);
      throw error;
    }
  };

  return { executeSponsoredTransaction };
}

/**
 * Example usage in a component:
 *
 * const { executeSponsoredTransaction } = useSponsoredTransactionSimple();
 *
 * const createProfile = async () => {
 *   const tx = new Transaction();
 *
 *   tx.moveCall({
 *     arguments: [
 *       tx.pure.string("name"),
 *       tx.pure.string("lastname"),
 *       // ...
 *     ],
 *     target: `${packageId}::about::create`,
 *   });
 *
 *   const result = await executeSponsoredTransaction(tx);
 *   // User doesn't pay gas! 🎉
 * };
 */
