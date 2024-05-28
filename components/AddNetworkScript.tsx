const networkParams = {
  chainId: '0xDEA27', // 911911 in hexadecimal
  chainName: 'Ink Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.op-one-testnet.gelato.digital?'], //@TODO WEIRDEST BUG EVER. IF YOU CHANGE THIS `digital?` into `digital` it breaks. You can change it into EVERYTHING except `digital`
  blockExplorerUrls: ['https://explorer.op-one-testnet.gelato.digital/'],
};

export async function addNetwork() {
  try {
    await (window as any).ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  } catch (error) {
    console.error('Error adding network:', error);
  }
}
