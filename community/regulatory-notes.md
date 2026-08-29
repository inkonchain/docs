# AML/CFT and Regulatory Considerations for Exchange-Backed Layer 2 Rollups: The Case of Ink

## Introduction

The emergence of exchange-backed Layer 2 (L2) rollups — Coinbase's Base, Kraken's Ink, and comparable initiatives from other major exchanges — represents a structural shift in how centralized platforms interact with decentralized infrastructure. Unlike independent L2s built by protocol-native teams, these chains are sponsored, sequenced, and in some cases governed by regulated financial institutions. This creates a hybrid compliance posture that existing AML/CFT (Anti-Money Laundering / Countering the Financing of Terrorism) frameworks were not originally designed to address.

Ink, launched by Kraken in December 2024 on Optimism's OP Stack, is a useful case study precisely because it makes this hybridity explicit: a licensed, regulated exchange operating infrastructure that is, by design, permissionless at the application layer.

## Structural Features Relevant to Compliance

**Sequencer control.** Kraken operates Ink's sequencer, meaning transaction ordering and, functionally, network liveness sit with a known, regulated entity. This is a meaningful departure from fully decentralized sequencing models and gives Kraken practical (though not absolute) points of technical control — relevant for regulators assessing where responsibility for network-level conduct sits.

**Permissionless fault proofs with named challengers.** Ink runs fault proofs with both Gelato and Kraken as challengers. This introduces a degree of transparency and accountability at the settlement-verification layer that many earlier L2s lacked at launch, but it does not extend KYC or transaction monitoring to the chain itself.

**Open participation at the application layer.** Despite Kraken's infrastructure role, anyone can deploy contracts or transact on Ink without going through Kraken's KYC process, provided they bridge assets in through a non-Kraken route (e.g., third-party bridges like Across) or use a self-custodied wallet already holding ETH on the network.

This split — a regulated entity controlling infrastructure, but an unregulated, open transaction layer — is the core compliance tension.

## AML/CFT Considerations

**1. On/off-ramp concentration vs. on-chain dispersion.** Where a user bridges assets through Kraken directly, standard exchange KYC and transaction monitoring apply. Where a user bridges through independent routes (Across, other Superchain bridges, or moves assets in from another chain entirely), the on-chain activity on Ink itself is pseudonymous and outside Kraken's customer due diligence perimeter — even though Kraken's brand and infrastructure underpin the chain.

**2. Travel Rule applicability.** FATF's Travel Rule (Recommendation 16) generally attaches to Virtual Asset Service Providers (VASPs) facilitating transfers, not to the underlying chain. Kraken's Travel Rule obligations apply to its own exchange-side transfers; transactions occurring natively on Ink, between two self-custodied wallets, fall outside that perimeter under most current interpretations — creating a gap between the "Kraken-branded" trust signal and actual regulatory coverage.

**3. Attribution and reputational risk.** Because Ink is publicly associated with Kraken, illicit activity occurring on the chain — even where Kraken has no visibility or control over the counterparties — carries reputational and potentially regulatory spillover risk for Kraken as the sponsoring entity. This mirrors concerns raised about Coinbase's Base following instances of scam-token activity on that network.

**4. Sanctions exposure.** Kraken's own sanctions screening applies to direct exchange counterparties. It does not extend to arbitrary addresses transacting on Ink. Where OFAC-sanctioned addresses interact with Ink-based protocols without touching Kraken's exchange rails, existing sanctions compliance infrastructure may not detect this activity in real time.

## Cross-Border and Jurisdictional Considerations

Exchange-backed L2s complicate an already unsettled question: which jurisdiction's rules govern activity on the chain? Kraken operates under multiple national licensing regimes; Ink's underlying protocol is open-source and globally accessible. A transaction between two EU-based wallets, routed through infrastructure sequenced by a US/UK-regulated exchange, using bridge infrastructure operated by yet another entity, does not map cleanly onto any single jurisdiction's VASP definition. This is likely to be an active area of regulatory guidance development (particularly from FATF, FCA, and MiCA-aligned EU regulators) as exchange-backed L2s scale.

## Worked Example: Verifying On-Chain Transparency

To ground the traceability point made above, the following script (`scripts/get-latest-block.mjs`) queries Ink's Sepolia testnet RPC directly using ethers.js and pulls the latest block, its hash, timestamp, and transaction count:

```js
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
```

Run it with `node scripts/get-latest-block.mjs` (requires `ethers` installed via `npm install ethers@6`). The point this illustrates for compliance purposes: anyone — a regulator, an analytics firm, or an independent researcher — can independently verify Ink's chain state and transaction history without needing any relationship with Kraken. This is the practical basis for the traceability claim in the AML/CFT section: openness at the data layer does not, by itself, close the KYC/attribution gap discussed above, but it does mean on-chain forensics (e.g., Scorechain-style analytics) remain fully viable regardless of which entity controls the sequencer.

## Recommendations for Compliance Teams and Builders

- **For sponsoring exchanges:** Maintain clear public documentation distinguishing exchange-side KYC/AML obligations from the open, permissionless nature of the underlying chain, to manage regulatory and reputational expectations.
- **For dApp builders on Ink:** Do not assume Kraken's regulatory status extends any compliance coverage to applications built on the chain; independent AML tooling (e.g., Scorechain-style on-chain analytics, which already supports Ink) should be integrated at the application layer where relevant.
- **For regulators:** Existing VASP-centric frameworks should be revisited to address sequencer-operator relationships distinct from traditional custodial exchange activity, given the growing prevalence of this hybrid model across the Superchain ecosystem.

## Conclusion

Ink illustrates a broader pattern: regulated exchanges are increasingly building infrastructure that is intentionally more permissive than their own compliance perimeter. This is a deliberate design choice — enabling DeFi accessibility — but it produces a governance gap that current AML/CFT frameworks address only partially. As more exchanges pursue this model, closing that gap will require either extending VASP-style obligations to infrastructure operators in narrower, well-defined circumstances, or developing a distinct regulatory category for exchange-sponsored but technically open L2 networks.

---

*This note is intended as a general compliance and regulatory literacy resource for the Ink developer and builder community. It does not constitute legal advice.*
