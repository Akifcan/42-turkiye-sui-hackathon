import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Greeting } from './Greeting';
import { CreateGreeting } from "./CreateGreeting";
import { CreateAbout } from "./CreateAbout";
import { AddSocialLink } from "./AddSocialLink";
import { ViewProfile } from "./ViewProfile";

function App() {
  const currentAccount = useCurrentAccount();
  const [greetingId, setGreeting] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        align={"center"}
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp Starter Template</Heading>
        </Box>

        <Box style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {currentAccount && (
            <Button
              variant="soft"
              onClick={() => {
                window.open(`https://faucet.sui.io/?address=${currentAccount.address}`, '_blank');
              }}
            >
              Get Testnet SUI
            </Button>
          )}
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {currentAccount ? (
            <Flex direction="column" gap="6">
              {greetingId ? (
                <Greeting id={greetingId} />
              ) : (
                <CreateGreeting
                  onCreated={(id) => {
                    window.location.hash = id;
                    setGreeting(id);
                  }}
                />
              )}

              <Box style={{ borderTop: "1px solid var(--gray-a4)", paddingTop: "2rem" }}>
                <CreateAbout />
              </Box>

              <Box style={{ borderTop: "1px solid var(--gray-a4)", paddingTop: "2rem" }}>
                <AddSocialLink />
              </Box>

              <Box style={{ borderTop: "1px solid var(--gray-a4)", paddingTop: "2rem" }}>
                <ViewProfile />
              </Box>
            </Flex>
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;