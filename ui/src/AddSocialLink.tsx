import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, TextField, Flex, Text, TextArea } from "@radix-ui/themes";
import { useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useEnokiSponsoredTransaction } from "./useEnokiSponsoredTransaction";

export function AddSocialLink() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const listRegistryId = useNetworkVariable("listRegistryId");
  const suiClient = useSuiClient();
  const { executeSponsoredTransaction } = useEnokiSponsoredTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    sitename: "",
    siteurl: "",
    description: "",
    iconurl: "",
  });

  const addLink = () => {
    setWaitingForTxn(true);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(listRegistryId),
        tx.pure.string(formData.username),
        tx.pure.string(formData.sitename),
        tx.pure.string(formData.siteurl),
        tx.pure.string(formData.description),
        tx.pure.string(formData.iconurl),
      ],
      target: `${suilinkPackageId}::list::add_link`,
    });

    executeSponsoredTransaction(tx, {
      onSuccess: (tx) => {
        suiClient
          .waitForTransaction({ digest: tx.digest, options: { showEffects: true } })
          .then(() => {
            console.log("✅ Social link added successfully!");
            console.log("Username:", formData.username);
            console.log("Site:", formData.sitename);
            console.log("URL:", formData.siteurl);

            setWaitingForTxn(false);

            // Reset form (keep username)
            setFormData({
              username: formData.username,
              sitename: "",
              siteurl: "",
              description: "",
              iconurl: "",
            });
          });
      },
      onError: (error) => {
        console.error("❌ Failed to add link:", error);
        setWaitingForTxn(false);
      },
    });
  };

  return (
    <Container>
      <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
        <Text size="5" weight="bold">Add Social Link</Text>
        <Text size="2" color="gray">
          Add social media links to your profile
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
          <Text size="2" weight="medium">Site Name</Text>
          <TextField.Root
            placeholder="Twitter"
            value={formData.sitename}
            onChange={(e) => setFormData({ ...formData, sitename: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Site URL</Text>
          <TextField.Root
            placeholder="https://twitter.com/username"
            value={formData.siteurl}
            onChange={(e) => setFormData({ ...formData, siteurl: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Description</Text>
          <TextArea
            placeholder="My Twitter account"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={waitingForTxn}
            rows={2}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Icon URL</Text>
          <TextField.Root
            placeholder="https://example.com/twitter-icon.png"
            value={formData.iconurl}
            onChange={(e) => setFormData({ ...formData, iconurl: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Button
          size="3"
          onClick={() => {
            addLink();
          }}
          disabled={waitingForTxn || !formData.username || !formData.sitename || !formData.siteurl}
        >
          {waitingForTxn ? (
            <ClipLoader size={20} />
          ) : (
            "Add Social Link"
          )}
        </Button>
      </Flex>
    </Container>
  );
}
