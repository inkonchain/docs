import { ethers } from 'ethers';

const RPC_URL = 'https://rpc-gel-sepolia.inkonchain.com';
const CHAIN_ID = 763373;

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);

  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);

  console.log(`Latest Ink testnet block: ${blockNumber}`);
  console.log(`Block hash: ${block.hash}`);
  console.log(`Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
  console.log(`Transactions in block: ${block.transactions.length}`);
}

main().catch((err) => {
  console.error('Error querying Ink testnet:', err);
  process.exit(1);
});
