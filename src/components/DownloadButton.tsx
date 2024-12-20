import { PropsWithChildren } from "react";

import { DownloadIcon } from "@/icons/Download";

import { Button } from "./Button";

interface DownloadButtonProps {
  sourceFilePath: string;
  destinationFileName: string;
  label: string;
  size: string;
}

export const DownloadButton: React.FC<
  PropsWithChildren<DownloadButtonProps>
> = ({ sourceFilePath, destinationFileName, label, size }) => {
  return (
    <Button
      variant="primary"
      onClick={() => {
        const link = document.createElement("a");
        link.href = sourceFilePath;
        link.download = destinationFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
    >
      <div className="flex items-center gap-2">
        <DownloadIcon />
        <span className="text-sm sm:text-xl">{label}</span>
        <span className="text-sm sm:text-xl text-magic-soft-pink">{size}</span>
      </div>
    </Button>
  );
};
