// An authored Markdown document's structure, read by the repository's one
// Markdown reader for a reader that may not parse Markdown itself: the
// console's collector runs scripts/markdown-structure.mjs for the documents
// its board shows, and its recorded fixtures load through the same function.
// The console package imports neither the parser nor this module.
import { lstatSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import {
  markdownHeadings,
  markdownTables,
  parseMarkdown,
} from "./markdown-links.mjs";

/** A document's top-level headings and its tables, each cell with its text
 * as written, its text as a reader sees it and its link destinations. */
export function markdownStructure(source) {
  const tree = parseMarkdown(source);
  return {
    headings: markdownHeadings(source, tree).map(({ depth, title, line }) => ({
      depth,
      title,
      line,
    })),
    tables: markdownTables(source, tree).map(({ line, rows }) => ({
      line,
      rows: rows.map((row) => ({
        line: row.line,
        cells: row.cells.map((written, index) => ({
          source: written,
          text: row.texts[index],
          links: row.links[index],
        })),
      })),
    })),
  };
}

/** Each named document's structure, or the error code that kept it unread.
 * A name is a path inside `root`; a link or anything but a regular file is
 * not read. */
export function documentStructures(paths, root = process.cwd()) {
  return Object.fromEntries(
    paths.map((path) => {
      try {
        if (isAbsolute(path) || path.split(/[\\/]/u).includes(".."))
          throw Object.assign(new Error("outside the repository"), {
            code: "EACCES",
          });
        const file = join(root, path);
        if (!lstatSync(file).isFile())
          throw Object.assign(new Error("not a regular file"), {
            code: "ENOTFILE",
          });
        return [path, markdownStructure(readFileSync(file, "utf8"))];
      } catch (error) {
        return [path, { error: error?.code ?? "EINVAL" }];
      }
    }),
  );
}
