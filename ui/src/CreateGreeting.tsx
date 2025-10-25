import { Transaction } from "@mysten/sui/transactions";
import { Button, Container } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export function CreateGreeting({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const helloWorldPackageId = useNetworkVariable("helloWorldPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();	

  const [waitingForTxn, setWaitingForTxn] = useState(false);

  const create = () => {

    setWaitingForTxn(true);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${helloWorldPackageId}::greeting::new`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient.waitForTransaction({ digest: tx.digest, options: { showEffects: true } }).then(async (result) => {
            const objectId = result.effects?.created?.[0]?.reference?.objectId;
            if (objectId) {
              onCreated(objectId);
              setWaitingForTxn(false);
            }
          });
        },
      },
    );
  }

  return (
    <Container>
     
    </Container>
  );
}