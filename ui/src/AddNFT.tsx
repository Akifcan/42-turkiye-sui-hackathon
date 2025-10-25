import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, TextField, Flex, Text, TextArea } from "@radix-ui/themes";
import { useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useEnokiSponsoredTransaction } from "./useEnokiSponsoredTransaction";

export function AddNFT() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const nftRegistryId = useNetworkVariable("nftRegistryId");
  const suiClient = useSuiClient();
  const { executeSponsoredTransaction } = useEnokiSponsoredTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    nft_url: "",
    title: "",
    description: "",
  });

  const addNFT = () => {
    setWaitingForTxn(true);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(nftRegistryId),
        tx.pure.string(formData.username),
        tx.pure.string(formData.nft_url),
        tx.pure.string(formData.title),
        tx.pure.string(formData.description),
      ],
      target: `${suilinkPackageId}::nft_list::add_nft`,
    });

    executeSponsoredTransaction(tx, {
      onSuccess: (tx) => {
        suiClient
          .waitForTransaction({ digest: tx.digest, options: { showEffects: true } })
          .then(() => {
            console.log("✅ NFT added successfully!");
            console.log("Username:", formData.username);
            console.log("Title:", formData.title);
            console.log("NFT URL:", formData.nft_url);

            setWaitingForTxn(false);

            // Reset form (keep username)
            setFormData({
              username: formData.username,
              nft_url: "",
              title: "",
              description: "",
            });
          });
      },
      onError: (error) => {
        console.error("❌ Failed to add NFT:", error);
        setWaitingForTxn(false);
      },
    });
  };

  return (
    <Container>
      <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
        <Text size="5" weight="bold">Add NFT</Text>
        <Text size="2" color="gray">
          Add NFTs to your gallery
        </Text>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Username</Text>
          <TextField.Root
            placeholder="xyz"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Title</Text>
          <TextField.Root
            placeholder="My Cool NFT"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">NFT URL</Text>
          <TextField.Root
            placeholder="https://example.com/nft/1234"
            value={formData.nft_url}
            onChange={(e) => setFormData({ ...formData, nft_url: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Description</Text>
          <TextArea
            placeholder="Description of the NFT"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={waitingForTxn}
            rows={3}
          />
        </Flex>

        <Button
          size="3"
          onClick={() => {
            addNFT();
          }}
          disabled={waitingForTxn || !formData.username || !formData.nft_url || !formData.title}
        >
          {waitingForTxn ? (
            <ClipLoader size={20} />
          ) : (
            "Add NFT"
          )}
        </Button>
      </Flex>
    </Container>
  );
}
