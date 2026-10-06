import { join } from "node:path";
const [root] = process.argv.slice(2);
const { reviewFindings } = await import(
  join(root, "scripts/lib/review-findings.mjs")
);
const n = 20000;
const cases = {
  hyphenCommaPrefix:
    Array.from({ length: n / 4 }, () => "a-a,").join("") + " x",
  hyphenRun: "a-".repeat(n) + " class: y",
  commaRun: "a, ".repeat(n) + "class: y",
  backtickLines: Array.from(
    { length: n / 10 },
    (_, i) => `line ${i} has a stray \` here`,
  ).join("\n"),
  findingLines: Array.from(
    { length: n / 10 },
    (_, i) =>
      `**Finding F${i}:** blocking; class: escape; \`x${i % 2 ? "" : "`"} y`,
  ).join("\n"),
};
for (const [k, text] of Object.entries(cases)) {
  const t = performance.now();
  const r = reviewFindings(text, { verdict: "fail" });
  console.log(
    `${k} chars=${text.length} ms=${(performance.now() - t).toFixed(1)} found=${r.found} unrec=${r.unrecognised.length} measured=${r.measured}`,
  );
}
