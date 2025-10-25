import { useState } from 'react';
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { bcs } from "@mysten/sui/bcs";
import { AboutProfile, SocialLink, NFTItem, ProfileData } from '../types';

export function useProfileData() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const registryId = useNetworkVariable("registryId");
  const listRegistryId = useNetworkVariable("listRegistryId");
  const nftRegistryId = useNetworkVariable("nftRegistryId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async (username: string): Promise<ProfileData> => {
    if (!username || !currentAccount) {
      throw new Error("Username and account are required");
    }

    setLoading(true);
    setError("");

    try {
      let profile: AboutProfile | null = null;
      let links: SocialLink[] = [];
      let nfts: NFTItem[] = [];

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

      if (aboutResult.results && aboutResult.results[0] && aboutResult.results[0].returnValues) {
        const returnValues = aboutResult.results[0].returnValues;
        if (returnValues && returnValues[0]) {
          const [bytes] = returnValues[0];
          const hexString = Array.from(new Uint8Array(bytes))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          const aboutObjectId = '0x' + hexString;

          const aboutObject = await suiClient.getObject({
            id: aboutObjectId,
            options: { showContent: true },
          });

          if (aboutObject.data && aboutObject.data.content && aboutObject.data.content.dataType === "moveObject") {
            const fields = aboutObject.data.content.fields as any;
            profile = {
              name: fields.name || "",
              lastname: fields.lastname || "",
              website: fields.website || "",
              about: fields.about || "",
            };
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
            links = parsedLinks.map((link: any) => ({
              sitename: link.sitename,
              siteurl: link.siteurl,
              description: link.description,
              iconurl: link.iconurl,
            }));
          } catch (parseError) {
            console.log("No social links found or parse error:", parseError);
          }
        }
      }

      // 3. Fetch NFT List
      const nftsTx = new Transaction();
      nftsTx.moveCall({
        arguments: [
          nftsTx.object(nftRegistryId),
          nftsTx.pure.string(username),
        ],
        target: `${suilinkPackageId}::nft_list::get_nfts`,
      });

      const nftsResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: nftsTx,
        sender: currentAccount.address,
      });

      if (nftsResult.results && nftsResult.results[0] && nftsResult.results[0].returnValues) {
        const returnValues = nftsResult.results[0].returnValues;
        if (returnValues && returnValues[0]) {
          const [bytes] = returnValues[0];
          try {
            const NFTItemStruct = bcs.struct('NFTItem', {
              nft_url: bcs.string(),
              title: bcs.string(),
              description: bcs.string(),
            });
            const NFTItemsVector = bcs.vector(NFTItemStruct);
            const parsedNFTs = NFTItemsVector.parse(new Uint8Array(bytes));
            nfts = parsedNFTs.map((nft: any) => ({
              nft_url: nft.nft_url,
              title: nft.title,
              description: nft.description,
            }));
          } catch (parseError) {
            console.log("No NFTs found or parse error:", parseError);
          }
        }
      }

      setLoading(false);
      return { profile, links, nfts };
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch profile";
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  };

  return { fetchProfile, loading, error };
}

