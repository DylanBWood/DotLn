// VER-003 independent probes. Run from the repository root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-227/verification-003-probes.mjs
// Every fixture is synthetic and lives under the system temporary directory.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? process.cwd());
const load = (name) => import(pathToFileURL(join(root, name)).href);
const { composeTargetBody, pullRequestBodyShapeFailures, withMeterBlockLast } =
  await load("scripts/lib/github-body.mjs");
const { lintArtifacts } = await load("scripts/lib/target-publish.mjs");
const { digestOf } = await load("scripts/lib/confirm-terms.mjs");

const evidence = [];
const note = (name, meets, observed) =>
  evidence.push({ name, meets, observed });
const attempt = (fn) => {
  try {
    return { returned: fn() };
  } catch (error) {
    return { error: error.message };
  }
};
const fixture = mkdtempSync(join(tmpdir(), "wo227-ver003-"));
const write = (name, text) => {
  const file = join(fixture, name);
  mkdirSync(resolve(file, ".."), { recursive: true });
  writeFileSync(file, text);
};
const term = "cobaltwidget";
try {
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  write(
    "docs/control/outward-vocabulary.json",
    JSON.stringify({ types: ["feat", "fix", "docs"], reviewTerms: ["gem"] }),
  );
  const terms = (text) => write("docs/control/local/terms.txt", text);
  const compose = ({ files, baseTree = [], kitPaths = [], body }) =>
    composeTargetBody({
      body: body ?? "# Change\n\nThe reviewed prose.",
      baseCommit: "a".repeat(40),
      headCommit: "b".repeat(40),
      files: files.map((path) => ({ path, added: 1, deleted: 0 })),
      baseTree: new Set(baseTree),
      kitPaths: new Set(kitPaths),
    });
  const publish = (composed, options) =>
    attempt(() =>
      lintArtifacts(
        fixture,
        [
          { kind: "branch", text: "fix/reviewed-change" },
          { kind: "pr-title", text: "fix: reviewed change" },
          {
            kind: "pr-body",
            text: composed.text,
            sections: composed.sections,
            rows: composed.rows,
          },
        ],
        options,
      ),
    );
  const quiet = (result, ...words) =>
    words.every((word) => !JSON.stringify(result).includes(word));

  // K1/K2: a review-mode private term carried only by a moved record's path
  // joins the review list redacted, waits for the digest, and proceeds with
  // it; a stale digest refuses; a preview reports the pending digest.
  for (const [name, line] of [
    ["K1 unmarked", term],
    ["K2 review:", `review: ${term}`],
  ]) {
    terms(`${line}\n`);
    const kitPath = `docs/work-orders/WO-006-${term}-sync.md`;
    const composed = compose({ files: [kitPath], kitPaths: [kitPath] });
    const digest = digestOf(composed.text);
    const bare = publish(composed);
    const stale = publish(composed, {
      confirmTerms: `sha256:${"0".repeat(64)}`,
    });
    const confirmed = publish(composed, { confirmTerms: digest });
    const preview = publish(composed, { preview: true });
    note(
      `${name} private term on a kit record path is a redacted review item`,
      /1 review item waits for the reviewer: pr-body: vocabulary\.local: review \(line \d+, Change table\)/u.test(
        bare.error ?? "",
      ) &&
        bare.error.includes(digest) &&
        /names another body/u.test(stale.error ?? "") &&
        confirmed.returned?.review?.matches === 1 &&
        confirmed.returned.review.confirmedDigest === digest &&
        preview.returned?.pending?.digest === digest &&
        quiet([bare, stale, confirmed, preview], term, kitPath),
      { bare, stale, confirmed, preview },
    );
  }

  // K3: a public review word in a moved record's path joins the list with
  // the word and its path (the path is not private).
  terms("");
  {
    const kitPath = "docs/work-orders/WO-006-gem-board.md";
    const result = publish(compose({ files: [kitPath], kitPaths: [kitPath] }));
    note(
      "K3 public review word on a kit record path is a review item with its path",
      /vocabulary\.review: gem \(line \d+, Change table, path docs\/work-orders\/WO-006-gem-board\.md\)/u.test(
        result.error ?? "",
      ) && !/identifier\.launchpad/u.test(result.error ?? ""),
      result,
    );
  }

  // K4: a moved record's identifier alone is the kit's frame; the same path
  // as an ordinary added file refuses it.
  {
    const kitPath = "docs/evidence/WO-006/decisions.md";
    const kit = publish(compose({ files: [kitPath], kitPaths: [kitPath] }));
    const added = publish(compose({ files: [kitPath] }));
    note(
      "K4 identifier on a kit record path is exempt; the same added path refuses",
      kit.returned?.review === null &&
        /identifier\.launchpad: WO-006 \(line \d+, Change table, path docs\/evidence\/WO-006\/decisions\.md\)/u.test(
          added.error ?? "",
        ),
      { kit, added },
    );
  }

  // K5: refuse term, public word and identifier on one kit path: the private
  // refusal stands, the identifier stays exempt, nothing quotes the row.
  terms(`refuse: ${term}\n`);
  {
    const kitPath = `docs/work-orders/WO-006-gem-${term}.md`;
    const result = publish(compose({ files: [kitPath], kitPaths: [kitPath] }));
    note(
      "K5 refuse term with a public word and identifier on a kit path refuses redacted",
      /pr-body refused: vocabulary\.local: refuse \(line \d+, Change table\)$/u.test(
        result.error ?? "",
      ) && quiet(result, term, kitPath, "gem-"),
      result,
    );
  }

  // K6: case and width folding reach the kit path too.
  {
    const kitPath = "docs/work-orders/WO-006-ＣｏｂａｌｔWidget.md";
    const result = publish(compose({ files: [kitPath], kitPaths: [kitPath] }));
    note(
      "K6 folded refuse term on a kit path refuses",
      /vocabulary\.local: refuse/u.test(result.error ?? "") &&
        quiet(result, kitPath),
      result,
    );
  }

  // K7: a runtime-identifier spelling after a hyphen on a kit path. The
  // runtime form's own lookbehind treats a hyphen as part of a word, so this
  // passes for any path; it does not exercise the kit exemption.
  terms("");
  {
    const kitPath = "docs/work-orders/WO-006-evt_123.md";
    const result = publish(compose({ files: [kitPath], kitPaths: [kitPath] }));
    note(
      "K7 runtime-identifier spelling after a hyphen on a kit path (observation)",
      null,
      result,
    );
  }

  // K8: a kit path the base already held keeps the base-path exemption.
  terms(`refuse: ${term}\n`);
  {
    const kitPath = `docs/work-orders/WO-006-${term}.md`;
    const result = publish(
      compose({ files: [kitPath], kitPaths: [kitPath], baseTree: [kitPath] }),
    );
    note(
      "K8 kit path the base held is not reported (observation)",
      null,
      result,
    );
  }

  // I1: identifier forms inside Markdown constructs of the reviewed prose.
  terms("");
  {
    const body =
      "# Change\n\nSee [WO-006](https://example.com/notes/wo-006), `VER-001` and **FINAL-001**.";
    const result = publish(compose({ files: [], body }));
    note(
      "I1 identifiers inside link text, URL, code span and emphasis refuse",
      ["WO-006", "wo-006", "VER-001", "FINAL-001"].every((form) =>
        (result.error ?? "").includes(`identifier.launchpad: ${form}`),
      ),
      result,
    );
  }

  // M: meter relocation byte edges.
  const begin = "<!-- dotln-process-meter:start -->";
  const end = "<!-- dotln-process-meter:end -->";
  const block = (table) => `${begin}\n${table}\n${end}`;
  {
    const last = `# T\n\nProse.\n\n${block("| t |")}\n`;
    const top = `${block("| t |")}\n\n# T\n\nProse one.\n\nProse two.\n`;
    const noNewline = `# T\n\n${block("| t |")}\n\nProse without newline.`;
    const between = `# T\n\nFirst.\n\n${block("| t |")}\n\nSecond.\n`;
    const crlf = `# T\r\n\r\n${block("| t |")}\r\n\r\nProse.\r\n`;
    const out = {
      last: withMeterBlockLast(last, "| t |"),
      top: withMeterBlockLast(top, "| t |"),
      noNewline: withMeterBlockLast(noNewline, "| t |"),
      between: withMeterBlockLast(between, "| t |"),
      crlf: withMeterBlockLast(crlf, "| t |"),
    };
    note(
      "M1 meter already last is unchanged; top, unterminated and between bodies move it last",
      out.last === last &&
        out.top === `# T\n\nProse one.\n\nProse two.\n\n${block("| t |")}\n` &&
        out.noNewline ===
          `# T\n\nProse without newline.\n\n${block("| t |")}\n` &&
        out.between === `# T\n\nFirst.\n\nSecond.\n\n${block("| t |")}\n` &&
        ["last", "top", "noNewline", "between"].every(
          (name) => pullRequestBodyShapeFailures(out[name]).length === 0,
        ),
      out,
    );
    note("M2 CRLF body relocation (observation)", null, {
      output: JSON.stringify(out.crlf),
      shape: pullRequestBodyShapeFailures(out.crlf),
    });
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
process.stdout.write(
  `${JSON.stringify({ schemaVersion: 1, workOrder: "WO-227", recordedAt: new Date().toISOString(), evidence }, null, 2)}\n`,
);
