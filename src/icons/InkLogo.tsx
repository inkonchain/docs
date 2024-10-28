interface InkLogoProps {
  className?: string;
}

export const InkLogo: React.FC<InkLogoProps> = ({
  className = "text-magic-purple",
}) => {
  return (
    <img
      className={className}
      src="/logo/logo.svg"
      alt="Ink logo"
      width="85"
      height="28"
    />
  );
};
