import { CheckIcon } from "@/icons/Check";
import { ConnectedPulse } from "@/icons/ConnectedPulse";
import {
  networkParams,
  NetworkType,
  useNetwork,
  UseNetworkResponse,
} from "@/utils/networks";

import { Button } from "./Button";

interface AddNetworkButtonProps {
  network: NetworkType;
  heading: string;
}

export const AddNetworkButton = ({
  network,
  heading,
}: AddNetworkButtonProps) => {
  const { isWalletInstalled, isAdded, isSelected, addNetwork, selectNetwork } =
    useNetwork(network);

  return (
    <div className="h-36">
      <div className="flex flex-col gap-2">
        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl relative flex gap-2 items-center">
          <span>{heading}</span>
          {isSelected && <ConnectedPulse className="size-6" />}
          <a
            href={`#${network}`}
            id={network}
            className="subheading-anchor"
            aria-label="Permalink for this section"
          ></a>
        </h3>
        <AddNetworkButtonContent
          isWalletInstalled={isWalletInstalled}
          isAdded={isAdded}
          isSelected={isSelected}
          addNetwork={addNetwork}
          selectNetwork={selectNetwork}
          network={network}
        />
      </div>
    </div>
  );
};
const AddNetworkButtonContent = ({
  isWalletInstalled,
  isAdded,
  isSelected,
  addNetwork,
  selectNetwork,
  network,
}: UseNetworkResponse & { network: NetworkType }) => {
  if (!isWalletInstalled) {
    return <p>No wallet connected</p>;
  }

  if (isAdded && isSelected) {
    return (
      <span className="text-green-500 font-bold flex gap-1 items-center">
        <span>Network added & selected.</span>
      </span>
    );
  }

  if (isAdded) {
    return (
      <span className="text-green-500 font-bold flex flex-col gap-1">
        <p>Network added.</p>
        <p
          onClick={selectNetwork}
          className="underline hover:cursor-pointer hover:opacity-90"
        >
          Click here to select it.
        </p>
      </span>
    );
  }

  return (
    <Button variant="primary" onClick={addNetwork} className="w-60 mt-2">
      Add {networkParams[network].chainName}
    </Button>
  );
};

