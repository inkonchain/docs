import { Callout } from "nextra/components";

export const TestnetDisclaimer = () => {
  return (
    <Callout type="info" emoji="ℹ️">
      This guide currently references Ink Sepolia (testnet) however it can be
      used for Ink mainnet as well. Please be sure to change the necessary
      parameters based on your network of choice.
    </Callout>
  );
};
