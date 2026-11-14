// The one reader of the product vision's structure: the sections under its
// headings and the list of what DotLn is not. Work is judged against the
// vision's theses and exclusions in more than one place (the resident's
// mission capsule, and the planning subject), so each reads them here,
// through the pinned Markdown parser, and a change to the document's shape
// lands in one place.
import {
  markdownListItems,
  markdownSections,
  parseMarkdown,
} from "./markdown-links.mjs";

/** The title of the vision section whose list names what DotLn is not. */
export const VISION_EXCLUSIONS_TITLE = "What DotLn is not";

/** The vision's sections, each heading's depth and title with the text under
 * it up to the next heading at its depth or shallower, and that section's
 * `text`, its heading and body as written, which the planning subject binds;
 * and the text of each item of the list in the "What DotLn is not" section at
 * depth 2 or 3. */
export function readVision(markdown) {
  const tree = parseMarkdown(markdown);
  const sections = markdownSections(markdown, tree).map(
    ({ depth, title, body, start, bodyEnd }) => ({
      depth,
      title,
      body,
      text: markdown.slice(start, bodyEnd),
    }),
  );
  const excluded = sections.find(
    (section) =>
      section.title === VISION_EXCLUSIONS_TITLE &&
      (section.depth === 2 || section.depth === 3),
  );
  return {
    sections,
    exclusions: excluded
      ? markdownListItems(excluded.body).map((item) => item.text)
      : [],
  };
}
