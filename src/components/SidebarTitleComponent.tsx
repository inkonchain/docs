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
    return <div className="font-bold text-black dark:text-white">{title}</div>;
  }

  return (
    <div
      className={clsx(
        "ink-sidebar-item px-2 py-1.5  rounded-sm w-full hover:bg-magic-purple/20 transition-all",
        {
          "bg-magic-purple/20": isActive,
        }
      )}
    >
      {title}
    </div>
  );
};
