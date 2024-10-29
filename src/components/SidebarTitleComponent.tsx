import clsx from "clsx";
import { useRouter } from "next/router";

interface SidebarTitleComponentProps {
  title: string;
  type: string;
  route: string;
}

export const SidebarTitleComponent: React.FC<SidebarTitleComponentProps> = ({
  title,
  type,
  route,
}) => {
  const { asPath } = useRouter();
  const isActive = route === asPath;

  if (type === "separator") {
    return (
      <div className="font-bold text-black dark:text-magic-white">{title}</div>
    );
  }

  return (
    <div
      className={clsx(
        "ink-sidebar-item px-2 py-1.5 rounded-lg w-full transition-all",
        {
          "text-ink-grey-400 dark:text-magic-white dark:hover:text-ink-grey-700 hover:text-ink-grey-700 hover:bg-ink-grey-100":
            !isActive,
          "bg-magic-semi-deep-purple/15 text-magic-purple dark:text-magic-soft-pink": isActive,
        }
      )}
    >
      {title}
    </div>
  );
};
