"use client";

import CopyButton from "./CopyButton";

interface CopyableCodeProps {
  code: string;
  display?: string;
  className?: string;
  href?: string;
}

export default function CopyableCode({
  code,
  display,
  className = "",
  href,
}: CopyableCodeProps) {
  const CodeContent = () => (
    <code className="bg-container text-primary text-[0.85em] rounded-md px-1.5 py-0.5">
      {display || code}
    </code>
  );

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <CodeContent />
        </a>
      ) : (
        <CodeContent />
      )}
      <CopyButton text={code} />
    </span>
  );
}
