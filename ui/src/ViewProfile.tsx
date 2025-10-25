import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, TextField, Flex, Text, Card, Box, Separator } from "@radix-ui/themes";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { bcs } from "@mysten/sui/bcs";

interface AboutProfile {
  name: string;
  lastname: string;
  website: string;
  about: string;
}

interface SocialLink {
  sitename: string;
  siteurl: string;
  description: string;
  iconurl: string;
}

export function ViewProfile() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const registryId = useNetworkVariable("registryId");
  const listRegistryId = useNetworkVariable("listRegistryId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<AboutProfile | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (!username || !currentAccount) return;

    setLoading(true);
    setError("");
    setProfile(null);
    setLinks([]);

    try {
      // 1. Fetch About Profile
      const aboutTx = new Transaction();
      aboutTx.moveCall({
        arguments: [
          aboutTx.object(registryId),
          aboutTx.pure.string(username),
        ],
        target: `${suilinkPackageId}::registry::get_about_id`,
      });

      const aboutResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: aboutTx,
        sender: currentAccount.address,
      });

      console.log("About DevInspect Result:", aboutResult);

      // Parse About Object ID
      if (aboutResult.results && aboutResult.results[0] && aboutResult.results[0].returnValues) {
        const returnValues = aboutResult.results[0].returnValues;
        if (returnValues && returnValues[0]) {
          const [bytes] = returnValues[0];
          const hexString = Array.from(new Uint8Array(bytes))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          const aboutObjectId = '0x' + hexString;

          console.log("✅ Found About Object ID:", aboutObjectId);

          // Fetch the About object
          const aboutObject = await suiClient.getObject({
            id: aboutObjectId,
            options: { showContent: true },
          });

          console.log("About Object:", aboutObject);

          if (aboutObject.data && aboutObject.data.content && aboutObject.data.content.dataType === "moveObject") {
            const fields = aboutObject.data.content.fields as any;

            setProfile({
              name: fields.name || "",
              lastname: fields.lastname || "",
              website: fields.website || "",
              about: fields.about || "",
            });

            console.log("✅ Profile loaded successfully!");
          }
        }
      }

      // 2. Fetch Social Links
      const linksTx = new Transaction();
      linksTx.moveCall({
        arguments: [
          linksTx.object(listRegistryId),
          linksTx.pure.string(username),
        ],
        target: `${suilinkPackageId}::list::get_links`,
      });

      const linksResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: linksTx,
        sender: currentAccount.address,
      });

      console.log("Links DevInspect Result:", linksResult);

      // Parse Links
      if (linksResult.results && linksResult.results[0] && linksResult.results[0].returnValues) {
        const returnValues = linksResult.results[0].returnValues;
        if (returnValues && returnValues[0]) {
          const [bytes] = returnValues[0];

          try {
            const SocialLinkStruct = bcs.struct('SocialLink', {
              sitename: bcs.string(),
              siteurl: bcs.string(),
              description: bcs.string(),
              iconurl: bcs.string(),
            });

            const SocialLinksVector = bcs.vector(SocialLinkStruct);
            const parsedLinks = SocialLinksVector.parse(new Uint8Array(bytes));

            console.log("✅ Parsed links:", parsedLinks);

            const socialLinks: SocialLink[] = parsedLinks.map((link: any) => ({
              sitename: link.sitename,
              siteurl: link.siteurl,
              description: link.description,
              iconurl: link.iconurl,
            }));

            setLinks(socialLinks);
            console.log(`✅ Found ${socialLinks.length} social link(s)!`);
          } catch (parseError) {
            console.log("No social links found or parse error:", parseError);
          }
        }
      }

      if (!profile && links.length === 0) {
        setError("Profile not found for this username");
      }

    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Flex direction="column" gap="4" style={{ maxWidth: 600 }}>
        <Text size="6" weight="bold">View Profile</Text>
        <Text size="2" color="gray">
          Enter a username to view their complete profile
        </Text>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Username</Text>
          <Flex gap="2">
            <TextField.Root
              placeholder="Enter username (e.g., xyz)"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
              disabled={loading}
              style={{ flex: 1 }}
              size="3"
            />
            <Button
              size="3"
              onClick={fetchProfile}
              disabled={loading || !username || !currentAccount}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "View Profile"}
            </Button>
          </Flex>
          {username && (
            <Text size="1" color="gray">
              Looking for: abc.com/{username}
            </Text>
          )}
        </Flex>

        {error && (
          <Card style={{ padding: "1rem", backgroundColor: "var(--red-a3)" }}>
            <Text size="2" color="red">❌ {error}</Text>
          </Card>
        )}

        {(profile || links.length > 0) && (
          <Flex direction="column" gap="4">
            {/* About Section */}
            {profile && (
              <Card style={{ padding: "2rem", backgroundColor: "var(--blue-a2)" }}>
                <Flex direction="column" gap="3">
                  <Text size="6" weight="bold" color="blue">
                    {profile.name} {profile.lastname}
                  </Text>

                  {profile.website && (
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold" color="gray">Website:</Text>
                      <Text size="3">
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue-9)" }}>
                          {profile.website}
                        </a>
                      </Text>
                    </Flex>
                  )}

                  {profile.about && (
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold" color="gray">About:</Text>
                      <Text size="3">{profile.about}</Text>
                    </Flex>
                  )}

                  <Text size="1" color="gray">
                    🔗 abc.com/{username}
                  </Text>
                </Flex>
              </Card>
            )}

            {/* Social Links Section */}
            {links.length > 0 && (
              <Flex direction="column" gap="3">
                <Separator size="4" />
                <Text size="5" weight="bold">Social Links ({links.length})</Text>

                {links.map((link, index) => (
                  <Card key={index} style={{ padding: "1.5rem", backgroundColor: "var(--gray-a2)" }}>
                    <Flex direction="column" gap="2">
                      <Flex align="center" gap="3">
                        {link.iconurl && (
                          <Box style={{ width: 40, height: 40, flexShrink: 0 }}>
                            <img
                              src={link.iconurl}
                              alt={link.sitename}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </Box>
                        )}
                        <Text size="5" weight="bold">{link.sitename}</Text>
                      </Flex>

                      {link.description && (
                        <Text size="2" color="gray">{link.description}</Text>
                      )}

                      <Text size="3">
                        <a
                          href={link.siteurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--blue-9)", textDecoration: "none" }}
                        >
                          {link.siteurl} →
                        </a>
                      </Text>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Flex>
        )}

        {!currentAccount && (
          <Text size="2" color="orange">
            ⚠️ Please connect your wallet to view profiles
          </Text>
        )}
      </Flex>
    </Container>
  );
}
