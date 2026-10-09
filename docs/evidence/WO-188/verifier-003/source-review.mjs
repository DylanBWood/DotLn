import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parsers } from "prettier/plugins/babel";

const root = process.cwd();
const files = execFileSync("git", ["diff", "--name-only", "-z", "HEAD"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\0")
  .filter((file) => /\.(?:mjs|ts|js)$/u.test(file));
const omitted = new Set([
  "comments",
  "leadingComments",
  "trailingComments",
  "innerComments",
  "start",
  "end",
  "loc",
  "range",
  "tokens",
  "extra",
]);
const clean = (value) =>
  Array.isArray(value)
    ? value.map(clean)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value)
            .filter(([key]) => !omitted.has(key) && !key.startsWith("__"))
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, item]) => [key, clean(item)]),
        )
      : value;
const normalized = (file, source) =>
  JSON.stringify(
    clean(
      (file.endsWith(".ts") ? parsers["babel-ts"] : parsers.babel).parse(
        source,
        { filepath: file },
      ),
    ),
  );
if (process.argv.includes("--diagnose")) {
  const file = "scripts/lib/config.mjs";
  const before = execFileSync("git", ["show", `HEAD:${file}`], {
    cwd: root,
    encoding: "utf8",
  });
  const after = readFileSync(file, "utf8");
  const left = JSON.parse(normalized(file, before)),
    right = JSON.parse(normalized(file, after));
  const first = (a, b, at = "root") => {
    if (JSON.stringify(a) === JSON.stringify(b)) return null;
    if (!a || !b || typeof a !== "object" || typeof b !== "object")
      return {
        at,
        before: String(a).slice(0, 120),
        after: String(b).slice(0, 120),
      };
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const found = first(a[key], b[key], `${at}.${key}`);
      if (found) return found;
    }
    return { at, orderOnly: true };
  };
  console.log(
    JSON.stringify({
      probe: "comment-oracle-diagnostic",
      rootKeys: Object.keys(left),
      difference: first(left, right),
    }),
  );
  process.exit(0);
}
const onlyComments = [],
  codeChanges = [];
for (const file of files) {
  const before = execFileSync("git", ["show", `HEAD:${file}`], {
    cwd: root,
    encoding: "utf8",
  });
  const after = readFileSync(file, "utf8");
  (normalized(file, before) === normalized(file, after)
    ? onlyComments
    : codeChanges
  ).push(file);
}
console.log(
  JSON.stringify({
    probe: "whole-diff-comment-isolation",
    trackedCodeFiles: files.length,
    onlyComments,
    codeChanges,
  }),
);
