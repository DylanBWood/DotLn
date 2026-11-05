/** The gitmoji a title or a body's line may open with, in its Unicode form or its
 * `:shortcode:` form. A line is judged past them, so neither form hides anything. */
const LEADING_GITMOJI =
  /^\s*(?:(?:[\p{Extended_Pictographic}\p{Emoji_Presentation}](?:️|\p{Emoji_Modifier})?(?:‍\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})?)*|:[a-z0-9_+-]+:)\s*)+/iu;

/** Precise footer/trailer predicate: ordinary discussion and human coauthors pass. */
/** @param {string} message */
export function hasAiAttribution(message) {
  return message
    .split(/\r?\n/u)
    .map((line) => line.replace(LEADING_GITMOJI, ""))
    .some(
      (line) =>
        /^\s*(?:Co-authored-by|Assisted-by)\s*:\s*(?:(?:Claude(?: Code)?|Codex|ChatGPT|OpenAI|Anthropic|AI)(?:\s|<|$)|[^<>]*<[^<>]*@(?:anthropic\.com|openai\.com)>)/iu.test(
          line,
        ) ||
        /^\s*(?:Generated|Written|Co-authored) (?:with|by) (?:\[)?(?:Claude(?: Code)?|Codex|ChatGPT|OpenAI|AI)(?:\b|\])/iu.test(
          line,
        ) ||
        /^\s*(?:[\p{L}\p{N}][\p{L}\p{N} ._-]*-Session|Session-URL)\s*:/iu.test(
          line,
        ) ||
        /^\s*(?:\[[^\]]*\]\()?<?https?:\/\/(?:claude\.ai|(?:www\.)?chatgpt\.com|(?:www\.)?chat\.openai\.com|(?:www\.)?openai\.com)\/(?:code\/)?(?:session[_/]|sessions\/|share\/|c\/|codex\/tasks\/)/iu.test(
          line,
        ),
    );
}
