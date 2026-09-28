// Shiki theme for code blocks, matching the code panel on the inkonchain.com
// homepage: white text on black, violet keywords, green strings, grey
// comments. Blocks are always dark, so the same theme is used for both modes.
const text = "#ffffff";
const accent = "#9e70ff";
const string = "#35df8d";
const comment = "#969696";

export const inkShikiTheme = {
  name: "ink",
  type: "dark",
  colors: {
    "editor.background": "#000000",
    "editor.foreground": text,
  },
  tokenColors: [
    { settings: { foreground: text } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: comment },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
        "constant.character",
        "markup.inline.raw",
      ],
      settings: { foreground: string },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "entity.name.function",
        "support.function",
        "entity.name.command",
        "entity.name.type",
        "support.type",
        "entity.name.tag",
        "entity.other.attribute-name",
        "constant.numeric",
        "constant.language",
        "variable.parameter.option",
        "constant.other.option",
      ],
      settings: { foreground: accent },
    },
  ],
};
