export type NetworkType = "mainnet" | "sepolia";

const networkParams = {
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

export async function addNetwork(network: NetworkType) {
  if (!(window as any).ethereum) return;

  try {
    await (window as any).ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkParams[network]],
    });
  } catch (error) {
    console.error("Error adding network:", error);
  }
}
