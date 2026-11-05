import assert from "node:assert/strict";
import { after, test } from "node:test";

import { parseHTML } from "linkedom";
import { remark } from "remark";

import { pageToMarkdown } from "../src/utils/page-to-markdown.ts";

const originalNode = globalThis.Node;
const originalHTMLElement = globalThis.HTMLElement;

after(() => {
  globalThis.Node = originalNode;
  globalThis.HTMLElement = originalHTMLElement;
});

function convert(html) {
  const { window } = parseHTML(`<main>${html}</main>`);
  globalThis.Node = window.Node;
  globalThis.HTMLElement = window.HTMLElement;
  return pageToMarkdown(
    window.document.querySelector("main"),
    "https://docs.inkonchain.com"
  );
}

test("keeps tutorial commands and TOML as fenced blocks inside numbered steps", () => {
  const commands = "git clone example/repo\ncd repo";
  const config =
    '[deploy_config]\nsalt = "ethers phoenix"\nchains = ["sepolia/ink"]';
  const markdown = convert(`
    <ol>
      <li><strong>Clone the repository</strong>
        <div><pre data-language="sh"><code>${commands}</code><button>Copy</button></pre></div>
      </li>
      <li><p>Configure deployment settings:</p>
        <div><pre data-language="toml"><code>${config}</code></pre></div>
        <p>Save this to <code>deploy-config.toml</code>.</p>
      </li>
    </ol>
  `);
  const [list] = remark().parse(markdown).children;

  assert.equal(list.type, "list");
  assert.equal(list.ordered, true);
  assert.equal(list.children.length, 2);
  assert.equal(list.children[0].children[1]?.type, "code");
  assert.equal(list.children[0].children[1].lang, "sh");
  assert.equal(list.children[0].children[1].value, commands);
  assert.equal(list.children[1].children[1]?.type, "code");
  assert.equal(list.children[1].children[1].lang, "toml");
  assert.equal(list.children[1].children[1].value, config);
  assert.equal(list.children[1].children[2].type, "paragraph");
});

test("preserves nested list order and paragraphs after a sublist", () => {
  const markdown = convert(`
    <ol><li><p>First paragraph.</p><p>Second paragraph.</p>
      <ul><li>Nested <strong>item</strong>.
        <ol><li>Deep item.</li></ol>
      </li></ul>
      <p>After the nested list.</p>
    </li><li>Next step.</li></ol>
  `);
  const [list] = remark().parse(markdown).children;
  const [first, second] = list.children;

  assert.deepEqual(
    first.children.map((node) => node.type),
    ["paragraph", "paragraph", "list", "paragraph"]
  );
  assert.equal(first.children[0].children[0].value, "First paragraph.");
  assert.equal(first.children[1].children[0].value, "Second paragraph.");
  assert.equal(first.children[2].ordered, false);
  const nested = first.children[2].children[0];
  assert.equal(nested.children[1].type, "list");
  assert.equal(nested.children[1].ordered, true);
  assert.equal(first.children[3].children[0].value, "After the nested list.");
  assert.equal(second.children[0].children[0].value, "Next step.");
});

test("keeps adjacent inline content in a single tight list paragraph", () => {
  assert.equal(
    convert(
      '<ul><li>Use <strong>Ink</strong> with <a href="/build">these docs</a> and <code>pnpm</code>.</li><li>Next item.</li></ul>'
    ),
    "- Use **Ink** with [these docs](https://docs.inkonchain.com/build) and `pnpm`.\n- Next item.\n"
  );
});

test("preserves headings, paragraphs and code outside lists", () => {
  assert.equal(
    convert(`
      <h1>Ink guide</h1>
      <p>Read <a href="/build">these docs</a> with <strong>care</strong>.</p>
      <pre data-language="js"><code>const chain = "Ink";\nconsole.log(chain);</code></pre>
      <blockquote><p>Keep this note.</p></blockquote>
      <hr>
      <div class="ink-page-actions"><button>Copy page</button></div>
    `),
    '# Ink guide\n\nRead [these docs](https://docs.inkonchain.com/build) with **care**.\n\n```js\nconst chain = "Ink";\nconsole.log(chain);\n```\n\n> Keep this note.\n\n---\n'
  );
});

test("indents continuation blocks correctly after two-digit ordered markers", () => {
  const items = Array.from(
    { length: 10 },
    (_, index) =>
      `<li><p>Step ${index + 1}.</p><pre data-language="sh"><code>pnpm build</code></pre></li>`
  ).join("");
  const [list] = remark().parse(convert(`<ol>${items}</ol>`)).children;

  assert.equal(list.children.length, 10);
  for (const item of list.children) {
    assert.equal(item.children[1]?.type, "code");
    assert.equal(item.children[1].value, "pnpm build");
  }
});
