import { useEffect, useState } from "react";

import { addNetwork, isNetworkAdded, NetworkType } from "@/utils/add-network";

import { Button } from "./Button";

interface AddNetworkButtonProps {
  network: NetworkType;
}

export const AddNetworkButton = ({ network }: AddNetworkButtonProps) => {
  const [isAdded, setIsAdded] = useState<boolean>(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if ((window as any).ethereum) {
        const added = await isNetworkAdded(network);
        setIsAdded(added);
      }
    };

    checkNetwork();

    if ((window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", checkNetwork);
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener("chainChanged", checkNetwork);
      }
    };
  }, [network]);

  const networkName = network === "mainnet" ? "Ink Mainnet" : "Ink Sepolia";

  return (
    <div className="space-y-2 mt-4">
      {isAdded ? (
        <div className="flex items-center text-green-600 dark:text-green-400 font-semibold">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {networkName} Network Added
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="primary" onClick={() => addNetwork(network)}>
            Add {networkName} Network
          </Button>
        </div>
      )}
    </div>
  );
};
