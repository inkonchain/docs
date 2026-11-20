// Converts the rendered page into Markdown for "Copy page" / "View as
// Markdown". Working from the DOM (not the .mdx source) keeps content that
// pages pull in from shared components, like the bridge and faucet lists.

// Page chrome that isn't part of the content
const SKIP = [
  ".ink-page-actions",
  ".ink-edit-link",
  "interactive-ink",
  "button",
  "script",
  "style",
  ".subheading-anchor",
  // Callouts' (hidden) emoji column
  ".nextra-callout > div:first-child",
  // Prev / next pagination and the "Last updated" line
  "div:has(> a[title] > svg)",
  "div._mt-12._mb-8",
].join(",");

const collapse = (text: string) => text.replace(/\s+/g, " ");

// new URL() throws on malformed hrefs; fall back to the raw value so one
// bad link can't break copying the whole page.
const absolutize = (value: string, origin: string): string => {
  try {
    return new URL(value, origin).href;
  } catch {
    return value;
  }
};

const INLINE_TAGS = new Set([
  "A",
  "SPAN",
  "STRONG",
  "B",
  "EM",
  "I",
  "CODE",
  "IMG",
]);

function inline(node: Node, origin: string): string {
  if (node.nodeType === Node.TEXT_NODE) return collapse(node.textContent ?? "");
  // Also drops icons (SVG)
  if (!(node instanceof HTMLElement)) return "";

  const children = () =>
    Array.from(node.childNodes)
      .map((child) => inline(child, origin))
      .join("");

  switch (node.tagName) {
    case "STRONG":
    case "B":
      return `**${children().trim()}**`;
    case "EM":
    case "I":
      return `*${children().trim()}*`;
    case "CODE":
      return `\`${node.textContent ?? ""}\``;
    case "BR":
      return "\n";
    case "IMG": {
      const img = node as HTMLImageElement;
      return `![${img.alt}](${absolutize(img.getAttribute("src") ?? "", origin)})`;
    }
    case "INPUT": {
      const input = node as HTMLInputElement;
      return input.type === "checkbox" ? (input.checked ? "[x] " : "[ ] ") : "";
    }
    case "A": {
      const href = node.getAttribute("href");
      const text = children().trim();
      if (!href || href.startsWith("#")) return text;
      return `[${text}](${absolutize(href, origin)})`;
    }
    default:
      return children();
  }
}

function list(element: HTMLElement, origin: string, depth: number): string {
  const ordered = element.tagName === "OL";
  const indent = "  ".repeat(depth);

  return Array.from(element.children)
    .filter((child): child is HTMLElement => child.tagName === "LI")
    .map((item, index) => {
      const nested = Array.from(item.children).filter((child) =>
        ["UL", "OL"].includes(child.tagName)
      ) as HTMLElement[];
      const text = Array.from(item.childNodes)
        .filter((child) => !nested.includes(child as HTMLElement))
        .map((child) => inline(child, origin))
        .join("")
        .trim();
      const marker = ordered ? `${index + 1}.` : "-";
      const sublists = nested
        .map((sub) => `\n${list(sub, origin, depth + 1)}`)
        .join("");
      return `${indent}${marker} ${text}${sublists}`;
    })
    .join("\n");
}

function table(element: HTMLTableElement, origin: string): string {
  const rows = Array.from(element.rows).map((row) =>
    Array.from(row.cells).map((cell) =>
      inline(cell, origin).trim().replace(/\|/g, "\\|")
    )
  );
  if (rows.length === 0) return "";

  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  const [head, ...body] = rows;
  return [line(head), line(head.map(() => "---")), ...body.map(line)].join(
    "\n"
  );
}

function blocks(element: Element, origin: string): string[] {
  const out: string[] = [];

  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = collapse(node.textContent ?? "").trim();
      if (text) out.push(text);
      continue;
    }
    if (!(node instanceof HTMLElement)) continue;

    const tag = node.tagName;
    if (INLINE_TAGS.has(tag)) {
      const text = inline(node, origin).trim();
      if (text) out.push(text);
    } else if (/^H[1-6]$/.test(tag)) {
      out.push(`${"#".repeat(Number(tag[1]))} ${inline(node, origin).trim()}`);
    } else if (tag === "P") {
      const text = inline(node, origin).trim();
      if (text) out.push(text);
    } else if (tag === "UL" || tag === "OL") {
      out.push(list(node, origin, 0));
    } else if (tag === "PRE") {
      const language = node.getAttribute("data-language") ?? "";
      out.push(
        `\`\`\`${language}\n${(node.textContent ?? "").trimEnd()}\n\`\`\``
      );
    } else if (tag === "TABLE") {
      out.push(table(node as HTMLTableElement, origin));
    } else if (tag === "HR") {
      out.push("---");
    } else if (
      tag === "BLOCKQUOTE" ||
      node.classList.contains("nextra-callout")
    ) {
      const quoted = blocks(node, origin).join("\n\n");
      out.push(
        quoted
          .split("\n")
          .map((line) => `> ${line}`.trimEnd())
          .join("\n")
      );
    } else {
      out.push(...blocks(node, origin));
    }
  }

  return out.filter(Boolean);
}

export function pageToMarkdown(root: HTMLElement, origin: string): string {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(SKIP).forEach((element) => element.remove());
  return `${blocks(clone, origin).join("\n\n").trim()}\n`;
}
