import { addNetwork } from "@/utils/add-network";

import { Button } from "./Button";

export const AddNetworkButton = () => {
  return (
    <Button
      variant="primary"
      // variant="secondary"
      onClick={addNetwork}
    >
      Add Ink Sepolia Network
    </Button>
  );
};
