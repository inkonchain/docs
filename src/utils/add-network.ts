const networkParams = {
  chainId: "0xBA5ED", // 763373 in hexadecimal
  chainName: "Ink Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-gel-sepolia.inkonchain.com"],
  blockExplorerUrls: ["https://explorer-sepolia.inkonchain.com/"],
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
