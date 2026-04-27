import { ThemeToggle } from "./ThemeToggle";

export const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-16 border-t selection:bg-magic-white">
      <div className="px-6 mx-auto max-w-[90rem] w-full flex justify-between gap-2">
        <div className="text-sm text-gray-600">
          Made with 💜 by the Ink team
        </div>
        <div className="text-sm text-gray-600">
          <a href="https://inkonchain.com/en-US/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Notice
          </a>
        </div>
        <div className="text-sm text-gray-600">
          <a href="https://inkonchain.com/en-US/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

