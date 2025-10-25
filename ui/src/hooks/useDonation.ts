import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_DECIMALS } from "../constants";

interface UseDonationOptions {
  onSuccess?: () => void;
}

export const useDonation = ({ onSuccess }: UseDonationOptions = {}) => {
  const { mutate: signAndExecute, isPending } =
    useSignAndExecuteTransactionBlock();

  const donate = (recipient: string, amount: number) => {
    const txb = new Transaction();
    const [coin] = txb.splitCoins(txb.gas, [
      txb.pure.u64(amount * 10 ** SUI_DECIMALS),
    ]);
    txb.transferObjects([coin], recipient);

    signAndExecute(
      {
        transactionBlock: txb,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return { donate, isPending };
};
