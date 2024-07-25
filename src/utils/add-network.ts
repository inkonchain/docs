const networkParams = {
  chainId: "0xDEA27", // 911911 in hexadecimal
  chainName: "Ink Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia-rpc.inkchain.xyz"],
  blockExplorerUrls: ["https://sepolia-explorer.inkchain.xyz/"],
};

export async function addNetwork() {
  try {
    await (window as any).ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkParams],
    });
  } catch (error) {
    console.error("Error adding network:", error);
  }
}
