import { getFullnodeUrl } from "@mysten/sui/client";
import {
  TESTNET_HELLO_WORLD_PACKAGE_ID,
  TESTNET_SUILINK_PACKAGE_ID,
  TESTNET_REGISTRY_ID,
  TESTNET_LIST_REGISTRY_ID,
  TESTNET_NFT_REGISTRY_ID,
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        helloWorldPackageId: TESTNET_HELLO_WORLD_PACKAGE_ID,
        suilinkPackageId: TESTNET_SUILINK_PACKAGE_ID,
        registryId: TESTNET_REGISTRY_ID,
        listRegistryId: TESTNET_LIST_REGISTRY_ID,
        nftRegistryId: TESTNET_NFT_REGISTRY_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
