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
};

export async function isNetworkAdded(network: NetworkType): Promise<boolean> {
  if (!(window as any).ethereum) return false;
  try {
    const chainId = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    return (
      chainId.toLowerCase() === networkParams[network].chainId.toLowerCase()
    );
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
}

export type UseNetworkResponse = {
  isWalletInstalled: boolean;
  // isAdded is a heuristic: true if this chain is active, or was added/
  // selected during this hook's lifetime. Resets on network change.
  isAdded: boolean;
  isSelected: boolean;
  addNetwork: () => Promise<void>;
  selectNetwork: () => Promise<void>;
};

export function useNetwork(network: NetworkType): UseNetworkResponse {
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  // Check if network is added and selected on mount and when network changes
  useEffect(() => {
    setIsAdded(false);
    setIsSelected(false);

    let cancelled = false; // avoid stale writes if `network` changes mid-request

    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (cancelled) return;
          const isCurrentNetwork =
            chainId.toLowerCase() ===
            networkParams[network].chainId.toLowerCase();
          setIsSelected(isCurrentNetwork);
          setIsAdded((prev) => isCurrentNetwork || prev);
        } catch (error) {
          if (!cancelled) console.error("Error checking network:", error);
        }
      }
      if (!cancelled) setIsWalletInstalled(window.ethereum !== undefined);
    };

    checkNetwork();

    // Listen for chain changes
    if (window.ethereum) {
      window.ethereum.on("chainChanged", checkNetwork);
      return () => {
        cancelled = true;
        window.ethereum.removeListener("chainChanged", checkNetwork);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [network]);

  async function addNetwork(): Promise<void> {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkParams[network]],
      });
      setIsAdded(true);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkParams[network].chainId }],
        });
        setIsSelected(true);
      } catch (switchError) {
        console.error("Error selecting network after add:", switchError);
      }
    } catch (error) {
      console.error("Error adding network:", error);
    }
  }

  async function selectNetwork(): Promise<void> {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams[network].chainId }],
      });
      setIsSelected(true);
      setIsAdded(true);
    } catch (error: any) {
      if (error?.code === 4902) {
        await addNetwork(); // unknown chain: add it, addNetwork does its own switch
        return;
      }
      console.error("Error switching network:", error);
    }
  }

  return { isWalletInstalled, isAdded, isSelected, addNetwork, selectNetwork };
}
