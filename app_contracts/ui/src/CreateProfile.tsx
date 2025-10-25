import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, TextField } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export function CreateProfile({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const packageId = useNetworkVariable("helloWorldPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");

  const create = () => {
    setWaitingForTxn(true);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.pure.string(name),
        tx.pure.string(lastname),
        tx.pure.string(email),
        tx.pure.string(website),
        tx.pure.string(about),
      ],
      target: `${packageId}::about::create_profile`,
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
      <TextField.Root placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField.Root placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
      <TextField.Root placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField.Root placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
      <TextField.Root placeholder="About" value={about} onChange={(e) => setAbout(e.target.value)} />

      <Button
        size="3"
        onClick={() => {
          create();
        }}
        disabled={waitingForTxn}
      >
        {waitingForTxn ? (
          <ClipLoader size={20} />
        ) : (
          "Create Profile"
        )}
      </Button>
    </Container>
  );
}
