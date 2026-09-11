/** Precise footer/trailer predicate: ordinary discussion and human coauthors pass. */
/** @param {string} message */
export function hasAiAttribution(message) {
  return message
    .split(/\r?\n/u)
    .some(
      (line) =>
        /^\s*Co-authored-by\s*:\s*(?:(?:Claude(?: Code)?|Codex|ChatGPT|OpenAI|Anthropic|AI)(?:\s|<)|[^<>]*<[^<>]*@(?:anthropic\.com|openai\.com)>)/iu.test(
          line,
        ) ||
        /^\s*(?:[\p{Emoji_Presentation}]\s*)?(?:Generated|Written|Co-authored) (?:with|by) (?:\[)?(?:Claude(?: Code)?|Codex|ChatGPT|OpenAI|AI)(?:\b|\])/iu.test(
          line,
        ) ||
        /^\s*(?:[\p{L}\p{N}][\p{L}\p{N} ._-]*-Session|Session-URL)\s*:/iu.test(
          line,
        ) ||
        /^\s*(?:[\p{Emoji_Presentation}]\s*)?(?:\[[^\]]*\]\()?<?https?:\/\/(?:claude\.ai|(?:www\.)?chatgpt\.com|(?:www\.)?chat\.openai\.com|(?:www\.)?openai\.com)\/(?:code\/)?(?:session[_/]|sessions\/|share\/|c\/|codex\/tasks\/)/iu.test(
          line,
        ),
    );
}
