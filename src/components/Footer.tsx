import { ThemeToggle } from "./ThemeToggle";

export const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-16 border-t selection:bg-magic-white">
      <div className="px-6 mx-auto max-w-[90rem] w-full flex justify-between gap-2">
        <div className="text-sm text-gray-600">
          Made with ❤️ by the Inkonchain team
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
};
