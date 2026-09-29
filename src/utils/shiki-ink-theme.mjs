// Shiki themes for code blocks. Dark matches the code panel on the
// inkonchain.com homepage (white on black, violet keywords, green strings,
// grey comments); light is the same palette tuned for a white surface.
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

const lightText = "#1f1f23";
const lightAccent = "#7132f5";
const lightString = "#1a7f37";
const lightComment = "#8a8a8f";

export const inkShikiLightTheme = {
  ...inkShikiTheme,
  name: "ink-light",
  type: "light",
  colors: {
    "editor.background": "#ffffff",
    "editor.foreground": lightText,
  },
  tokenColors: inkShikiTheme.tokenColors.map((rule) => ({
    ...rule,
    settings: {
      foreground: {
        [text]: lightText,
        [accent]: lightAccent,
        [string]: lightString,
        [comment]: lightComment,
      }[rule.settings.foreground],
    },
  })),
};
