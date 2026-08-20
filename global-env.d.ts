// QUALITY FIX: Strict EIP-1193 provider interfaces replacing the ambient 'any' type
// to ensure type-safe interactions with the browser wallet boundary.
declare global {
  interface EIP1193RequestArguments {
    method: string;
    params?: readonly unknown[];
  }

  interface EIP1193Provider {
    request(args: EIP1193RequestArguments): Promise<unknown>;
    on(event: "chainChanged", listener: (chainId: string) => void): void;
    removeListener(
      event: "chainChanged",
      listener: (chainId: string) => void
    ): void;
  }

  interface Window {
    // QUALITY FIX: Typed explicitly as EIP1193Provider instead of 'any'
    ethereum?: EIP1193Provider;
  }
}

export {};