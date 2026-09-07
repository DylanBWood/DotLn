import type { BoardRow, BoardSection, BoardView, Cell } from "./types.js";

export const TERMINAL_WIDTH = 80;
const displayValue = (cell: Cell): string =>
  cell.status !== "known"
    ? cell.status
    : Array.isArray(cell.value)
      ? cell.value.length
        ? cell.value.join("; ")
        : "none recorded"
      : String(cell.value);
const plain = (text: string): string =>
  text
    .replace(/\u001b\[[0-?]*[ -/]*[@-~]/gu, "")
    .replace(
      /[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/gu,
      "",
    )
    .replaceAll("\t", "  ");

/** Deterministic terminal columns for the board's text/CJK glyphs; no ANSI output. */
export function displayWidth(text: string): number {
  return Array.from(plain(text)).reduce((width, character) => {
    const code = character.codePointAt(0)!;
    if (/\p{Mark}/u.test(character) || code === 0x200d || code === 0xfe0f)
      return width;
    return (
      width +
      (code >= 0x1100 &&
      (code <= 0x115f ||
        (code >= 0x2e80 && code <= 0xa4cf) ||
        (code >= 0xac00 && code <= 0xd7a3) ||
        (code >= 0xf900 && code <= 0xfaff) ||
        (code >= 0xfe10 && code <= 0xfe6f) ||
        (code >= 0xff01 && code <= 0xff60) ||
        (code >= 0xffe0 && code <= 0xffe6) ||
        code >= 0x1f000)
        ? 2
        : 1)
    );
  }, 0);
}
function wrap(text: string, width: number): readonly string[] {
  return plain(text)
    .split("\n")
    .flatMap((line) => {
      const result: string[] = [];
      let current = "";
      for (const character of line) {
        while (displayWidth(current + character) > width) {
          const space = current.lastIndexOf(" ");
          if (space > 8) {
            result.push(current.slice(0, space).trimEnd());
            current = current.slice(space + 1);
          } else {
            result.push(current.trimEnd());
            current = "";
          }
        }
        current += character;
      }
      result.push(current.trimEnd());
      return result;
    });
}
const cellLines = (cell: Cell): readonly string[] => [
  `  ${cell.label}: ${displayValue(cell)} [${cell.evidence.join(", ")}]`,
  ...(cell.explanation ? [`    ${cell.explanation}`] : []),
];
const rowLines = (row: BoardRow): readonly string[] => [
  `\n${row.title} [${row.id}]`,
  ...row.cells.flatMap(cellLines),
  ...row.links.map((link) => `  -> ${link.label} [${link.target}]`),
];

export function renderTerminal(
  board: BoardView,
  width = TERMINAL_WIDTH,
): string {
  if (!Number.isInteger(width) || width < 40 || width > 160)
    throw new Error("terminal width must be 40–160 columns");
  const lines = [
    "DOTLN / ACTOR BOARD",
    `${board.viewModelVersion} · Read-only, lossy projection`,
    "Recorded facts only. Unknown is not zero; a missing source is unavailable.",
    ...board.panels.flatMap((panel) => [
      `\n${panel.title.toUpperCase()} [${panel.id}]`,
      `Serves: ${panel.roles.join(", ")}`,
      panel.question,
      ...panel.sections.flatMap((section) => [
        `\n${section.title} [${section.id}] — ${section.status}`,
        ...(section.explanation ? [section.explanation] : []),
        ...section.rows.flatMap(rowLines),
      ]),
    ]),
    "\nROLE QUESTIONS",
    ...board.roleAnswers.map(
      (role) =>
        `${role.role}: ${role.question}\n  [${role.target}] ${role.cell}\n  Source: ${role.source}`,
    ),
    "\nSOURCES",
    ...board.sources.map(
      (source) =>
        `${source.status}: ${source.ref}${source.explanation ? ` — ${source.explanation}` : ""}`,
    ),
    "\nEVIDENCE",
    ...board.evidence.map(
      (record) => `[${record.id}] ${record.source}\n  ${record.record}`,
    ),
  ];
  return lines.flatMap((line) => wrap(line, width)).join("\n") + "\n";
}

const escape = (value: string): string =>
  plain(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const anchor = (target: string, label: string): string =>
  `<a href="#${escape(target)}">${escape(label)}</a>`;
const renderCell = (cell: Cell): string =>
  `<div class="fact ${cell.status}"><dt>${escape(cell.label)}</dt><dd>${cell.key === "tooltip" ? `<pre>${escape(displayValue(cell))}</pre>` : escape(displayValue(cell))}${cell.explanation ? `<small>${escape(cell.explanation)}</small>` : ""}<span class="citations">${cell.evidence.map((ref, index) => anchor(ref, `[${index + 1}]`)).join(" ")}</span></dd></div>`;
const renderRow = (row: BoardRow): string =>
  `<article class="card" id="${escape(row.id)}"><h4>${escape(row.title)}</h4><dl>${row.cells.map(renderCell).join("\n")}</dl>${row.links.length ? `<nav class="card-links" aria-label="Inspect ${escape(row.title)}">${row.links.map((link) => anchor(link.target, link.label)).join("\n")}</nav>` : ""}</article>`;
const renderSection = (section: BoardSection): string =>
  `<section class="collection" id="${escape(section.id)}"><div class="collection-heading"><h3>${escape(section.title)}</h3><span class="status ${section.status}">${section.status}</span></div>${section.explanation ? `<p class="note">${escape(section.explanation)}</p>` : ""}<div class="cards">${section.rows.map(renderRow).join("\n")}</div></section>`;

export function renderHtml(board: BoardView): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>DotLn · Actor board</title>
<style>
:root{color-scheme:dark;--bg:#10181b;--panel:#152125;--card:#1b2a2f;--line:#35484d;--text:#edece2;--muted:#b0c1c3;--gold:#eed39a;--aqua:#9bd9cf;--dim:#95a6aa}
*{box-sizing:border-box}html{scroll-padding-top:2rem}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,sans-serif}a{color:var(--aqua);text-underline-offset:.2em}a:hover{color:var(--gold)}a:focus-visible{outline:3px solid var(--gold);outline-offset:4px}h1,h2,h3,h4,p{margin-top:0}h1,h2{font-family:Georgia,serif;font-weight:normal}h1{font-size:clamp(2.4rem,5vw,4.5rem);line-height:1.1;margin:.6rem 0 1rem}h2{font-size:2.5rem;margin-bottom:.4rem}h3{font-size:1.1rem;font-weight:600;margin:0}h4{font-size:1.05rem;color:var(--gold);padding-bottom:1rem;border-bottom:1px solid var(--line);overflow-wrap:anywhere}.masthead{padding:3rem clamp(1.2rem,5vw,5rem);border-bottom:1px solid var(--line);background:#18282c}.eyebrow{font: .8rem/1.4 ui-monospace,monospace;letter-spacing:.13em;text-transform:uppercase;color:var(--gold)}.intro{max-width:52rem;color:var(--muted);margin-bottom:0}.layout{max-width:1600px;margin:auto;display:grid;grid-template-columns:190px minmax(0,1fr);gap:2.5rem;padding:2.5rem}.sidebar{align-self:start;position:sticky;top:2rem}.sidebar a{display:block;padding:.6rem 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--line)}.sidebar small{display:block;margin-top:1.4rem;color:var(--muted)}main{min-width:0}.panel{padding-bottom:3rem;margin-bottom:2rem;border-bottom:1px solid var(--line)}.question{color:var(--muted);max-width:65ch}.role{color:var(--aqua);font:.75rem/1.4 ui-monospace,monospace;letter-spacing:.05em;text-transform:uppercase}.collection{margin-top:2rem}.collection-heading{display:flex;gap:1rem;align-items:baseline;justify-content:space-between;margin-bottom:1rem}.status{color:var(--dim);font:.72rem/1.5 ui-monospace,monospace;white-space:nowrap}.status.unavailable{color:var(--gold)}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,350px),1fr));gap:1rem;align-items:start}.card{background:var(--card);border:1px solid var(--line);border-radius:7px;padding:1.5rem;min-width:0}.card:target,.collection:target{outline:2px solid var(--gold);outline-offset:5px}dl{margin:0}.fact{margin-top:.85rem}dt{font-size:.75rem;letter-spacing:.025em;color:var(--muted)}dd{margin:0;overflow-wrap:anywhere;font-size:.9rem;white-space:pre-wrap}.unknown dd,.unavailable dd{color:var(--gold)}small{font-size:.77rem;color:var(--dim);display:block;line-height:1.5;margin-top:.3rem}.citations{font-size:.68rem;display:inline-block;margin-left:.5rem;white-space:normal}.card-links{display:flex;flex-wrap:wrap;gap:.5rem 1rem;margin-top:1.2rem;padding-top:1rem;border-top:1px solid var(--line);font-size:.8rem}.note{color:var(--muted);font-size:.9rem}pre{white-space:pre-wrap;overflow-wrap:anywhere;font: .78rem/1.55 ui-monospace,monospace;color:var(--text);margin:.5rem 0}.evidence-list{padding-left:1.4rem;font:.8rem/1.55 ui-monospace,monospace}.evidence-list li{margin-bottom:.8rem;overflow-wrap:anywhere}.evidence-list li:target{outline:2px solid var(--gold);outline-offset:4px}.source-list{padding-left:1rem;overflow-wrap:anywhere;font-size:.85rem}.footer{color:var(--muted);font-size:.8rem;padding-top:2rem}.role-questions{padding-left:1.2rem}.role-questions li{margin-bottom:.8rem}.wide .cards{grid-template-columns:1fr}
@media(max-width:850px){.layout{grid-template-columns:1fr;padding:1.2rem;gap:1.5rem}.sidebar{position:static;display:flex;flex-wrap:wrap;gap:.5rem 1.2rem}.sidebar small{width:100%;margin:0}.sidebar a{padding:.25rem 0}.card{padding:1.2rem}.masthead{padding:2rem 1.2rem}.collection-heading{align-items:start}}@media print{body{color:#111;background:white}.sidebar{display:none}.layout{display:block}.masthead,.card{background:white;color:#111}.card{break-inside:avoid}a,h4,.role,dt,small,.note,.question{color:#333}pre{color:#111}}
</style>
</head>
<body>
<header class="masthead"><div class="eyebrow">DotLn / User Interfaces for Actors</div><h1>The actor board.</h1><p class="intro">People, builds, and bounded episodes — with the evidence behind their work. Inspect a build, follow a mechanism, or trace a result back to its source.</p></header>
<div class="layout"><nav class="sidebar" aria-label="Board panels">${board.panels.map((panel, index) => anchor(panel.id, `${String(index + 1).padStart(2, "0")}  ${panel.title}`)).join("\n")}<small>Read-only snapshot<br>Unknown is not zero.<br>Missing sources stay visible.</small></nav>
<main>
${board.panels.map((panel) => `<section class="panel${panel.id === "builds" ? " wide" : ""}" id="${panel.id}"><p class="role">For ${panel.roles.map((role) => escape(role.replaceAll("-", " "))).join(" · ")}</p><h2>${escape(panel.title)}</h2><p class="question">${escape(panel.question)}</p>${panel.sections.map(renderSection).join("\n")}</section>`).join("\n")}
<section id="role-questions"><h2>Five roles. Five questions.</h2><ul class="role-questions">${board.roleAnswers.map((answer) => `<li><strong>${escape(answer.role.replaceAll("-", " "))}</strong> — ${anchor(answer.target, answer.question)}<small>Answered by ${escape(answer.cell)}<br>Source: ${escape(answer.source)}</small></li>`).join("\n")}</ul></section>
<section id="sources"><h2>Source availability</h2><ul class="source-list">${board.sources.map((source) => `<li><strong>${source.status}</strong> — ${escape(source.ref)}${source.explanation ? `<small>${escape(source.explanation)}</small>` : ""}</li>`).join("\n")}</ul></section>
<section id="evidence"><h2>Evidence references</h2><p class="note">Links stay within this file. References name the original source and record; raw payloads and source-file bodies are omitted.</p><ol class="evidence-list">${board.evidence.map((record) => `<li id="${escape(record.id)}">${escape(record.source)}<br>${escape(record.record)}</li>`).join("\n")}</ol></section>
<footer class="footer">${escape(board.viewModelVersion)} · ${escape(board.fidelity)}. Declared mechanics, recorded observations, and reported selections retain their separate meanings. A Beacon is not a worker heartbeat.</footer>
</main></div>
</body>
</html>
`;
}
