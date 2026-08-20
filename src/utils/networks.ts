import { useEffect, useState } from "react";

export type NetworkType = "mainnet" | "sepolia";

export const networkParams = {
  mainnet: {
    chainId: "0xdef1", // 57073 in hexadecimal
    chainName: "Ink Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-gel.inkonchain.com"],
    blockExplorerUrls: ["https://explorer.inkonchain.com/"],
  },
  sepolia: {
    chainId: "0xba5ed", // 763373
    chainName: "Ink Sepolia",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-gel-sepolia.inkonchain.com"],
    blockExplorerUrls: ["https://explorer-sepolia.inkonchain.com"],
  },
} as const;

// QUALITY FIX: Replaced untyped provider interactions with strict EIP-1193 boundaries 
// and implemented runtime validation for the eth_chainId response.
async function getCurrentChainId(
  provider: EIP1193Provider
): Promise<string | null> {
  const chainId = await provider.request({ method: "eth_chainId" });
  return typeof chainId === "string" ? chainId : null;
}

export async function isNetworkAdded(network: NetworkType): Promise<boolean> {
  const provider = window.ethereum;
  if (!provider) return false;

  try {
    const chainId = await getCurrentChainId(provider);
    return chainId?.toLowerCase() === networkParams[network].chainId;
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
}

export type UseNetworkResponse = {
  isWalletInstalled: boolean;
  isAdded: boolean;
  isSelected: boolean;
  addNetwork: () => Promise<void>;
  selectNetwork: () => Promise<void>;
};

export function useNetwork(network: NetworkType): UseNetworkResponse {
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  // Check whether the network is added and selected on mount and when it changes.
  useEffect(() => {
    const provider = window.ethereum;
    const checkNetwork = async () => {
      if (provider) {
        try {
          const chainId = await getCurrentChainId(provider);
          const isCurrentNetwork =
            chainId?.toLowerCase() === networkParams[network].chainId;
          setIsSelected(isCurrentNetwork);
          setIsAdded((previous) => isCurrentNetwork || previous);
        } catch (error) {
          console.error("Error checking network:", error);
        }
      }
      setIsWalletInstalled(provider !== undefined);
    };

    void checkNetwork();

    // QUALITY FIX: Scoped listeners to `chainChanged` and ensured proper cleanup 
    // on unmount to prevent memory leaks and unexpected behavior.
    if (provider) {
      provider.on("chainChanged", checkNetwork);
      return () => {
        provider.removeListener("chainChanged", checkNetwork);
      };
    }
  }, [network]);

  async function addNetwork(): Promise<void> {
    const provider = window.ethereum;
    if (!provider) return;

    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [networkParams[network]],
      });
      setIsAdded(true);
      await selectNetwork();
    } catch (error) {
      console.error("Error adding network:", error);
    }
  }

  async function selectNetwork(): Promise<void> {
    const provider = window.ethereum;
    if (!provider) return;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams[network].chainId }],
      });
      setIsSelected(true);
    } catch (error) {
      console.error("Error switching network:", error);
    }
  }

  return { isWalletInstalled, isAdded, isSelected, addNetwork, selectNetwork };
}