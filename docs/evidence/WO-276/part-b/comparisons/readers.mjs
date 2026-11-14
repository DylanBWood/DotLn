#!/usr/bin/env node
// WO-276 Part B, criterion B8: each script-side reader that moved onto a
// shared reader, compared with the reader the order's base held, over the
// committed documents and sources it reads.
//
//   node docs/evidence/WO-276/part-b/comparisons/readers.mjs [name ...] [--base <rev>] [--write]
//
// The base's scripts are taken from Git into session scratch with `git
// archive`, the worktree's node_modules is linked beside them (the base's
// Markdown reader imported Prettier from there), and each old reader is
// imported from that copy and run over this worktree's files. Nothing is
// built. --write records each result beside this file as <name>.json: what
// was read, how many inputs both readers answer alike, and each difference
// with the class the table below names for it. An unnamed difference fails.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../../../../..");
const args = process.argv.slice(2);
const flag = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const base = flag("--base", "0097fcac6");
const names = args.filter(
  (arg, index) => !arg.startsWith("--") && args[index - 1] !== "--base",
);
const git = (argv, options = {}) =>
  execFileSync("git", ["-C", root, ...argv], {
    maxBuffer: 1024 * 1024 * 1024,
    ...options,
  });
const commit = git(["rev-parse", `${base}^{commit}`], {
  encoding: "utf8",
}).trim();
const scratch = mkdtempSync(join(tmpdir(), "dotln-reader-compare-"));
process.on("exit", () => rmSync(scratch, { recursive: true, force: true }));
execFileSync("tar", ["-x", "-C", scratch], {
  input: git([
    "archive",
    commit,
    "scripts",
    "packages",
    "dotln.config.json",
    "package.json",
  ]),
});
symlinkSync(join(root, "node_modules"), join(scratch, "node_modules"));
const old = (path) => import(pathToFileURL(join(scratch, path)).href);
const now = (path) => import(pathToFileURL(join(root, path)).href);
// A reader no export reaches is compared through a copy of its module that
// exports it and changes nothing else: the base's copy stands beside the
// base's file in the extracted tree, and the worktree's stands in scratch
// with its relative imports bound to the worktree's own files. `edit` may
// rewrite the copy's text first, for a module that reads its own location.
let copies = 0;
const exposed = async (side, path, names, edit = (source) => source) => {
  const exports = `\nexport { ${names.join(", ")} };\n`;
  if (side === "old") {
    const copy = join(
      scratch,
      dirname(path),
      `exposed-${copies++}-${path.split("/").at(-1)}`,
    );
    writeFileSync(
      copy,
      edit(readFileSync(join(scratch, path), "utf8")) + exports,
    );
    return import(pathToFileURL(copy).href);
  }
  const bound = edit(readFileSync(join(root, path), "utf8")).replace(
    /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)"(\.{1,2}\/[^"\n]+)"/gu,
    (_, lead, specifier) =>
      `${lead}${JSON.stringify(pathToFileURL(join(root, dirname(path), specifier)).href)}`,
  );
  const copy = join(scratch, `exposed-${copies++}-${path.split("/").at(-1)}`);
  writeFileSync(copy, bound + exports);
  return import(pathToFileURL(copy).href);
};
// A package's compiled module, built here rather than taken from a dist
// directory: the base's packages and the worktree's are each staged under
// scratch as scripts/build.mjs stages them (each package's package.json,
// tsconfig.json, src and test; a package without a tsconfig copied whole;
// node_modules linked, @dotln/<name> bound to the staged package) and
// compiled once with this worktree's TypeScript, the 7.0.2 the base also
// pins. A bare @dotln import then resolves within the same side's build.
const builds = new Map();
const built = async (side, path) => {
  const staging = join(scratch, `built-${side}`);
  if (!builds.has(side)) {
    const tree = side === "old" ? scratch : root;
    mkdirSync(join(staging, "node_modules/@dotln"), { recursive: true });
    writeFileSync(
      join(staging, "tsconfig.json"),
      side === "old"
        ? git(["show", `${commit}:tsconfig.json`])
        : readFileSync(join(root, "tsconfig.json")),
    );
    for (const dependency of readdirSync(join(root, "node_modules")))
      if (dependency !== "@dotln" && dependency !== ".bin")
        symlinkSync(
          join(root, "node_modules", dependency),
          join(staging, "node_modules", dependency),
        );
    for (const name of readdirSync(join(tree, "packages"))) {
      const from = join(tree, "packages", name);
      if (!existsSync(join(from, "package.json"))) continue;
      const to = join(staging, "packages", name);
      if (!existsSync(join(from, "tsconfig.json")))
        cpSync(from, to, {
          recursive: true,
          filter: (source) => !/\/(?:node_modules|dist)(?:\/|$)/u.test(source),
        });
      else {
        mkdirSync(to, { recursive: true });
        for (const file of ["package.json", "tsconfig.json"])
          cpSync(join(from, file), join(to, file));
        for (const directory of ["src", "test"])
          if (existsSync(join(from, directory)))
            cpSync(join(from, directory), join(to, directory), {
              recursive: true,
            });
      }
      symlinkSync(to, join(staging, "node_modules/@dotln", name));
    }
    execFileSync(
      process.execPath,
      [join(root, "node_modules/typescript/bin/tsc"), "-b", "--force"],
      { cwd: staging, stdio: ["ignore", "pipe", "pipe"] },
    );
    builds.set(side, staging);
  }
  // packages/<name>/src/<file>.ts is compiled to packages/<name>/dist/src/<file>.js
  return import(
    pathToFileURL(
      join(
        staging,
        path
          .replace(/^(packages\/[^/]+)\//u, "$1/dist/")
          .replace(/\.ts$/u, ".js"),
      ),
    ).href
  );
};
const tracked = (...paths) =>
  git(
    [
      "ls-files",
      "-z",
      "--cached",
      "--others",
      "--exclude-standard",
      "--",
      ...paths,
    ],
    {
      encoding: "utf8",
    },
  )
    .split("\0")
    .filter((path) => path && existsSync(join(root, path)));
const text = (path) => readFileSync(join(root, path), "utf8");
// A document as each commit that changed it held it: `<path>@<commit>`.
const revisions = (path) =>
  git(["log", "--format=%H", "--", path], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .map((revision) => `${path}@${revision}`);
const revisionText = (input) => {
  const at = input.lastIndexOf("@");
  return git(["show", `${input.slice(at + 1)}:${input.slice(0, at)}`], {
    encoding: "utf8",
  });
};
// A document as the worktree holds it and as each commit that changed it
// held it: the path first, then `<path>@<commit>` newest first.
const history = (path) => [path, ...revisions(path)];
const inputText = (input) =>
  input.includes("@") ? revisionText(input) : text(input);
// A function of a module that no export reaches, exposed once for each side.
const exposedOnce = (path, names) => {
  let both;
  return () =>
    (both ??= Promise.all([
      exposed("old", path, names),
      exposed("new", path, names),
    ]).then(([before, after]) => ({ before, after })));
};
const releaseHistory = exposedOnce("scripts/lib/release-history.mjs", [
  "historicalComponents",
  "orderLinks",
]);
// A committed root of this worktree's documents under the default layout,
// holding only the tracked files `keep` admits: a reader that walks a whole
// root then reads these documents and nothing else, and the base's code
// meets no record of this order's that it cannot read.
const documentRoots = new Map();
const documentsRoot = (name, directories, keep = () => true) => {
  if (documentRoots.has(name)) return documentRoots.get(name);
  const copy = join(scratch, `${name}-root`);
  for (const path of tracked(...directories).filter(keep)) {
    mkdirSync(dirname(join(copy, path)), { recursive: true });
    writeFileSync(join(copy, path), readFileSync(join(root, path)));
  }
  writeFileSync(join(copy, "dotln.config.json"), '{"version":1}\n');
  execFileSync("git", ["init", "-q", copy]);
  const inCopy = (argv) =>
    execFileSync("git", ["-C", copy, ...argv], { stdio: "ignore" });
  inCopy(["add", "-A"]);
  inCopy([
    "-c",
    "user.name=comparison",
    "-c",
    "user.email=comparison@example.invalid",
    "-c",
    "core.hooksPath=/dev/null",
    "commit",
    "-qm",
    "the documents",
  ]);
  documentRoots.set(name, copy);
  return copy;
};
// A pattern the base wrote inline, with no function to call: the literal is
// taken from the base's own file by the text it opens with, so the old
// reading is the base's bytes and no copy of them made here.
// Where the base wrote the same literal more than once, every copy must be
// the same pattern with the same flags, and that one pattern is the reading.
const basePattern = (path, opens) => {
  const source = readFileSync(join(scratch, path), "utf8");
  const literal = (start) => {
    let at = start + 1;
    for (let inClass = false; at < source.length; at++) {
      const mark = source[at];
      if (mark === "\\") at++;
      else if (mark === "[") inClass = true;
      else if (mark === "]") inClass = false;
      else if (mark === "/" && !inClass) break;
    }
    return [
      source.slice(start + 1, at),
      /^[a-z]*/u.exec(source.slice(at + 1))[0],
    ];
  };
  const found = [];
  for (
    let start = source.indexOf(opens);
    start >= 0;
    start = source.indexOf(opens, start + 1)
  )
    found.push(literal(start));
  if (
    !found.length ||
    found.some(([body, flags]) => body !== found[0][0] || flags !== found[0][1])
  )
    throw new Error(`${path}: expected one pattern that opens ${opens}`);
  return new RegExp(...found[0]);
};
// check-publication.mjs is a command: its readers are reached through a copy
// with the command line cut away and the root bound to this checkout.
const cutPublicationCli = (source) => {
  const screen =
    /const \{ checkPublicPlanConversations \} =\n\s*await import\("\.\/lib\/plan-first-screen\.mjs"\);\ntry \{\n\s*checkPublicPlanConversations\(root\);\n\} catch \(error\) \{\n\s*console\.error\(error\.message\);\n\s*process\.exit\(1\);\n\}\n/u;
  const main = source.indexOf("\nconst failures = [];\n");
  if (!screen.test(source) || main < 0)
    throw new Error("check-publication: its command line moved");
  return source
    .slice(0, main)
    .replace(
      "const root = findLaunchpad();",
      `const root = ${JSON.stringify(root)};`,
    )
    .replace(screen, "")
    .replace("const args = process.argv.slice(2);", "const args = [];");
};
// A long reading's bytes, compared by a digest of them.
const digest = (value) =>
  createHash("sha256").update(value).digest("hex").slice(0, 16);
// Every order's decisions file in a root that holds nothing else, committed:
// the base's control fold cannot read a control log this order's Part A
// changed, and no decision's reading depends on one.
let decisionsCopy;
const decisionsRoot = () => {
  if (decisionsCopy) return decisionsCopy;
  const copy = join(scratch, "decisions-root");
  for (const path of tracked("docs/evidence").filter((path) =>
    /^docs\/evidence\/WO-\d{3}\/decisions\.md$/u.test(path),
  )) {
    mkdirSync(dirname(join(copy, path)), { recursive: true });
    writeFileSync(join(copy, path), readFileSync(join(root, path)));
  }
  writeFileSync(join(copy, "dotln.config.json"), '{"version":1}\n');
  execFileSync("git", ["init", "-q", copy]);
  const inCopy = (argv) =>
    execFileSync("git", ["-C", copy, ...argv], { stdio: "ignore" });
  inCopy(["add", "-A"]);
  inCopy([
    "-c",
    "user.name=comparison",
    "-c",
    "user.email=comparison@example.invalid",
    "-c",
    "core.hooksPath=/dev/null",
    "commit",
    "-qm",
    "the decisions files",
  ]);
  return (decisionsCopy = copy);
};
const orders = () =>
  tracked("docs/work-orders").filter((path) =>
    /\/WO-\d{3}-[^/]+\.md$/u.test(path),
  );
// The sources the imports comparison reads: every script and package source
// but the carried parser.
const sources = () =>
  tracked("scripts", "packages").filter(
    (path) =>
      /\.(?:mjs|cjs|js|ts)$/u.test(path) &&
      !path.startsWith("scripts/lib/vendor/"),
  );
const answer = (read) => {
  try {
    return JSON.stringify(read()) ?? "undefined";
  } catch (error) {
    return `threw: ${error.message.split("\n")[0]}`;
  }
};

/** Each comparison: its inputs, and the old and the new answer for one. */
const COMPARISONS = {
  "markdown-links": async () => {
    const before = await old("scripts/lib/markdown-links.mjs");
    const after = await now("scripts/lib/markdown-links.mjs");
    // The base's reader had links and code spans; address ranges came later.
    const read = (reader) => (path) => [
      reader.markdownLinks(text(path)),
      reader.markdownCodeSpans(text(path)),
    ];
    return {
      reads:
        "every Markdown document under docs/, the root documents and the kit templates: its links and its code spans",
      inputs: tracked("docs", "*.md", "scripts/kit").filter((path) =>
        path.endsWith(".md"),
      ),
      old: read(before),
      new: read(after),
    };
  },
  "work-order-headers": async () => {
    const before = {
      ...(await old("scripts/lib/work-order-repository.mjs")),
      ...(await old("scripts/lib/work-order-workstream.mjs")),
      ...(await old("scripts/work-orders.mjs")),
    };
    const after = {
      ...(await now("scripts/lib/work-order-repository.mjs")),
      ...(await now("scripts/lib/work-order-workstream.mjs")),
      ...(await now("scripts/work-orders.mjs")),
    };
    // The index reads a header as core's own root reads it, which this root
    // is; the base's reader took no such option. A key the base's header
    // did not hold is a field this order added, which no old reader read:
    // the worktree's header is compared on the base's keys.
    const read = (reader, options) => (path) => {
      const header = reader.parseHeader(text(path), path, options);
      const base = before.parseHeader(text(path), path);
      return [
        reader.parseRepositoryDeclaration(text(path), path),
        reader.parseWorkstreamDeclaration(text(path), path),
        Object.fromEntries(Object.keys(base).map((key) => [key, header[key]])),
      ];
    };
    return {
      reads:
        "every work order, and the one retired order, which alone declares a workstream: its repository and workstream declarations and its header fields, as the index reads them in core's root, on the keys the base's header holds",
      inputs: [
        ...orders(),
        ...tracked("docs/retired").filter((path) =>
          /\/WO-\d{3}-[^/]+\.md$/u.test(path),
        ),
      ],
      old: read(before),
      new: read(after, { core: true }),
    };
  },
  // Not an old reader against a new one: the header read from the leading
  // part alone against the same header read from the whole document, which
  // is what makes the short read safe to use.
  "work-order-header-only": async () => {
    const reader = await now("scripts/lib/work-order-document.mjs");
    const view = (order) => ({
      title: order.title?.title ?? null,
      leadStart: order.leadStart,
      headerEnd: order.headerEnd,
      header: order.header.map((field) => [
        field.label,
        field.colon,
        field.value,
        field.lineValue,
        field.start,
        field.end,
        field.endLine,
        field.line,
        field.raw,
      ]),
    });
    return {
      reads:
        "every work order: its title and header fields with their extents, read from the whole document (old) and from the text before its Objective or first later heading (new)",
      inputs: tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ),
      old: (path) => view(reader.readWorkOrder(text(path))),
      new: (path) => view(reader.readWorkOrderHeader(text(path))),
    };
  },
  imports: async () => {
    const before = await old("scripts/lib/evidence-sources.mjs");
    const after = await now("scripts/lib/evidence-sources.mjs");
    return {
      reads:
        "every JavaScript and TypeScript source under scripts/ and packages/: the relative imports the evidence inventories follow",
      inputs: tracked("scripts", "packages").filter(
        (path) =>
          /\.(?:mjs|cjs|js|ts)$/u.test(path) &&
          !path.startsWith("scripts/lib/vendor/"),
      ),
      old: (path) => before.relativeImports(root, path),
      new: (path) => after.relativeImports(root, path),
    };
  },
  decisions: async () => {
    const before = await old("scripts/lib/meta.mjs");
    const after = await now("scripts/lib/meta.mjs");
    // Both readers read the same decisions files from a root that holds
    // nothing else.
    const copy = decisionsRoot();
    // A record's heading anchor is a property the listing does not
    // enumerate: it is taken by name, since the decisions index links by it.
    const byId = (rows) =>
      new Map(
        rows.map(({ path, ...row }) => [
          row.id,
          { ...row, anchor: row.anchor ?? null },
        ]),
      );
    const was = byId(before.readDecisions(copy));
    const is = byId(after.readDecisions(copy));
    return {
      reads:
        "every structured decision of every order's decisions file, by its identifier: the record as the lifecycle reads it",
      inputs: [...new Set([...was.keys(), ...is.keys()])].sort(),
      old: (id) => was.get(id) ?? null,
      new: (id) => is.get(id) ?? null,
    };
  },
  "order-criteria": async () => {
    const before = await old("scripts/lib/handoff-ledger.mjs");
    const after = await now("scripts/lib/handoff-ledger.mjs");
    const read = (reader) => (path) => [
      reader.declaredCriteria(text(path)),
      reader.readPreflightSuites(text(path)),
    ];
    return {
      reads:
        "every work order: its declared criteria as the lifecycle joins them, and the suites its Preflight line names",
      inputs: tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ),
      old: read(before),
      new: read(after),
    };
  },
  dependencies: async () => {
    const before = await old("scripts/lib/dependencies.mjs");
    const after = await now("scripts/lib/dependencies.mjs");
    const historical = after.historicalDependencyIds(root);
    return {
      reads:
        "every work order: its typed dependency block or its Depends on line, as activation and the index project it",
      inputs: tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ),
      old: (path) =>
        before.parseDependencies(text(path), path, undefined, historical),
      new: (path) =>
        after.parseDependencies(text(path), path, undefined, historical),
    };
  },
  "generated-pages": async () => {
    const before = await old("scripts/lib/document-kinds.mjs");
    const after = await now("scripts/lib/document-kinds.mjs");
    return {
      reads:
        "every Markdown document under docs/ and at the root: whether a line outside code and outside a marker block says a command wrote the page",
      inputs: tracked("docs", "*.md").filter((path) => path.endsWith(".md")),
      old: (path) => before.hasGeneratedMarker(text(path)),
      new: (path) => after.hasGeneratedMarker(text(path)),
    };
  },
  // The planning subject's readers have no old function to call beside the
  // new: what the old readers read is what each filed receipt holds, the
  // subject its pass was judged on, rebuilt here from the same revision.
  "planning-subjects": async () => {
    const after = await now("scripts/lib/plan-subject.mjs");
    const directory = "docs/planning/refutations";
    const receipt = (path) => JSON.parse(text(path));
    return {
      reads:
        "every filed planning receipt: the judged subject it holds (the sequence block, each order's objective, criteria and non-goals, the capability rows and the goal rules), against the subject rebuilt from the same committed revision",
      inputs: tracked(directory).filter(
        (path) => path.endsWith(".json") && receipt(path)?.subject?.revision,
      ),
      old: (path) => receipt(path).subject,
      new: (path) => {
        const { subject } = receipt(path);
        return after.buildPlanSubject(root, subject.revision, {
          goalReview: Boolean(subject.goalReview),
          separateTrack: subject.separateTrack !== undefined,
        });
      },
    };
  },
  // The same subjects built by the base's own function and by the
  // worktree's, from each receipt's committed revision: the comparison
  // above holds the new readers to what was judged, and this one to the
  // base's code.
  "planning-subjects-base": async () => {
    const before = await old("scripts/lib/plan-subject.mjs");
    const after = await now("scripts/lib/plan-subject.mjs");
    const directory = "docs/planning/refutations";
    const receipt = (path) => JSON.parse(text(path));
    const build = (reader) => (path) => {
      const { subject } = receipt(path);
      return reader.buildPlanSubject(root, subject.revision, {
        goalReview: Boolean(subject.goalReview),
        separateTrack: subject.separateTrack !== undefined,
      });
    };
    return {
      reads:
        "every filed planning receipt's committed revision: the planning subject the base's function builds from it, against the one the worktree's builds",
      inputs: tracked(directory).filter(
        (path) => path.endsWith(".json") && receipt(path)?.subject?.revision,
      ),
      old: build(before),
      new: build(after),
    };
  },
  // The rules-recorded block a planning pass's document carries, which
  // the pass's skeleton writes and the planning check reads (the mid-order
  // ladder's first round, combined).
  "planning-rules": async () => {
    const before = await old("scripts/lib/planning-document.mjs");
    const after = await now("scripts/lib/planning-document.mjs");
    const read = (reader) => (path) =>
      reader.rulesRecordedBlock(text(path), path);
    return {
      reads:
        "every Markdown document under docs/planning: its rules-recorded block, or that it holds none",
      inputs: tracked("docs/planning").filter((path) => path.endsWith(".md")),
      old: read(before),
      new: read(after),
    };
  },
  // The comparisons below were added by the repair of VER-002's finding on
  // this evidence: each reader the coverage map had sent to a comparison
  // that never called it, or had left to a check that would not show a
  // changed reading, is called here at the base and in the worktree.
  "known-issues": async () => {
    const before = await old("scripts/lib/verification-briefing.mjs");
    const after = await now("scripts/lib/verification-briefing.mjs");
    return {
      reads:
        "every work order: its Known issues and carry-ins sections, each with its lines and the line that ends it, the lines that write the label in another layout, and a fence the order never closes",
      inputs: orders(),
      old: (path) => before.knownIssueSections(text(path)),
      new: (path) => after.knownIssueSections(text(path)),
    };
  },
  "criterion-judgments": async () => {
    const before = await old("scripts/lib/off-ramps.mjs");
    const after = await now("scripts/lib/off-ramps.mjs");
    return {
      reads:
        "every handoff, verification report and final-review report: each criterion's judgment with the evidence its paragraph holds",
      inputs: [
        ...tracked("docs/evidence").filter((path) =>
          /^docs\/evidence\/WO-\d{3}\/handoff\.md$/u.test(path),
        ),
        ...tracked("docs/verifications").filter((path) =>
          /\/VER-\d{3}\.md$/u.test(path),
        ),
        ...tracked("docs/final-reviews").filter((path) =>
          /\/FINAL-\d{3}\.md$/u.test(path),
        ),
      ],
      old: (path) => before.criterionJudgments(text(path)),
      new: (path) => after.criterionJudgments(text(path)),
    };
  },
  "plan-cost": async () => {
    const before = await old("scripts/lib/plan-subject.mjs");
    const after = await now("scripts/lib/plan-subject.mjs");
    return {
      reads: "every work order: the Cost declaration a planning pass judges",
      inputs: orders(),
      old: (path) => before.planCostDeclaration(text(path)),
      new: (path) => after.planCostDeclaration(text(path)),
    };
  },
  "product-content": async () => {
    const before = await old("scripts/docs-check.mjs");
    const after = await now("scripts/docs-check.mjs");
    const prefix = "docs/product/";
    return {
      reads:
        "every product document: its sections with their anchors, levels and byte counts, and the failures its form raises, as the document check measures them",
      inputs: tracked("docs/product").filter(
        (path) => path.endsWith(".md") && !path.endsWith("/README.md"),
      ),
      old: (path) =>
        before.productContent(path.slice(prefix.length), text(path)),
      new: (path) =>
        after.productContent(path.slice(prefix.length), text(path)),
    };
  },
  "red-tags": async () => {
    const before = await old("scripts/lib/document-kinds.mjs");
    const after = await now("scripts/lib/document-kinds.mjs");
    return {
      reads:
        "every Markdown document under docs/planning: the red-tag block between its markers, or that it holds none",
      inputs: tracked("docs/planning").filter((path) => path.endsWith(".md")),
      old: (path) => before.redTagBlock(text(path), path),
      new: (path) => after.redTagBlock(text(path), path),
    };
  },
  "execution-plan-paths": async () => {
    const names = ["executionPlanPaths"];
    const before = await exposed("old", "scripts/lib/plan-receipts.mjs", names);
    const after = await exposed("now", "scripts/lib/plan-receipts.mjs", names);
    return {
      reads:
        "every work order: the paths its Execution plan names in code spans, which the advisory for a target order's paths reads",
      inputs: orders(),
      old: (path) => before.executionPlanPaths(text(path)),
      new: (path) => after.executionPlanPaths(text(path)),
      summarize: (a, b) => {
        const left = JSON.parse(a),
          right = JSON.parse(b);
        return {
          gained: right.filter((path) => !left.includes(path)),
          lost: left.filter((path) => !right.includes(path)),
          reordered:
            left.length === right.length &&
            left.every((path) => right.includes(path)),
        };
      },
    };
  },
  "amendment-decisions": async () => {
    const names = ["amendmentDecision"];
    const before = await exposed("old", "scripts/lib/plan-receipts.mjs", names);
    const after = await exposed("now", "scripts/lib/plan-receipts.mjs", names);
    const subject = {
      old: await old("scripts/lib/plan-subject.mjs"),
      new: await now("scripts/lib/plan-subject.mjs"),
    };
    const copy = decisionsRoot();
    const amended = text("docs/control/plan-refutations.jsonl")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .filter((row) => row.type === "PlanExecutionAmended");
    return {
      reads:
        "every decision a recorded execution amendment names: the decision's record as its committed file holds it, by the hash the amendment binds, with its execution write-backs",
      inputs: [...new Set(amended.map((row) => row.decisionId))].sort(),
      old: (id) =>
        before.amendmentDecision(copy, id, subject.old.committedReader(copy)),
      new: (id) =>
        after.amendmentDecision(copy, id, subject.new.committedReader(copy)),
    };
  },
  "planning-passes": async () => {
    const before = await old("scripts/lib/plan-subject.mjs");
    const after = await now("scripts/lib/plan-subject.mjs");
    const ledger = "docs/lineage/idea-ledger.md";
    const receipts = tracked("docs/planning/refutations").filter(
      (path) => path.endsWith(".json") && JSON.parse(text(path))?.pass?.heading,
    );
    // The ledger as each of its revisions held it, and the one heading a
    // receipt carries, which the receipt reader hands the same function.
    const source = (input) =>
      input.endsWith(".json")
        ? `## ${JSON.parse(text(input)).pass.heading}\n`
        : revisionText(input);
    return {
      reads:
        "every committed revision of the idea ledger and every receipt's pass heading: the dated planning passes, each with its heading and identifier",
      inputs: [...revisions(ledger), ...receipts],
      old: (input) => before.planningPasses(source(input)),
      new: (input) => after.planningPasses(source(input)),
    };
  },
  "planning-captures": async () => {
    const before = await old("scripts/lib/meta.mjs");
    const after = await now("scripts/lib/meta.mjs");
    const ledger = "docs/lineage/idea-ledger.md";
    // One root that holds a revision of the ledger and nothing else.
    const copy = join(scratch, "ledger-root");
    mkdirSync(join(copy, dirname(ledger)), { recursive: true });
    writeFileSync(join(copy, "dotln.config.json"), '{"version":1}\n');
    execFileSync("git", ["init", "-q", copy]);
    const read = (reader) => (input) => {
      writeFileSync(join(copy, ledger), revisionText(input));
      return reader.planningCaptures(copy);
    };
    return {
      reads:
        "every committed revision of the idea ledger: each planning pass with the number of intake captures its section cites",
      inputs: revisions(ledger),
      old: read(before),
      new: read(after),
    };
  },
  "operator-words": async () => {
    const before = await old("scripts/docs-check.mjs");
    const after = await now("scripts/docs-check.mjs");
    // A root with the documents the screen reads and no control log.
    const copy = join(scratch, "words-root");
    for (const path of tracked("docs").filter(
      (path) =>
        /^docs\/(?:work-orders|verifications|final-reviews|planning)\/.+\.md$/u.test(
          path,
        ) || /^docs\/evidence\/WO-\d{3}\/decisions\.md$/u.test(path),
    )) {
      mkdirSync(dirname(join(copy, path)), { recursive: true });
      writeFileSync(join(copy, path), readFileSync(join(root, path)));
    }
    writeFileSync(join(copy, "dotln.config.json"), '{"version":1}\n');
    execFileSync("git", ["init", "-q", copy]);
    const byRecord = (rows) =>
      new Map(rows.map((row) => [`${row.file}#${row.record}`, row]));
    const was = byRecord(before.operatorWordFindings(copy));
    const is = byRecord(after.operatorWordFindings(copy));
    return {
      reads:
        "every work order's provenance fields, every decision's section and fields, and every paragraph of a report or planning document that attributes words: each record the operator-words screen finds, with its class, its fingerprint and the lines it spans",
      inputs: [...new Set([...was.keys(), ...is.keys()])].sort(),
      old: (key) => was.get(key) ?? null,
      new: (key) => is.get(key) ?? null,
    };
  },
  "order-declarations": async () => {
    // The lifecycle reads the launchpad's root when its module loads.
    process.env.DOTLN_LAUNCHPAD = root;
    const names = ["workOrderDeclaration", "reactivationNotes"];
    const before = await exposed("old", "scripts/resume.mjs", names);
    const after = await exposed("now", "scripts/resume.mjs", names);
    const read = (reader) => (path) => [
      reader.workOrderDeclaration(path, {
        workOrderId: /(WO-\d{3})-/u.exec(path)[1],
        allowLegacyMissingEffort: true,
      }),
      reader.reactivationNotes(text(path)),
    ];
    return {
      reads:
        "every work order: the Model, Effort and Experiment declarations an activation reads with the efforts they name, its repository declaration, and its reactivation notes",
      inputs: orders(),
      old: read(before),
      new: read(after),
    };
  },
  "sequence-groups": async () => {
    const before = await old("scripts/work-orders.mjs");
    const after = await now("scripts/work-orders.mjs");
    const read = (reader) => (input) =>
      reader.parseSequenceGroups(revisionText(input), input);
    return {
      reads:
        "every committed revision of the proposed sequence: its entries with their labels, in their lane groups",
      inputs: revisions("docs/planning/sequence.md"),
      old: read(before),
      new: read(after),
    };
  },
  "index-partition": async () => {
    const before = await old("scripts/work-orders.mjs");
    const after = await now("scripts/work-orders.mjs");
    const pages = {
      "docs/work-orders/README.md": "index",
      "docs/work-orders/HISTORY.md": "history",
    };
    const rows = after.readIndex(root, []).rows;
    // With no order named, each reader's refusal lists every card it found
    // on a page, in the page's order: the cards the base read from the
    // page's text, and the cards the worktree takes from the index's rows.
    const found = (check, page) => {
      try {
        check();
        return [];
      } catch (error) {
        return [...error.message.matchAll(/(WO-\d{3}) has a card on/gu)].map(
          (match) => match[1],
        );
      }
    };
    return {
      reads:
        "the two generated pages of the index: the order of each card a page holds, as the partition check reads them",
      inputs: Object.keys(pages),
      old: (path) =>
        found(() =>
          before.checkPartition({ rows: [] }, { [path]: text(path) }),
        ),
      new: (path) =>
        found(() =>
          after.checkPartition(
            { rows: [] },
            { [path]: after.pageCards(rows, pages[path]).map((row) => row.id) },
          ),
        ),
    };
  },
  "umbrella-notices": async () => {
    const notice = basePattern(
      "scripts/lib/plan-dependency-migration.mjs",
      "/^\\*\\*Umbrella record",
    );
    const dependencies = await now("scripts/lib/dependencies.mjs");
    const reader = await now("scripts/lib/work-order-document.mjs");
    // What the dependency migration takes from the notice: that it is
    // there, that it says the order is superseded whole, and which orders
    // it names. The base's match holds the label and the worktree's value
    // does not, so the label is set aside on the base's side.
    const taken = (value) =>
      value === undefined
        ? null
        : {
            whole: value.includes("superseded whole"),
            first:
              value.match(/superseded whole by \[?(WO-\d{3})/u)?.[1] ?? null,
            named: [...new Set(value.match(/WO-\d{3}/gu) ?? [])],
            text: value.replace(/\s+/gu, " ").trim(),
          };
    return {
      reads:
        "every work order: its Umbrella record notice as the dependency migration reads it (the base's own pattern, taken from its file, against the order reader's field)",
      inputs: orders(),
      old: (path) =>
        taken(
          text(path)
            .match(notice)?.[0]
            .replace(/^\*\*[^*]*\*\*/u, ""),
        ),
      new: (path) =>
        taken(
          dependencies.umbrellaNotice(reader.readWorkOrder(text(path)))?.value,
        ),
    };
  },
  "cost-fields": async () => {
    const cost = basePattern("scripts/lib/meta.mjs", "/^\\*\\*Cost:\\*\\*");
    const reader = await now("scripts/lib/work-order-document.mjs");
    const flat = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
    return {
      reads:
        "every work order: the Cost declaration the metrics reconcile (the base's own pattern, taken from its file, against the order reader's header field)",
      inputs: orders(),
      old: (path) => flat(cost.exec(text(path))?.[1]),
      new: (path) =>
        flat(reader.readWorkOrder(text(path)).headerFields("Cost")[0]?.value),
    };
  },
  "script-tokens": async () => {
    const before = await old("scripts/lib/machinery-coverage.mjs");
    const after = await now("scripts/lib/machinery-coverage.mjs");
    return {
      reads:
        "every JavaScript and TypeScript source under scripts/ and packages/: the tokens the machinery-coverage and temporary-root declarations read, the base's own drive of the scanner against the source reader's",
      inputs: sources(),
      old: (path) => [...before.scriptTokens(text(path))],
      new: (path) => [...after.scriptTokens(text(path))],
    };
  },
  "feedback-comments": async () => {
    // A TypeScript module with its types removed, loaded from scratch: the
    // base's asks the compiler's interface for a tree through a require
    // bound to the worktree's packages, and the worktree's takes its tree
    // from the source reader beside it.
    const file = "packages/skeleton/src/feedback-source-comments.ts";
    const load = async (name, source, bind) => {
      const copy = join(scratch, name);
      writeFileSync(
        copy,
        bind(stripTypeScriptTypes(source, { mode: "strip" })),
      );
      return import(pathToFileURL(copy).href);
    };
    const located = JSON.stringify(pathToFileURL(join(root, file)).href);
    const before = await load(
      "old-feedback-comments.mjs",
      readFileSync(join(scratch, file), "utf8"),
      (source) =>
        source.replace(
          "createRequire(import.meta.url)",
          `createRequire(${located})`,
        ),
    );
    const after = await load(
      "new-feedback-comments.mjs",
      text(file),
      (source) =>
        source.replace(
          '"./source-reading.mjs"',
          JSON.stringify(
            pathToFileURL(join(root, dirname(file), "source-reading.mjs")).href,
          ),
        ),
    );
    return {
      reads:
        "every JavaScript and TypeScript source under scripts/ and packages/: the comment bodies the feedback audit judges, the base's own syntax tree against the source reader's",
      inputs: sources(),
      old: (path) => before.feedbackSourceComments(path, text(path)),
      new: (path) => after.feedbackSourceComments(path, text(path)),
    };
  },
  // The readers the coverage map had left to a check or to unit cases
  // although they read committed documents: each is compared here over those
  // documents. Where only a whole judgment can be called, the comparison
  // projects it to what the moved reader extracts, since a later part's new
  // rule is no difference of reading.
  "receipt-cost-lines": async () => {
    const before = await exposed("old", "scripts/lib/receipt-cost.mjs", [
      "costLines",
    ]);
    const after = await exposed("now", "scripts/lib/receipt-cost.mjs", [
      "costLines",
    ]);
    return {
      reads:
        "every filed verification and final-review report: the body of each Process cost line outside code",
      inputs: tracked("docs/verifications", "docs/final-reviews").filter(
        (path) => /\/WO-\d{3}\/(?:VER|FINAL)-\d{3}\.md$/u.test(path),
      ),
      old: (path) => before.costLines(text(path)),
      new: (path) => after.costLines(text(path)),
    };
  },
  "findings-blocks": async () => {
    const before = await old("scripts/lib/review-findings.mjs");
    const after = await now("scripts/lib/review-findings.mjs");
    return {
      reads:
        "every filed verification and final-review report: its findings block, read or the cause it cannot be",
      inputs: tracked("docs/verifications", "docs/final-reviews").filter(
        (path) => /\/WO-\d{3}\/(?:VER|FINAL)-\d{3}\.md$/u.test(path),
      ),
      old: (path) => before.readFindingsBlock(text(path)),
      new: (path) => after.readFindingsBlock(text(path)),
    };
  },
  // routeFacts reads the bound failure report inline. Both sides run the
  // module's own statements, sliced from its text: from the `const block`
  // that follows the report-hash check to the statement that sets
  // facts.operatorFinding, wrapped in a function of the report's text.
  "drive-route-operator-finding": async () => {
    const wrap = (source) => {
      const from = source.indexOf(
        "const block",
        source.indexOf("bound failure report changed"),
      );
      const set = source.indexOf("facts.operatorFinding =", from);
      const to = source.indexOf(";", source.indexOf('"operator"', set)) + 1;
      if (from < 0 || set < 0 || to <= 0)
        throw new Error("drive-route: the findings statements moved");
      return `${source}\nconst operatorFinding = (text) => {\n  const facts = {};\n  const bytes = { toString: () => text };\n  ${source.slice(from, to)}\n  return facts.operatorFinding ?? null;\n};\n`;
    };
    const before = await exposed(
      "old",
      "scripts/lib/drive-route.mjs",
      ["operatorFinding"],
      wrap,
    );
    const after = await exposed(
      "now",
      "scripts/lib/drive-route.mjs",
      ["operatorFinding"],
      wrap,
    );
    return {
      reads:
        "every filed verification and final-review report, as a bound failure report: whether its findings block routes a finding to the operator (null when no block is read)",
      inputs: tracked("docs/verifications", "docs/final-reviews").filter(
        (path) => /\/WO-\d{3}\/(?:VER|FINAL)-\d{3}\.md$/u.test(path),
      ),
      old: (path) => before.operatorFinding(text(path)),
      new: (path) => after.operatorFinding(text(path)),
    };
  },
  "release-notes-sections": async () => {
    const before = await old("scripts/lib/release-notes.mjs");
    const after = await now("scripts/lib/release-notes.mjs");
    return {
      reads:
        "every filed release-notes document: its five required sections as written, or the refusal the reader names",
      inputs: tracked("docs/final-reviews", "docs/releases").filter((path) =>
        /(?:\/RELEASE-NOTES|-notes)\.md$/u.test(path),
      ),
      old: (path) => before.parseReleaseNotes(text(path), path),
      new: (path) => after.parseReleaseNotes(text(path), path),
    };
  },
  "release-notes-target-source": async () => {
    const before = await old("scripts/lib/release-notes.mjs");
    const after = await now("scripts/lib/release-notes.mjs");
    return {
      reads:
        "every work order: the Release body source its Target release notes header names",
      inputs: tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ),
      old: (path) => before.targetReleaseNotesSource(text(path), path),
      new: (path) => after.targetReleaseNotesSource(text(path), path),
    };
  },
  // planReleasePreparation reads the order's heading and its Release
  // classification inline, after checks of the Git root, branch and phase.
  // Both sides run the module's own statements, sliced from its text: from
  // where the heading is read to where the classification is taken, wrapped
  // in a function of the order's text (no claim is repaired, no tag is
  // latest).
  "release-preparation-reading": async () => {
    const wrap = (start) => (source) => {
      const finish = "const classification = declared[1];";
      const from = source.indexOf(start);
      const to = source.indexOf(finish, from) + finish.length;
      if (from < 0 || to < finish.length)
        throw new Error("release-preparation: the reading moved");
      return `${source}\nconst releaseReading = (authority) => {\n  const repairClaim = false, latest = undefined;\n  ${source.slice(from, to)}\n  return { heading, previous, classification };\n};\n`;
    };
    const before = await exposed(
      "old",
      "scripts/lib/release-preparation.mjs",
      ["releaseReading"],
      wrap('const heading = authority.split("\\n", 1)[0];'),
    );
    const after = await exposed(
      "now",
      "scripts/lib/release-preparation.mjs",
      ["releaseReading"],
      wrap("const order = readWorkOrder(authority);"),
    );
    return {
      reads:
        "every work order, as release prepare reads its authority: the heading, the version it carries and the Release classification",
      inputs: tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ),
      old: (path) => before.releaseReading(text(path)),
      new: (path) => after.releaseReading(text(path)),
    };
  },
  // The kit template is the reader's only committed input: every committed
  // revision of it and the worktree's, each as the template and as the
  // floor, and each floor also as the base renders it with the election on,
  // judged with the election off and on.
  "instance-secrets": async () => {
    const before = await old("scripts/lib/features.mjs");
    const after = await now("scripts/lib/features.mjs");
    const path = "scripts/kit/CLAUDE.template.md";
    const revisions = git(["log", "--format=%H", "--", path], {
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean)
      .map((rev) => rev.slice(0, 12));
    const templates = new Map([
      ["worktree", text(path)],
      ...revisions.map((rev) => [
        rev,
        git(["show", `${rev}:${path}`], { encoding: "utf8" }),
      ]),
    ]);
    const floors = new Map(templates);
    for (const [name, source] of templates)
      try {
        floors.set(
          `${name}+private`,
          before.renderInstanceSecrets(source, source, true),
        );
      } catch {
        /* a revision without the paragraph has no private rendering */
      }
    const inputs = [];
    for (const template of templates.keys())
      for (const floor of floors.keys())
        for (const on of [false, true])
          inputs.push(`template ${template} | floor ${floor} | on ${on}`);
    const read = (reader) => (input) => {
      const [, template, floor, on] =
        /^template (\S+) \| floor (\S+) \| on (\w+)$/u.exec(input);
      return reader.renderInstanceSecrets(
        floors.get(floor),
        templates.get(template),
        on === "true",
      );
    };
    return {
      reads:
        "the kit's CLAUDE template at each committed revision and in the worktree: the instance floor rendered from its Secrets section",
      inputs,
      old: read(before),
      new: read(after),
    };
  },
  "harness-context-directives": async () => {
    const before = await old("scripts/lib/harness-context.mjs");
    const after = await now("scripts/lib/harness-context.mjs");
    const roles = [
      "executor",
      "verifier",
      "reviewer",
      "release-close",
      "planner",
      "refuter",
      "router",
    ];
    const files = tracked(
      "CLAUDE.md",
      ".claude/skills",
      ".agents/skills",
      ".claude/agents",
      "scripts/kit",
    ).filter((path) => path.endsWith(".md"));
    return {
      reads:
        "the instruction floor, every skill and agent definition and the kit templates, once per dispatch role: the Read directives each names",
      inputs: files.flatMap((path) => roles.map((role) => `${path} ${role}`)),
      old: (input) => {
        const [path, role] = input.split(" ");
        return before.readDirectives(text(path), role);
      },
      new: (input) => {
        const [path, role] = input.split(" ");
        return after.readDirectives(text(path), role);
      },
    };
  },
  // Each anchor a caller can hand the section reader: every heading line's
  // text in the documents directives and citations name (the floor, skills,
  // agents, product, architecture and planning documents), and every anchor
  // either side's directives or citations resolve.
  "harness-context-sections": async () => {
    const before = await old("scripts/lib/harness-context.mjs");
    const after = await now("scripts/lib/harness-context.mjs");
    const pairs = new Set();
    const documents = tracked(
      "CLAUDE.md",
      ".claude/skills",
      ".agents/skills",
      ".claude/agents",
      "docs/product",
      "docs/architecture",
      "docs/planning",
      "docs/decisions",
    ).filter((path) => path.endsWith(".md"));
    for (const path of documents) {
      pairs.add(`${path} § `);
      for (const [, title] of text(path).matchAll(
        /^ {0,3}#{1,6}[ \t]+(.+?)[ \t#]*$/gmu,
      ))
        pairs.add(`${path} § ${title}`);
    }
    const paths = tracked(".");
    const read = (path) => text(path);
    for (const reader of [before, after])
      for (const order of tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ))
        try {
          for (const selector of reader.citedSelectors(
            text(order),
            paths,
            read,
          )) {
            const [path, ...anchor] = selector.split("#");
            if (anchor.length) pairs.add(`${path} § ${anchor.join("#")}`);
          }
        } catch {
          /* an order whose citations do not resolve names no anchor */
        }
    const section = (reader) => (input) => {
      const at = input.indexOf(" § ");
      return reader.sectionRange(text(input.slice(0, at)), input.slice(at + 3));
    };
    return {
      reads:
        "every heading of the floor, skills, agents and product, architecture, planning and decision documents, and every anchor a work order cites: the lines of the section it opens",
      inputs: [...pairs].sort(),
      old: section(before),
      new: section(after),
    };
  },
  "harness-context-citations": async () => {
    const before = await old("scripts/lib/harness-context.mjs");
    const after = await now("scripts/lib/harness-context.mjs");
    const paths = tracked(".");
    const read = (path) => text(path);
    return {
      reads:
        "every work order: the files and sections its Cites block names, each resolved",
      inputs: tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ),
      old: (path) => before.citedSelectors(text(path), paths, read),
      new: (path) => after.citedSelectors(text(path), paths, read),
    };
  },
  // The soft-wrap reading alone: relative-link failures (`links`) are another
  // rule and are left off on both sides.
  "github-body-soft-wraps": async () => {
    const before = await old("scripts/lib/github-body.mjs");
    const after = await now("scripts/lib/github-body.mjs");
    return {
      reads:
        "every stored pull-request body and release-notes document under docs/final-reviews and docs/releases: each line a prose paragraph wraps onto",
      inputs: tracked("docs/final-reviews", "docs/releases").filter((path) =>
        /(?:\/PR|\/RELEASE-NOTES|-notes)\.md$/u.test(path),
      ),
      old: (path) => before.githubBodyProfileFailures(text(path)),
      new: (path) => after.githubBodyProfileFailures(text(path)),
    };
  },
  "github-body-shape": async () => {
    const before = await old("scripts/lib/github-body.mjs");
    const after = await now("scripts/lib/github-body.mjs");
    const inputs = tracked("docs/final-reviews").filter((path) =>
      /\/PR\.md$/u.test(path),
    );
    return {
      reads:
        "every stored pull-request body, as stored and as published: its heading, its prose before the process-meter block and what follows that block",
      inputs: inputs.flatMap((path) => [`${path} stored`, `${path} published`]),
      old: (input) => {
        const [path, form] = input.split(" ");
        return before.pullRequestBodyShapeFailures(text(path), {
          published: form === "published",
        });
      },
      new: (input) => {
        const [path, form] = input.split(" ");
        return after.pullRequestBodyShapeFailures(text(path), {
          published: form === "published",
        });
      },
    };
  },
  // criterionRecordProblem reads the record block's lines inline and compares
  // them with the order's record. Both sides run the module's own statements
  // that read the lines, sliced from its text, as a function of the body.
  "github-body-criterion-records": async () => {
    const wrap = (source) => {
      const from = source.indexOf(
        "const found",
        source.indexOf("export const criterionRecordProblem"),
      );
      const to = source.indexOf(": [];", from) + ": [];".length;
      if (from < 0 || to < 5)
        throw new Error("github-body: the record-line reading moved");
      return `${source}\nconst recordLines = (body) => {\n  ${source.slice(from, to)}\n  return lines;\n};\n`;
    };
    const before = await exposed(
      "old",
      "scripts/lib/github-body.mjs",
      ["recordLines"],
      wrap,
    );
    const after = await exposed(
      "now",
      "scripts/lib/github-body.mjs",
      ["recordLines"],
      wrap,
    );
    return {
      reads:
        "every stored pull-request body: the criterion-record lines between its record markers",
      inputs: tracked("docs/final-reviews").filter((path) =>
        /\/PR\.md$/u.test(path),
      ),
      old: (path) => before.recordLines(text(path)),
      new: (path) => after.recordLines(text(path)),
    };
  },
  // The Markdown reading of the outward lint is the rendered view of a
  // pull-request or release body (lintOutwardArtifact reads it for those two
  // kinds only); the rules judged over it are another matter. Each side's
  // view: the folded rendered text and the source span of each folded
  // character.
  "outward-rendered-view": async () => {
    const names = ["renderedUnits", "foldedWithOffsets"];
    const before = await exposed("old", "scripts/lib/outward-lint.mjs", names);
    const after = await exposed("now", "scripts/lib/outward-lint.mjs", names);
    const view = (reader) => (path) => {
      const { folded, positions } = reader.foldedWithOffsets(
        reader.renderedUnits(text(path)),
      );
      return {
        folded,
        spans: positions.map(({ start, end }) => `${start}-${end}`).join(" "),
      };
    };
    return {
      reads:
        "every stored pull-request body and release-notes document: the text GitHub shows, folded, with the source span of each character",
      inputs: tracked("docs/final-reviews", "docs/releases").filter((path) =>
        /(?:\/PR|\/RELEASE-NOTES|-notes)\.md$/u.test(path),
      ),
      old: view(before),
      new: view(after),
      summarize: (a, b) => {
        const left = JSON.parse(a),
          right = JSON.parse(b);
        if (!left?.folded || !right?.folded)
          return { old: a.slice(0, 300), new: b.slice(0, 300) };
        let at = 0;
        while (at < left.folded.length && left.folded[at] === right.folded[at])
          at++;
        const spansOld = left.spans.split(" "),
          spansNew = right.spans.split(" ");
        let span = 0;
        while (span < spansOld.length && spansOld[span] === spansNew[span])
          span++;
        // The words the term matcher reads, each with its source span, and
        // the text once spaces that open a line are taken out.
        const words = (side) => {
          const spans = side.spans.split(" ");
          return [...side.folded.matchAll(/[\p{L}\p{N}]+/gu)]
            .map(
              (match) =>
                `${match[0]}@${spans[match.index].split("-")[0]}-${spans[match.index + match[0].length - 1].split("-")[1]}`,
            )
            .join(" ");
        };
        const dedented = (side) => side.folded.replace(/\n[ \t]+/gu, "\n");
        return {
          sameWordsAndSpans: words(left) === words(right),
          sameTextOnceLineIndentRemoved: dedented(left) === dedented(right),
          firstTextDifference: at,
          old: JSON.stringify(left.folded.slice(Math.max(0, at - 60), at + 60)),
          new: JSON.stringify(
            right.folded.slice(Math.max(0, at - 60), at + 60),
          ),
          firstSpanDifference: span,
          oldSpan: spansOld.slice(span, span + 3).join(" "),
          newSpan: spansNew.slice(span, span + 3).join(" "),
        };
      },
    };
  },
  // check-publication.mjs is a script that runs on import. Both sides are
  // loaded as copies with its command line taken out: the root is this
  // worktree, the public-plan screen and the argument parse are dropped, and
  // the text from its main body (`const failures = [];`) on is cut, so its
  // functions and the declarations they read stay as written.
  "publication-headings": async () => {
    const { createHash } = await import("node:crypto");
    const cutCli = (source) => {
      const screen =
        /const \{ checkPublicPlanConversations \} =\n\s*await import\("\.\/lib\/plan-first-screen\.mjs"\);\ntry \{\n\s*checkPublicPlanConversations\(root\);\n\} catch \(error\) \{\n\s*console\.error\(error\.message\);\n\s*process\.exit\(1\);\n\}\n/u;
      const main = source.indexOf("\nconst failures = [];\n");
      if (!screen.test(source) || main < 0)
        throw new Error("check-publication: its command line moved");
      return source
        .slice(0, main)
        .replace(
          "const root = findLaunchpad();",
          `const root = ${JSON.stringify(root)};`,
        )
        .replace(screen, "")
        .replace("const args = process.argv.slice(2);", "const args = [];");
    };
    const before = await exposed(
      "old",
      "scripts/check-publication.mjs",
      ["headings"],
      cutCli,
    );
    const after = await exposed(
      "now",
      "scripts/check-publication.mjs",
      ["headings"],
      cutCli,
    );
    // Every committed revision of every numbered product document, and the
    // worktree's: the documents the index covers and the sections the
    // editions' source locks hash, at whatever revision a lock names.
    const sources = new Map();
    for (const path of tracked("docs/product").filter((path) =>
      /^docs\/product\/\d{2}-[^/]+\.md$/u.test(path),
    )) {
      sources.set(`worktree:${path}`, () => text(path));
      for (const rev of git(["log", "--format=%H", "--", path], {
        encoding: "utf8",
      })
        .split("\n")
        .filter(Boolean))
        sources.set(`${rev.slice(0, 12)}:${path}`, () =>
          git(["show", `${rev}:${path}`], { encoding: "utf8" }),
        );
    }
    const cache = new Map();
    const source = (input) => {
      if (!cache.has(input)) {
        cache.clear();
        cache.set(input, sources.get(input)());
      }
      return cache.get(input);
    };
    const digest = (value) =>
      createHash("sha256").update(value).digest("hex").slice(0, 16);
    const read = (reader) => (input) =>
      reader.headings(source(input)).map(({ text: section, ...heading }) => ({
        ...heading,
        section: digest(section),
      }));
    return {
      reads:
        "every committed revision of each numbered product document, and the worktree's: each heading's anchor, level, title and start, and its section's bytes (as a digest)",
      inputs: [...sources.keys()],
      old: read(before),
      new: read(after),
      summarize: (a, b) => {
        if (a.startsWith("threw") || b.startsWith("threw"))
          return { old: a.slice(0, 300), new: b.slice(0, 300) };
        const left = JSON.parse(a),
          right = JSON.parse(b);
        const key = (row) => JSON.stringify(row);
        const rightKeys = new Set(right.map(key)),
          leftKeys = new Set(left.map(key));
        return {
          headings: [left.length, right.length],
          onlyOld: left.filter((row) => !rightKeys.has(key(row))).slice(0, 3),
          onlyNew: right.filter((row) => !leftKeys.has(key(row))).slice(0, 3),
        };
      },
    };
  },
  // The coverage check over the worktree's index and product documents: the
  // index rows it reads (label, audiences and status by file and anchor) and
  // the failures it names. Loaded as in publication-headings.
  "publication-coverage": async () => {
    const cutCli = (source) => {
      const screen =
        /const \{ checkPublicPlanConversations \} =\n\s*await import\("\.\/lib\/plan-first-screen\.mjs"\);\ntry \{\n\s*checkPublicPlanConversations\(root\);\n\} catch \(error\) \{\n\s*console\.error\(error\.message\);\n\s*process\.exit\(1\);\n\}\n/u;
      const main = source.indexOf("\nconst failures = [];\n");
      if (!screen.test(source) || main < 0)
        throw new Error("check-publication: its command line moved");
      return source
        .slice(0, main)
        .replace(
          "const root = findLaunchpad();",
          `const root = ${JSON.stringify(root)};`,
        )
        .replace(screen, "")
        .replace("const args = process.argv.slice(2);", "const args = [];");
    };
    const before = await exposed(
      "old",
      "scripts/check-publication.mjs",
      ["checkCoverage"],
      cutCli,
    );
    const after = await exposed(
      "now",
      "scripts/check-publication.mjs",
      ["checkCoverage"],
      cutCli,
    );
    const read = (reader) => () => {
      const failures = [];
      const entries = reader.checkCoverage(failures);
      return {
        entries: [...(entries ?? new Map())].sort(([a], [b]) =>
          a < b ? -1 : a > b ? 1 : 0,
        ),
        failures,
      };
    };
    return {
      reads:
        "docs/publication/audience-status-index.md against the numbered product documents: the rows the coverage check reads and the failures it names",
      inputs: ["the worktree"],
      old: read(before),
      new: read(after),
    };
  },
  // The base's module imports the compiled feedback-source reader from
  // packages/skeleton/dist, which no archive holds; only a JavaScript or
  // TypeScript file's comments reach it, never a shell file's, so the base's
  // copy binds that one name to a function that throws if it is ever called.
  "shell-comments": async () => {
    const before = await exposed(
      "old",
      "scripts/lib/comment-labels.mjs",
      [],
      (source) => {
        const line =
          'import { feedbackSourcesComments } from "../../packages/skeleton/dist/src/feedback-source-comments.js";';
        if (!source.includes(line))
          throw new Error("comment-labels: the compiled import moved");
        return source.replace(
          line,
          'const feedbackSourcesComments = () => { throw new Error("not a shell reading"); };',
        );
      },
    );
    const after = await now("scripts/lib/comment-labels.mjs");
    const rows = (blocks) =>
      blocks.map((block) => block.map(({ line, text }) => [line, text]));
    return {
      reads:
        "every tracked shell script: its comment lines, each with its line, grouped into blocks",
      inputs: tracked(".").filter((path) => /\.sh$/u.test(path)),
      old: (path) => rows(before.fileComments(path, text(path), [])),
      new: (path) => rows(after.fileComments(path, text(path))),
    };
  },
  // The base's mission-check source read Markdown itself; the worktree's
  // takes what scripts/lib/mission-documents.mjs reads. Each side's skeleton
  // is compiled by `built` (worker-protocol.ts declares a parameter
  // property, which Node's type stripper refuses, so a strip-only load
  // cannot run either side).
  "mission-clauses": async () => {
    const before = await built(
      "old",
      "packages/skeleton/src/mission-check-source.ts",
    );
    const after = await built(
      "now",
      "packages/skeleton/src/mission-check-source.ts",
    );
    const documents = await now("scripts/lib/mission-documents.mjs");
    const surfaces = ["scripts/", "docs/"];
    return {
      reads:
        "every work order, as a mission contract: its objective, numbered criteria, non-goals and evidence gate as the capsule's clauses",
      inputs: tracked("docs/work-orders").filter((path) =>
        /\/WO-\d{3}-[^/]+\.md$/u.test(path),
      ),
      old: (path) => before.missionClauses(text(path), surfaces),
      new: (path) =>
        after.missionClauses(documents.missionContract(text(path)), surfaces),
    };
  },
  "mission-decisions": async () => {
    const before = await built(
      "old",
      "packages/skeleton/src/mission-check-source.ts",
    );
    const after = await built(
      "now",
      "packages/skeleton/src/mission-check-source.ts",
    );
    const documents = await now("scripts/lib/mission-documents.mjs");
    // The capsule's widest window (MISSION_CAPSULE_BOUNDS.decisions), so
    // every decision a file records is compared, not only the last five.
    const limit = 50;
    return {
      reads:
        "every order's decisions file: the decisions the mission capsule carries, id and text",
      inputs: tracked("docs/evidence").filter((path) =>
        /^docs\/evidence\/WO-\d{3}\/decisions\.md$/u.test(path),
      ),
      old: (path) => before.missionDecisions(text(path), limit),
      new: (path) =>
        after.missionDecisions(documents.decisionBlocks(text(path)), limit),
    };
  },
  // Every committed revision of the vision and the worktree's: the theses
  // under the binding's headings and under every other heading the vision
  // writes, and its exclusions.
  "mission-vision": async () => {
    const before = await built(
      "old",
      "packages/skeleton/src/mission-check-source.ts",
    );
    const after = await built(
      "now",
      "packages/skeleton/src/mission-check-source.ts",
    );
    const documents = await now("scripts/lib/mission-documents.mjs");
    const { MISSION_THESIS_HEADINGS } = await now("scripts/resident-bind.mjs");
    const path = "docs/product/00-vision.md";
    const revisions = new Map([
      ["worktree", text(path)],
      ...git(["log", "--format=%H", "--", path], { encoding: "utf8" })
        .split("\n")
        .filter(Boolean)
        .map((rev) => [
          rev.slice(0, 12),
          git(["show", `${rev}:${path}`], { encoding: "utf8" }),
        ]),
    ]);
    const headings = (source) => [
      ...MISSION_THESIS_HEADINGS,
      ...[...source.matchAll(/^#{2,3}[ \t]+(.+?)[ \t]*$/gmu)].map(
        ([, title], index) => [`heading-${index}`, title],
      ),
    ];
    const attempt = (read) => {
      try {
        return read();
      } catch (error) {
        return `threw: ${error.message}`;
      }
    };
    return {
      reads:
        "every committed revision of the vision, and the worktree's: the thesis text under each heading the capsule names and every other heading, and the exclusions",
      inputs: [...revisions.keys()],
      old: (rev) => {
        const source = revisions.get(rev);
        return {
          theses: attempt(() => before.missionTheses(source, headings(source))),
          exclusions: attempt(() => before.missionExclusions(source)),
        };
      },
      new: (rev) => {
        const source = revisions.get(rev);
        const vision = documents.missionDocumentReader.vision(source);
        return {
          theses: attempt(() => after.missionTheses(vision, headings(source))),
          exclusions: attempt(() => after.missionExclusions(vision)),
        };
      },
    };
  },
  // The console's authored-document readers. The base read each document's
  // Markdown itself; the worktree's reads the structure
  // scripts/lib/markdown-structure.mjs prints for it (what the collector's
  // `markdown-structure.mjs` run hands the board). Each row is projected to
  // what the board shows: its key and line, each cell's shown text (the
  // base's plainText, the worktree's cellText) and the links its cells hold.
  "console-capabilities": async () => {
    const before = await built("old", "packages/console/src/text-sources.ts");
    const after = await built("now", "packages/console/src/text-sources.ts");
    const structure = await now("scripts/lib/markdown-structure.mjs");
    const path = "docs/planning/capability-table.md";
    const revisions = new Map([
      ["worktree", () => text(path)],
      ...git(["log", "--format=%H", "--", path], { encoding: "utf8" })
        .split("\n")
        .filter(Boolean)
        .map((rev) => [
          rev.slice(0, 12),
          () => git(["show", `${rev}:${path}`], { encoding: "utf8" }),
        ]),
    ]);
    return {
      reads:
        "the capability table at every committed revision and in the worktree: each row of its recognized tables, with its assessment, as the board shows it",
      inputs: [...revisions.keys()],
      old: (rev) =>
        before.parseCapabilities(revisions.get(rev)()).map((row) => ({
          key: row.key,
          line: row.line,
          cells: Object.fromEntries(
            Object.entries(row.values).map(([label, value]) => [
              label,
              before.plainText(value),
            ]),
          ),
          links: Object.values(row.values).flatMap(before.markdownLinks),
        })),
      new: (rev) =>
        after
          .parseCapabilities(structure.markdownStructure(revisions.get(rev)()))
          .map((row) => ({
            key: row.key.source,
            line: row.line,
            cells: Object.fromEntries(
              Object.entries(row.values).map(([label, value]) => [
                label,
                after.cellText(value),
              ]),
            ),
            links: Object.values(row.values).flatMap((value) => value.links),
          })),
    };
  },
  "console-publication": async () => {
    const before = await built("old", "packages/console/src/text-sources.ts");
    const after = await built("now", "packages/console/src/text-sources.ts");
    const structure = await now("scripts/lib/markdown-structure.mjs");
    const path = "docs/publication/audience-status-index.md";
    const revisions = new Map([
      ["worktree", () => text(path)],
      ...git(["log", "--format=%H", "--", path], { encoding: "utf8" })
        .split("\n")
        .filter(Boolean)
        .map((rev) => [
          rev.slice(0, 12),
          () => git(["show", `${rev}:${path}`], { encoding: "utf8" }),
        ]),
    ]);
    return {
      reads:
        "the publication audience and status index at every committed revision and in the worktree: each row of its table as the board shows it",
      inputs: [...revisions.keys()],
      old: (rev) =>
        before
          .tableRows(revisions.get(rev)(), before.PUBLICATION_HEADER)
          .map((row) => ({
            key: row.key,
            line: row.line,
            cells: Object.fromEntries(
              Object.entries(row.values).map(([label, value]) => [
                label,
                before.plainText(value),
              ]),
            ),
            links: Object.values(row.values).flatMap(before.markdownLinks),
          })),
      new: (rev) =>
        after
          .tableRows(
            after.documentStructure(
              structure.markdownStructure(revisions.get(rev)()),
            ),
            after.PUBLICATION_HEADER,
          )
          .map((row) => ({
            key: row.key.source,
            line: row.line,
            cells: Object.fromEntries(
              Object.entries(row.values).map(([label, value]) => [
                label,
                after.cellText(value),
              ]),
            ),
            links: Object.values(row.values).flatMap((value) => value.links),
          })),
    };
  },
  "console-roadmap-rungs": async () => {
    const before = await built("old", "packages/console/src/text-sources.ts");
    const after = await built("now", "packages/console/src/text-sources.ts");
    const structure = await now("scripts/lib/markdown-structure.mjs");
    const path = "docs/product/06-roadmap.md";
    const revisions = new Map([
      ["worktree", () => text(path)],
      ...git(["log", "--format=%H", "--", path], { encoding: "utf8" })
        .split("\n")
        .filter(Boolean)
        .map((rev) => [
          rev.slice(0, 12),
          () => git(["show", `${rev}:${path}`], { encoding: "utf8" }),
        ]),
    ]);
    return {
      reads:
        "the roadmap at every committed revision and in the worktree: each pending application rung its level-two headings name",
      inputs: [...revisions.keys()],
      old: (rev) => before.parsePendingRungs(revisions.get(rev)()),
      new: (rev) =>
        after.parsePendingRungs(
          structure.markdownStructure(revisions.get(rev)()),
        ),
    };
  },
  // The work-order cards: the base read them from the generated pages; the
  // worktree's console reads the index command's own record
  // (`work-orders index --json`), which no file holds, so only this tree's
  // pages and record can be set side by side.
  "console-work-order-cards": async () => {
    const before = await built("old", "packages/console/src/text-sources.ts");
    const after = await built(
      "now",
      "packages/skeleton/src/runtime-status-contract.ts",
    );
    const record = execFileSync(
      process.execPath,
      [join(root, "scripts/work-orders.mjs"), "index", "--json"],
      { cwd: root, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
    );
    const pages = {
      index: ["docs/work-orders/README.md", "# Work orders"],
      history: ["docs/work-orders/HISTORY.md", "# Work-order history"],
    };
    // Each card as the board shows it: the base's cells were each value's
    // plainText (its title among them) and its links every value's Markdown
    // links (base packages/console/src/work.ts); the worktree's cells are the
    // record's title and field texts and its links the card's own.
    return {
      reads:
        "the generated work-order pages (base) and the index command's record of the same tree (worktree): each card's order, line, shown cells and links",
      inputs: Object.keys(pages),
      old: (page) =>
        before
          .parseWorkOrderIndex(text(pages[page][0]), pages[page][1])
          .map(({ key, line, values }) => ({
            id: key,
            line,
            cells: Object.fromEntries(
              Object.entries(values).map(([label, value]) => [
                label,
                before.plainText(value),
              ]),
            ),
            links: Object.values(values).flatMap(before.markdownLinks),
          })),
      new: (page) =>
        after
          .readWorkOrderCards(record, page)
          .map(({ id, line, title, fields, links }) => ({
            id,
            line,
            cells: { title, ...fields },
            links,
          })),
      summarize: (a, b) => {
        if (a.startsWith("threw") || b.startsWith("threw"))
          return { old: a.slice(0, 300), new: b.slice(0, 300) };
        const left = JSON.parse(a),
          right = JSON.parse(b);
        const byId = new Map(right.map((card) => [card.id, card]));
        const differing = left.flatMap((card) => {
          const other = byId.get(card.id);
          if (!other) return [{ id: card.id, missing: "new" }];
          const cells = [
            ...new Set([
              ...Object.keys(card.cells),
              ...Object.keys(other.cells),
            ]),
          ]
            .filter((label) => card.cells[label] !== other.cells[label])
            .map((label) => ({
              label,
              old: card.cells[label]?.slice(0, 160),
              new: other.cells[label]?.slice(0, 160),
            }));
          const line = card.line !== other.line;
          const links =
            JSON.stringify(card.links) !== JSON.stringify(other.links)
              ? { old: card.links, new: other.links }
              : undefined;
          return cells.length || line || links
            ? [{ id: card.id, line, cells, links }]
            : [];
        });
        return {
          cards: [left.length, right.length],
          differing: differing.length,
          examples: differing.slice(0, 4),
        };
      },
    };
  },
  "runtime-status-orders": async () => {
    const before = await built(
      "old",
      "packages/skeleton/src/runtime-status-contract.ts",
    );
    const after = await built(
      "now",
      "packages/skeleton/src/runtime-status-contract.ts",
    );
    const record = execFileSync(
      process.execPath,
      [join(root, "scripts/work-orders.mjs"), "index", "--json"],
      { cwd: root, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
    );
    return {
      reads:
        "the generated index page (base) and the index command's record of the same tree (worktree): each active or open order with its phase, dependency state and verdict",
      inputs: ["the worktree"],
      old: () =>
        before.runtimeOrdersFromIndex(text("docs/work-orders/README.md")),
      new: () => after.runtimeOrdersFromIndex(record),
    };
  },
  // plan-continuation's readers of an order's text compare a judged revision
  // with a later one. Their committed corpus is every pair of consecutive
  // committed revisions of each work order (older first), and the newest
  // revision against the worktree's text where that differs. The private
  // readers are exported from copies; the Release-classification spelling
  // admission is read inline in checkPlanContinuation, so both sides run the
  // module's own block, sliced from its text from `const
  // legacyClassification` to the end of its `if`, as a function of the pair.
  "plan-continuation-order-pairs": async () => {
    const { createHash } = await import("node:crypto");
    const end =
      'kind: "release-classification-format",\n        });\n      }\n    }';
    const wrap = (source) => {
      const from = source.indexOf("const legacyClassification");
      const to = source.indexOf(end, from) + end.length;
      if (from < 0 || to < end.length)
        throw new Error("plan-continuation: the classification block moved");
      return `${source}\nconst classificationFormat = (before, given) => {\n  let after = given;\n  const updates = [], path = "", workOrderId = "";\n  ${source.slice(from, to)}\n  let at = 0;\n  while (at < after.length && after[at] === given[at]) at++;\n  return { normalized: updates.length > 0, changedAt: after === given ? -1 : at };\n};\n`;
    };
    const names = [
      "releaseAssignment",
      "executionAppendix",
      "executionAmendmentReleaseSource",
      "withoutAddedWorkstream",
      "classificationFormat",
    ];
    const before = await exposed(
      "old",
      "scripts/lib/plan-continuation.mjs",
      names,
      wrap,
    );
    const after = await exposed(
      "now",
      "scripts/lib/plan-continuation.mjs",
      names,
      wrap,
    );
    // Each order path's committed revisions, newest first.
    const revisions = new Map();
    let commit = null;
    for (const line of git(
      ["log", "--format=C %H", "--name-only", "--", "docs/work-orders"],
      { encoding: "utf8" },
    ).split("\n")) {
      if (line.startsWith("C ")) commit = line.slice(2);
      else if (/^docs\/work-orders\/WO-\d{3}-[^/]+\.md$/u.test(line))
        revisions.set(line, [...(revisions.get(line) ?? []), commit]);
    }
    const texts = new Map();
    const at = (path, rev) => {
      const key = `${rev}:${path}`;
      if (!texts.has(key)) {
        if (texts.size > 64) texts.clear();
        texts.set(
          key,
          rev === "worktree"
            ? existsSync(join(root, path))
              ? text(path)
              : null
            : (() => {
                try {
                  return git(["show", `${rev}:${path}`], {
                    encoding: "utf8",
                    stdio: ["ignore", "pipe", "ignore"],
                  });
                } catch {
                  return null;
                }
              })(),
        );
      }
      return texts.get(key);
    };
    const inputs = [];
    for (const [path, revs] of revisions) {
      const ordered = [...revs].reverse();
      for (let index = 1; index < ordered.length; index++)
        inputs.push(
          `${path} ${ordered[index - 1].slice(0, 12)} ${ordered[index].slice(0, 12)}`,
        );
      inputs.push(`${path} ${ordered.at(-1).slice(0, 12)} worktree`);
    }
    const digest = (value) =>
      typeof value === "string"
        ? createHash("sha256").update(value).digest("hex").slice(0, 16)
        : value;
    const attempt = (read) => {
      try {
        return read();
      } catch (error) {
        return { threw: error.message };
      }
    };
    const read = (reader) => (input) => {
      const [path, from, to] = input.split(" ");
      const older = at(path, from),
        newer = at(path, to);
      if (older === null || newer === null) return "no text at one revision";
      if (older === newer) return "unchanged";
      return {
        assigned: attempt(() => {
          const result = reader.releaseAssignment(older, newer);
          return {
            version: result.version,
            from: result.from ?? null,
            source: digest(result.source),
          };
        }),
        appendix: attempt(() => reader.executionAppendix(older, newer)),
        releaseSource: digest(
          attempt(() => reader.executionAmendmentReleaseSource(newer, older)),
        ),
        withoutWorkstream: digest(
          attempt(() => reader.withoutAddedWorkstream(newer, older)),
        ),
        amendmentSource: digest(
          attempt(() => reader.executionAmendmentSource(newer, older)),
        ),
        classification: attempt(() =>
          reader.classificationFormat(older, newer),
        ),
      };
    };
    return {
      reads:
        "every pair of consecutive committed revisions of each work order, and the newest against the worktree: the release label a later revision assigns, whether its change is only an appended execution record, the amendment-bound source, and the release-classification spelling admission",
      inputs,
      old: read(before),
      new: read(after),
    };
  },
  // Where a disposed criterion's text is replaced: checkPlanContinuation
  // finds it inline after the order's acceptance criteria. Both sides run the
  // module's own statements, sliced from its text, as a function of the order
  // and the criterion; each criterion of each worktree order (as the
  // worktree's plan subject reads them) is located.
  "plan-continuation-criteria": async () => {
    const wrap = (from, to) => (source) => {
      const start = source.indexOf(from);
      const finish = source.indexOf(to, start) + to.length;
      if (start < 0 || finish < to.length)
        throw new Error("plan-continuation: the criterion lookup moved");
      return `${source}\nconst criterionTarget = (after, newCriterion) => {\n  ${source.slice(start, finish)}\n  return target;\n};\n`;
    };
    const before = await exposed(
      "old",
      "scripts/lib/plan-continuation.mjs",
      ["criterionTarget"],
      wrap(
        'const start = after.indexOf("**Acceptance criteria");',
        'requireSamePlan(target >= start, "disposed criterion text not found");',
      ),
    );
    const after = await exposed(
      "now",
      "scripts/lib/plan-continuation.mjs",
      ["criterionTarget"],
      wrap(
        "const { order: current, shift } = readOrder(after);",
        'requireSamePlan(target >= 0, "disposed criterion text not found");',
      ),
    );
    const { parsePlanOrder } = await now("scripts/lib/plan-subject.mjs");
    const criteria = new Map();
    for (const path of tracked("docs/work-orders").filter((path) =>
      /\/WO-\d{3}-[^/]+\.md$/u.test(path),
    ))
      try {
        const id = /\/(WO-\d{3})-/u.exec(path)[1];
        criteria.set(
          path,
          parsePlanOrder(text(path), path, id).criteria.map(({ text }) => text),
        );
      } catch {
        /* an order the plan subject cannot read has no criteria to locate */
      }
    const read = (reader) => (path) =>
      criteria.get(path).map((criterion) => {
        try {
          return reader.criterionTarget(text(path), { text: criterion });
        } catch (error) {
          return `threw: ${error.message}`;
        }
      });
    return {
      reads:
        "every work order's numbered criteria in the worktree: the offset at which a disposed criterion's text is found after the acceptance criteria",
      inputs: [...criteria.keys()],
      old: read(before),
      new: read(after),
    };
  },
  // The headings a moved citation's anchors are resolved against, over every
  // Markdown document a citation can name.
  "plan-continuation-citation-headings": async () => {
    const before = await exposed("old", "scripts/lib/plan-continuation.mjs", [
      "citationHeadings",
    ]);
    const after = await exposed("now", "scripts/lib/plan-continuation.mjs", [
      "citationHeadings",
    ]);
    return {
      reads:
        "every Markdown document under docs/, the root documents and the kit templates: each heading's offset, level, title and anchor as a moved citation resolves it",
      inputs: tracked("docs", "*.md", "scripts/kit").filter((path) =>
        path.endsWith(".md"),
      ),
      old: (path) => before.citationHeadings(text(path)),
      new: (path) => after.citationHeadings(text(path)),
    };
  },
  // Dated capability sections a later capability table appends: every pair
  // of consecutive committed revisions of the table and the newest against
  // the worktree, judged against a subject that holds every order and no
  // known capability (so each section reads as an addition on both sides).
  "plan-continuation-reassessments": async () => {
    const before = await old("scripts/lib/plan-continuation.mjs");
    const after = await now("scripts/lib/plan-continuation.mjs");
    const path = "docs/planning/capability-table.md";
    const revs = git(["log", "--format=%H", "--", path], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .reverse();
    const source = (rev) =>
      rev === "worktree"
        ? text(path)
        : git(["show", `${rev}:${path}`], { encoding: "utf8" });
    const subject = {
      standard: { capabilities: [] },
      orders: tracked("docs/work-orders").flatMap((order) => {
        const id = /\/(WO-\d{3})-[^/]+\.md$/u.exec(order)?.[1];
        return id ? [{ workOrderId: id }] : [];
      }),
    };
    const inputs = [
      ...revs.slice(1).map((rev, index) => `${revs[index]} ${rev}`),
      `${revs.at(-1)} worktree`,
    ];
    const read = (reader) => (input) => {
      const [from, to] = input.split(" ");
      return reader.reassessments(source(from), source(to), subject);
    };
    return {
      reads:
        "every pair of consecutive committed revisions of the capability table, and the newest against the worktree: the dated sections appended, each with its order, date and capability ids",
      inputs,
      old: read(before),
      new: read(after),
    };
  },
  // release.mjs reads an order's authority (title, version, objective and
  // non-goals) and, for release notes, its title after the dash. Both are
  // private; readWorkOrderAuthority and targetReleaseClassification are
  // exported from copies and called as release calls them (the order's path
  // and a revision); workOrderTitleAtHead reads the control log for the
  // order's path first, so its title reading alone runs as each module's own
  // statements, sliced from its text from where it reads the heading to its
  // return, as a function of the order's text. The corpus is every committed
  // revision of every work order and the worktree's text.
  "release-authority": async () => {
    const wrap = (start) => (source) => {
      const from = source.indexOf(start);
      const finish = "return match[1];";
      const to = source.indexOf(finish, from) + finish.length;
      if (from < 0 || to < finish.length)
        throw new Error("release: the release-notes title reading moved");
      return `${source}\nconst notesTitle = (source, workOrderId) => {\n  ${source.slice(from, to)}\n};\n`;
    };
    const names = [
      "readWorkOrderAuthority",
      "targetReleaseClassification",
      "notesTitle",
    ];
    const before = await exposed(
      "old",
      "scripts/release.mjs",
      names,
      wrap('const heading = source.split("\\n", 1)[0];'),
    );
    const after = await exposed(
      "now",
      "scripts/release.mjs",
      names,
      wrap('const heading = readWorkOrder(source).title?.title ?? "";'),
    );
    const inputs = [];
    let commit = null;
    for (const line of git(
      ["log", "--format=C %H", "--name-only", "--", "docs/work-orders"],
      { encoding: "utf8" },
    ).split("\n")) {
      if (line.startsWith("C ")) commit = line.slice(2, 14);
      else if (/^docs\/work-orders\/WO-\d{3}-[^/]+\.md$/u.test(line))
        inputs.push(`${line} ${commit}`);
    }
    for (const path of tracked("docs/work-orders").filter((path) =>
      /\/WO-\d{3}-[^/]+\.md$/u.test(path),
    ))
      inputs.push(`${path} worktree`);
    const attempt = (read) => {
      try {
        return read();
      } catch (error) {
        return { threw: error.message.split("\n")[0] };
      }
    };
    const read = (reader) => (input) => {
      const [path, rev] = input.split(" ");
      const revision = rev === "worktree" ? undefined : rev;
      const workOrderId = /\/(WO-\d{3})-/u.exec(path)[1];
      const state = {
        workOrderId,
        workOrderPath: path,
        repositoryId: "target",
      };
      const source = revision
        ? (() => {
            try {
              return git(["show", `${revision}:${path}`], {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
              });
            } catch {
              return null;
            }
          })()
        : text(path);
      if (source === null) return "deleted at this revision";
      return {
        authority: attempt(() =>
          reader.readWorkOrderAuthority(root, state, revision, {
            versioned: false,
          }),
        ),
        versioned: attempt(
          () => reader.readWorkOrderAuthority(root, state, revision).version,
        ),
        notesTitle: attempt(() => reader.notesTitle(source, workOrderId)),
        targetClassification: attempt(() =>
          reader.targetReleaseClassification(root, state, revision),
        ),
      };
    };
    return {
      reads:
        "every committed revision of every work order and the worktree's: its authority as release reads it (title, version, objective and non-goals), the title its release notes print and the target release classification",
      inputs,
      old: read(before),
      new: read(after),
      summarize: (a, b) => {
        if (!a.startsWith("{") || !b.startsWith("{"))
          return { old: a.slice(0, 200), new: b.slice(0, 200) };
        const left = JSON.parse(a),
          right = JSON.parse(b);
        const parts = {
          title: (side) => side.authority?.title ?? side.authority?.threw,
          objective: (side) => side.authority?.objective,
          nonGoals: (side) => side.authority?.nonGoals,
          versioned: (side) => JSON.stringify(side.versioned),
          notesTitle: (side) => JSON.stringify(side.notesTitle),
          targetClassification: (side) =>
            JSON.stringify(side.targetClassification),
        };
        const differing = {};
        for (const [name, get] of Object.entries(parts)) {
          const x = get(left) ?? "",
            y = get(right) ?? "";
          if (x === y) continue;
          let at = 0;
          while (at < x.length && x[at] === y[at]) at++;
          differing[name] = {
            // The base quoted the heading line, `# ` included; the
            // worktree quotes the title the order reader reads.
            sameOnceMarkerDropped: x.replace(/: # /u, ": ") === y,
            old: x.slice(Math.max(0, at - 40), at + 80),
            new: y.slice(Math.max(0, at - 40), at + 80),
          };
        }
        return { differing };
      },
    };
  },
  "git-surface": async () => {
    const before = await old("scripts/lib/git-surface.mjs");
    const after = await now("scripts/lib/git-surface.mjs");
    const byFile = (found) => {
      const files = new Map();
      for (const { form, file } of found)
        files.set(file, [...(files.get(file) ?? []), form]);
      for (const forms of files.values()) forms.sort();
      return files;
    };
    const was = byFile(before.readGitSurface(root));
    const is = byFile(after.readGitSurface(root));
    return {
      reads:
        "every source under scripts/ and packages/: the Git forms each file names, as a sorted list with repeats",
      inputs: [...new Set([...was.keys(), ...is.keys()])].sort(),
      old: (path) => was.get(path) ?? [],
      new: (path) => is.get(path) ?? [],
      summarize: (a, b) => {
        const left = JSON.parse(a),
          right = JSON.parse(b);
        const count = (list) => {
          const counts = new Map();
          for (const form of list)
            counts.set(form, (counts.get(form) ?? 0) + 1);
          return counts;
        };
        const l = count(left),
          r = count(right);
        const gained = [...r].flatMap(([form, n]) =>
          n > (l.get(form) ?? 0) ? [`${form} x${n - (l.get(form) ?? 0)}`] : [],
        );
        const lost = [...l].flatMap(([form, n]) =>
          n > (r.get(form) ?? 0) ? [`${form} x${n - (r.get(form) ?? 0)}`] : [],
        );
        return { gained, lost };
      },
    };
  },
  "temporary-roots": async () => {
    const before = await old("scripts/lib/temporary-root-declarations.mjs");
    const after = await now("scripts/lib/temporary-root-declarations.mjs");
    return {
      reads: "the whole tree: each temporary-root site no declaration owns",
      inputs: ["the worktree"],
      old: () => before.unownedTemporaryRootSites(root),
      new: () => after.unownedTemporaryRootSites(root),
    };
  },
  // The follow-up register's candidates, document by document. Each reader
  // is run once over a root that holds the committed product and planning
  // documents and the record of moved documents and no decisions file, so
  // what it returns is what it read from Markdown; the decisions it also
  // lists are read by readDecisions, which the decisions comparison holds.
  "followup-sources": async () => {
    const before = await old("scripts/lib/planning-followups.mjs");
    const after = await now("scripts/lib/planning-followups.mjs");
    const { moveIndex } = await now("scripts/lib/document-moves.mjs");
    const copy = documentsRoot(
      "followups",
      ["docs/product", "docs/planning", "docs/control/document-moves.json"],
      (path) => path.endsWith(".md") || path.endsWith(".json"),
    );
    // The documents the reader walks: every Markdown file under the two
    // roots outside an archive or a refutations directory.
    const documents = tracked("docs/product", "docs/planning").filter(
      (path) =>
        path.endsWith(".md") &&
        !path
          .split("/")
          .slice(0, -1)
          .some((part) => part === "archive" || part === "refutations"),
    );
    // A candidate is keyed by the path its document was written at.
    const written = moveIndex(copy).from;
    const keys = new Map(
      documents.map((path) => [
        path,
        `candidate:${written.get(path) ?? path}#`,
      ]),
    );
    const rest = "the rows of no listed document";
    const read = (reader) => {
      let rows;
      return (input) => {
        rows ??= reader.collectFollowupSources(copy);
        return input === rest
          ? rows.filter(
              (row) =>
                ![...keys.values()].some((key) => row.key.startsWith(key)),
            )
          : rows.filter((row) => row.key.startsWith(keys.get(input)));
      };
    };
    return {
      reads:
        "every product and planning document the follow-up register walks: its candidates, each with its identity, its title, its summary and the hash of its text; and, last, any row of no such document",
      inputs: [...documents, rest],
      old: read(before),
      new: read(after),
    };
  },
  // The manifest-free edition's components, which the roadmap's release
  // block shows: each release document as the worktree holds it and as each
  // commit that changed it held it, written under a number in a root of its
  // own, since the reader takes a release's name and reads its file.
  "release-history-components": async () => {
    const { before, after } = await releaseHistory();
    const inputs = tracked("docs/releases")
      .filter((path) => path.endsWith(".md"))
      .flatMap(history);
    const copy = join(scratch, "releases-root");
    mkdirSync(join(copy, "docs/releases"), { recursive: true });
    writeFileSync(join(copy, "dotln.config.json"), '{"version":1}\n');
    inputs.forEach((input, index) =>
      writeFileSync(join(copy, `docs/releases/${index}.md`), inputText(input)),
    );
    const read = (reader) => (input) =>
      reader.historicalComponents(copy, String(inputs.indexOf(input)));
    return {
      reads:
        "every release document under docs/releases, as the worktree holds it and at each commit that changed it: the component packages and versions its table rows name",
      inputs,
      old: read(before),
      new: read(after),
    };
  },
  // The link the roadmap's release block shows for an order: its path and
  // the display title read from the order's own title.
  "release-history-order-titles": async () => {
    const { before, after } = await releaseHistory();
    const id = (path) => /\/(WO-\d{3})-[^/]+$/u.exec(path)[1];
    const read = (reader) => {
      let link;
      return (path) => (link ??= reader.orderLinks(root))(id(path), path);
    };
    return {
      reads:
        "every work order: the link the roadmap's release block writes for it, which carries the display title read from the order's title",
      inputs: orders(),
      old: read(before),
      new: read(after),
    };
  },
  // What the lineage index is rendered from: the ledger's sections, each
  // with its line, its idea entries by line and its lifecycle tags, the
  // counts by status, and every error the reader reports.
  "ledger-entries": async () => {
    const before = await old("scripts/lineage.mjs");
    const after = await now("scripts/lineage.mjs");
    const read = (reader) => (input) => {
      const ledger = reader.inspectLedger(inputText(input));
      return {
        errors: ledger.errors,
        counts: ledger.counts,
        sections: ledger.sections.map((section) => ({
          heading: section.heading,
          line: section.line,
          reference: Boolean(section.reference),
          entries: section.entries.map((entry) => entry.line),
          tags: section.tags,
        })),
      };
    };
    return {
      reads:
        "the idea ledger as the worktree holds it and at each commit that changed it: its sections, each one's idea entries and lifecycle tags, the counts by status and the errors reported",
      inputs: history("docs/lineage/idea-ledger.md"),
      old: read(before),
      new: read(after),
    };
  },
  // The one field the registry's check reads back: each entry's recorded
  // manifest hash, by sibling id. The base compared an entry's whole hash
  // line and reported what followed the line's label.
  "siblings-manifest-hashes": async () => {
    const before = await exposed("old", "scripts/siblings.mjs", [
      "entries",
      "manifestHashLine",
      "MANIFEST_HASH_LINE",
    ]);
    const after = await exposed("new", "scripts/siblings.mjs", [
      "manifestHashes",
    ]);
    return {
      reads:
        "the siblings registry as the worktree holds it and at each commit that changed it: each entry's recorded manifest hash, by sibling id",
      inputs: history("docs/siblings/README.md"),
      old: (input) =>
        [...before.entries(inputText(input))].map(([id, section]) => [
          id,
          before
            .manifestHashLine(section)
            ?.slice(before.MANIFEST_HASH_LINE.length) ?? null,
        ]),
      new: (input) => [...after.manifestHashes(inputText(input))],
    };
  },
  // The capability id of each row of the capability table, by its line,
  // which the history repair compares between two committed revisions. The
  // base asked a pattern of one line at a time, of the lines it split the
  // table into; the pattern is taken from the base's own file.
  "capability-row-ids": async () => {
    const pattern = basePattern(
      "scripts/lib/plan-continuation.mjs",
      "/^\\|\\s*`(",
    );
    const after = await exposed("new", "scripts/lib/plan-continuation.mjs", [
      "capabilityRowIds",
    ]);
    return {
      reads:
        "the capability table as the worktree holds it and at each commit that changed it: the capability id of each table row, by the row's line",
      inputs: history("docs/planning/capability-table.md"),
      old: (input) =>
        inputText(input)
          .trimEnd()
          .split(/\r?\n/u)
          .flatMap((line, index) => {
            const id = line.match(pattern)?.[1];
            return id ? [[index + 1, id]] : [];
          }),
      new: (input) =>
        [...after.capabilityRowIds(inputText(input))].sort(
          (a, b) => a[0] - b[0],
        ),
    };
  },
  // The rows the role-qualification probe quotes from the one committed
  // report its fixture names. The base reads that report from beside its own
  // scripts, so the committed report is put there.
  "qualification-source-rows": async () => {
    const path = "scripts/probes/local-model-role-qualification.mjs";
    const before = await old(path);
    const after = await now(path);
    const named = before.fixture().t1.source;
    mkdirSync(dirname(join(scratch, named)), { recursive: true });
    writeFileSync(join(scratch, named), readFileSync(join(root, named)));
    return {
      reads:
        "the one committed report the role-qualification probe's fixture names: the table rows and the criterion headings the probe quotes from it, with the excerpts beside them",
      inputs: [after.fixture().t1.source],
      old: () => before.t1Input(),
      new: () => after.t1Input(),
    };
  },
  // The retained runtime a permission hook names, which the WO-242 controls
  // probe reads from the hook at the commit its evidence names. The base
  // wrote the pattern inline; it is taken from the base's own file.
  "probe-hook-runtime": async () => {
    const pattern = basePattern(
      "scripts/probes/wo242-controls.mjs",
      '/"snapshot": "(',
    );
    const after = await now("scripts/probes/wo242-controls.mjs");
    const hook = ".claude/hooks/permissions.mjs";
    const named = `${hook}@${JSON.parse(text("docs/evidence/WO-242/controls.json")).baseCommit}`;
    return {
      reads:
        "the permission hook at the commit the WO-242 controls evidence names, as the worktree holds it and at each commit that changed it: the retained runtime it names",
      inputs: [...new Set([named, ...history(hook)])],
      old: (input) => pattern.exec(inputText(input))?.[1],
      new: (input) => after.hookRetainedRuntime(inputText(input)),
    };
  },
  // A test's result row, found by the test's name, in the records the
  // feedback audit writes. The base wrote two tests inline with the name
  // written into them, one of a run's whole output for the failing row and
  // one of each line it kept; the worktree has one reader of a row and
  // compares the name as text. No export reaches either, so each side's
  // expressions are cut from its own file and what runs is that side's
  // bytes. A record holds, for each run, the lines the audit kept: those
  // are the lines the base's own test chose, so this comparison cannot show
  // a row the base dropped, and a run's whole output, which is what the
  // reader is given, is never committed.
  "feedback-tap-rows": async () => {
    const file = "packages/skeleton/src/feedback-audit.ts";
    const cut = (source, opens, closes) => {
      const start = source.indexOf(opens);
      if (start < 0 || source.indexOf(opens, start + 1) >= 0)
        throw new Error(`${file}: expected one expression that opens ${opens}`);
      const end = source.indexOf(closes, start + opens.length);
      if (end < 0) throw new Error(`${file}: no ${closes} after ${opens}`);
      return source.slice(start, end + closes.length);
    };
    const before = readFileSync(join(scratch, file), "utf8");
    const after = text(file);
    const oldFails = new Function(
      "output",
      "name",
      `return ${cut(before, "output.includes(`- ", ")")};`,
    );
    const oldRow = new Function(
      "name",
      "line",
      `return ${cut(before, "new RegExp(`^(?:not )?ok", ".test(line)")};`,
    );
    const tapResult = new Function(
      `${stripTypeScriptTypes(cut(after, "const tapResult = (", "\n};\n"), { mode: "strip" })}\nreturn tapResult;`,
    )();
    const newFails = new Function(
      "tapResult",
      "lines",
      "name",
      `return ${cut(after, "lines.some((line) => {", "\n        })")};`,
    );
    const newRow = new Function(
      "tapResult",
      "name",
      "line",
      `return ${cut(after, "tapResult(line)?.name ===", " name")};`,
    );
    // Each run a record holds, with the test's name as its command names it.
    const runs = (record) => {
      const found = [];
      const walk = (value) => {
        if (Array.isArray(value)) value.forEach(walk);
        else if (value && typeof value === "object") {
          if (
            typeof value.command === "string" &&
            Array.isArray(value.captured)
          )
            found.push({
              mechanism: value.mechanism ?? null,
              name:
                /--test-name-pattern=\^(.*)\$ \S+$/u.exec(value.command)?.[1] ??
                null,
              captured: value.captured,
            });
          Object.values(value).forEach(walk);
        }
      };
      walk(record);
      return found;
    };
    const read = (row, fails) => (path) =>
      runs(JSON.parse(text(path))).map(({ mechanism, name, captured }) => [
        mechanism,
        name,
        name === null ? null : captured.filter((line) => row(name, line)),
        name === null || mechanism !== "removed" ? null : fails(captured, name),
      ]);
    return {
      reads:
        "every record the feedback audit has written: for each test run it holds, the kept lines that are the named test's result row and, for a run with the mechanism removed, whether a failing row of that name is among them",
      inputs: tracked("docs/evidence").filter((path) =>
        /(?:^|\/)feedback\.json$/u.test(path),
      ),
      old: read(
        (name, line) => oldRow(name, line),
        (captured, name) => oldFails(captured.join("\n"), name),
      ),
      new: read(
        (name, line) => newRow(tapResult, name, line),
        (captured, name) => newFails(tapResult, captured, name),
      ),
    };
  },
  // Added in the repair of FINAL-001 (finding F7): six readers that moved
  // onto the shared readers and that no comparison above held.
  //
  // The Front page field of an order's leading header: the base took the
  // line that opens with the label from the header lines its dependency
  // reader cut, and the worktree reads the header's field.
  "front-page-declarations": async () => {
    const before = await old("scripts/lib/front-page-scope.mjs");
    const after = await now("scripts/lib/front-page-scope.mjs");
    return {
      reads:
        "every work order as the worktree holds it and as each commit that changed it held it: the Front page field its leading header declares, or the refusal of a duplicate or malformed one",
      inputs: orders().flatMap(history),
      old: (input) => before.frontPageDeclaration(inputText(input), input),
      new: (input) => after.frontPageDeclaration(inputText(input), input),
    };
  },
  // The note `worktree integrate` writes into an order's decisions file for
  // the checkpoint it integrated. Release preparation asks whether it stands
  // there before it retimes an order, and the integration module asks the
  // same of the same file, with the same string at the base and the same
  // call of the shared reader now: the base found the comment's text
  // anywhere in the file, and the worktree finds it among the comments the
  // parser reads. Each note a decisions file holds, by either reading, and a
  // checkpoint it holds none for.
  "integration-notes": async () => {
    const before = await old("scripts/lib/release-preparation.mjs");
    const after = await now("scripts/lib/release-preparation.mjs");
    const { markdownComments } = await now("scripts/lib/markdown-links.mjs");
    const copy = decisionsRoot();
    const inputs = [];
    for (const path of tracked("docs/evidence").filter((path) =>
      /^docs\/evidence\/WO-\d{3}\/decisions\.md$/u.test(path),
    )) {
      const source = text(path);
      const checkpoints = new Set(["refs/dotln/checkpoint/none/0"]);
      for (const match of source.matchAll(/<!-- integration (\S+) -->/gu))
        checkpoints.add(match[1]);
      for (const { text: comment } of markdownComments(source))
        if (comment.startsWith("integration "))
          checkpoints.add(comment.slice("integration ".length));
      for (const checkpoint of checkpoints)
        inputs.push(`${path.split("/")[2]} ${checkpoint}`);
    }
    const read = (reader) => (input) => {
      const [workOrderId, checkpointRef] = input.split(" ");
      return reader.integrationPreparationRefusal(copy, workOrderId, {
        checkpointRef,
      });
    };
    return {
      reads:
        "every order's decisions file, for each checkpoint whose integration note it holds by either reading and for one it holds none for: whether release preparation finds the note and refuses to retime the order",
      inputs,
      old: read(before),
      new: read(after),
    };
  },
  // A mixed projection sets aside the generated block of the root
  // instruction file and the release block of the front page before a
  // three-way merge, and writes the front page's version back after it. The
  // base did both with patterns over the whole file; the worktree with the
  // shared marker-block reader. Each revision of the two files, masked, and
  // the front page's restored after its mask.
  "mixed-projection-masks": async () => {
    const path = "scripts/lib/worktree-integration.mjs";
    const before = await exposed("old", path, ["mixedProjectionMask"]);
    const after = await exposed("now", path, [
      "mixedProjectionMask",
      "restoreReleaseVersion",
    ]);
    // The base wrote the restore inline after the merge, with the block's
    // pattern its mask also used.
    const block = basePattern(path, "/<!-- DOTLN-RELEASE-BEGIN -->");
    const restoreBefore = (contents, version) =>
      contents.replace(block, (found) => found.replace("v0.0.0", version));
    const read = (mask, restore) => (input) => {
      const file = input.split("@")[0];
      const masked = mask(root, file)(inputText(input));
      return file === "README.md"
        ? [digest(masked), digest(restore(masked, "v9.9.9"))]
        : [digest(masked)];
    };
    return {
      reads:
        "every committed revision of the root instruction file and of the front page, and the worktree's: each as a mixed projection's mask leaves it, and the front page as the merge's restore then writes its version back, as digests",
      inputs: [...history("CLAUDE.md"), ...history("README.md")],
      old: read(before.mixedProjectionMask, restoreBefore),
      new: read(after.mixedProjectionMask, after.restoreReleaseVersion),
    };
  },
  // The links a publication page makes into the product documents, by file
  // and anchor: the base matched a link's text with a pattern, and the
  // worktree reads the parser's links and tests each destination.
  "publication-product-links": async () => {
    const path = "scripts/check-publication.mjs";
    const before = await exposed(
      "old",
      path,
      ["productLinks"],
      cutPublicationCli,
    );
    const after = await exposed(
      "now",
      path,
      ["productLinks"],
      cutPublicationCli,
    );
    return {
      reads:
        "every Markdown page under the publication root, as the worktree holds it and as each commit that changed it held it: the links it makes into the product documents, by file and anchor",
      inputs: tracked("docs/publication")
        .filter((path) => path.endsWith(".md"))
        .flatMap(history),
      old: (input) => before.productLinks(inputText(input)),
      new: (input) => after.productLinks(inputText(input)),
    };
  },
  // The section of the dual-voice sample under each voice's heading, whose
  // product links the check compares: the base searched for the heading's
  // text and the next second-level heading, and the worktree reads the
  // section the parser gives.
  "publication-voice-sections": async () => {
    const path = "scripts/check-publication.mjs";
    const before = await exposed(
      "old",
      path,
      ["voiceSection"],
      cutPublicationCli,
    );
    const after = await exposed(
      "now",
      path,
      ["voiceSection"],
      cutPublicationCli,
    );
    const voices = ["Everyday AI-user voice", "Software-engineer voice"];
    const read = (reader) => (input) =>
      voices.map((voice) => reader.voiceSection(inputText(input), voice));
    return {
      reads:
        "the dual-voice sample, as the worktree holds it and as each commit that changed it held it: the section under each of the two voices' headings",
      inputs: history("docs/publication/dual-voice-sample.md"),
      old: read(before),
      new: read(after),
    };
  },
  // The standalone dependencies block that the dependency migration takes
  // out of an order once its relations are transcribed: the base removed it
  // with a pattern and the worktree with the shared marker-block reader.
  "dependency-migration-blocks": async () => {
    const path = "scripts/lib/plan-dependency-migration.mjs";
    const block = basePattern(path, "/\\n<!-- dotln-dependencies:start -->");
    const after = await exposed("now", path, ["withoutStandaloneBlock"]);
    const read = (remove) => (input) => {
      const source = text(input);
      const left = remove(source);
      return [digest(left), source.length - left.length];
    };
    return {
      reads:
        "every work order: its text once the standalone dependencies block is taken out, as a digest, with the count of characters taken",
      inputs: orders(),
      old: read((source) => source.replace(block, "")),
      new: read(after.withoutStandaloneBlock),
    };
  },
  // Four more readers of a marker comment that moved, found when the
  // inventory's screen was run again with that form (inventory-marker-
  // comments.json). Three are read inline in a longer step, so each side's
  // reading is made as its source makes it: the base's pattern taken from
  // the base's file, or the string it tested, and the worktree's call of the
  // shared reader.
  //
  // The origin comment of the installed executor root, whose support ids
  // the authority evidence extends.
  "executor-origin-comments": async () => {
    const { markdownComments } = await now("scripts/lib/markdown-links.mjs");
    const origin = basePattern(
      "scripts/authority-evidence.mjs",
      "/<!-- Origin: (",
    );
    const parsed = (raw) => (raw === undefined ? null : JSON.parse(raw));
    return {
      reads:
        "every revision of the two installed executor roots, and the worktree's: the origin record its comment holds",
      inputs: [
        ...history(".claude/skills/dotln-executor/SKILL.md"),
        ...history(".agents/skills/dotln-executor/SKILL.md"),
      ],
      old: (input) => parsed(origin.exec(inputText(input))?.[1]),
      new: (input) =>
        parsed(
          markdownComments(inputText(input))
            .find(({ text }) => text.startsWith("Origin: {"))
            ?.text.slice("Origin: ".length),
        ),
    };
  },
  // Whether the root instruction file holds the harness's generated block,
  // which the context measurement replaces with the installation's.
  "harness-instruction-blocks": async () => {
    const { markdownMarkerBlocks } = await now(
      "scripts/lib/markdown-links.mjs",
    );
    return {
      reads:
        "every committed revision of the root instruction file, and the worktree's: whether it holds the harness's generated block",
      inputs: history("CLAUDE.md"),
      old: (input) => inputText(input).includes("<!-- dotln-harness:start -->"),
      new: (input) =>
        markdownMarkerBlocks(
          inputText(input),
          "dotln-harness:start",
          "dotln-harness:end",
        ).length > 0,
    };
  },
  // The link destinations a filed record's reader can follow: its Markdown
  // links and the href and src of its raw HTML, comments left out, which the
  // base did with a pattern of its own and the worktree with the shared
  // module's.
  "record-link-targets": async () => {
    const before = await old("scripts/lib/target-records.mjs");
    const after = await now("scripts/lib/target-records.mjs");
    return {
      reads:
        "every Markdown document under docs/: the link destinations a filed record's reader can follow",
      inputs: tracked("docs").filter((path) => path.endsWith(".md")),
      old: (path) => before.recordLinkTargets(text(path)),
      new: (path) => after.recordLinkTargets(text(path)),
    };
  },
  // The order publish puts the product gate's block into the pull-request
  // body it stores: in place of the block the body holds, or after the body.
  "product-gate-blocks": async () => {
    const { markdownMarkerBlocks } = await now(
      "scripts/lib/markdown-links.mjs",
    );
    const block = basePattern(
      "scripts/worktree.mjs",
      "/<!-- dotln-product-gate:start -->",
    );
    const gate =
      "<!-- dotln-product-gate:start -->\nthe gate's rows\n<!-- dotln-product-gate:end -->";
    return {
      reads:
        "every pull-request body the repository keeps, with the publication example's: the body the order publish composes from it, as a digest",
      inputs: tracked("docs").filter(
        (path) =>
          /^docs\/final-reviews\/WO-\d{3}\/PR\.md$/u.test(path) ||
          path === "docs/evidence/WO-188/wo199-pr-body.md" ||
          path === "docs/publication/examples/prBody/record.md",
      ),
      old: (path) => {
        const body = text(path);
        return digest(
          body.includes("<!-- dotln-product-gate:start -->")
            ? body.replace(block, gate)
            : `${body.trimEnd()}\n\n${gate}\n`,
        );
      },
      new: (path) => {
        const body = text(path);
        const [found] = markdownMarkerBlocks(
          body,
          "dotln-product-gate:start",
          "dotln-product-gate:end",
        );
        return digest(
          found
            ? `${body.slice(0, found.start)}${gate}${body.slice(found.end)}`
            : `${body.trimEnd()}\n\n${gate}\n`,
        );
      },
    };
  },
};

const NAMED = JSON.parse(
  readFileSync(join(here, "named-differences.json"), "utf8"),
);
// A class the table names for every input of a comparison ("*") is held to
// a test of its own, evaluated for every difference of that comparison: a
// difference the test does not pass is unnamed, so a difference of another
// kind fails the run there as it does in a comparison named input by input.
// Each test takes the two answers as the comparison serialized them.
const parsed = (answer) => {
  try {
    return JSON.parse(answer);
  } catch {
    return undefined;
  }
};
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const WHOLE_CLASS = {
  // Both refuse; the base's message quoted the heading line with its
  // marker, and the worktree's quotes the title.
  "release-authority": (a, b) =>
    a.replaceAll(": # ", ": ") === b.replaceAll(": # ", ": "),
  "console-roadmap-rungs": (a, b) =>
    a.startsWith("threw: roadmap heading changed") &&
    b.startsWith("threw: expected a document titled"),
  // The base's shown text kept the underscores of an emphasis.
  // (Each row also carries its cell as written, underscores and all, on both
  // sides, so the marks are set aside on both.)
  "console-publication": (a, b) => {
    const plain = (answer) => answer.replace(/_([^_"]+)_/gu, "$1");
    return plain(a) === plain(b);
  },
  // The base showed a character reference as the page wrote it: a numeric
  // one, and the three named ones the pages write for an angle bracket and
  // an ampersand. An ampersand is decoded last, so a reference the page
  // escaped twice is decoded once.
  "console-work-order-cards": (a, b) => {
    const decoded = (value) =>
      typeof value === "string"
        ? value
            .replace(/&#(\d+);/gu, (_, code) =>
              String.fromCodePoint(Number(code)),
            )
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll("&amp;", "&")
        : Array.isArray(value)
          ? value.map(decoded)
          : value && typeof value === "object"
            ? Object.fromEntries(
                Object.entries(value).map(([key, item]) => [
                  key,
                  decoded(item),
                ]),
              )
            : value;
    const left = parsed(a);
    return left !== undefined && JSON.stringify(decoded(left)) === b;
  },
  // The words the matcher reads, each with its source span, are the same;
  // only white space the page does not show differs.
  "outward-rendered-view": (a, b) => {
    const words = (side) => {
      const spans = side.spans.split(" ");
      return [...side.folded.matchAll(/[\p{L}\p{N}]+/gu)]
        .map(
          (match) =>
            `${match[0]}@${spans[match.index].split("-")[0]}-${spans[match.index + match[0].length - 1].split("-")[1]}`,
        )
        .join(" ");
    };
    const left = parsed(a),
      right = parsed(b);
    return Boolean(
      left?.folded && right?.folded && words(left) === words(right),
    );
  },
  // The worktree reads every decision the base read, each the same, and
  // more: the ones the base's pattern cut short. The capsule carries a
  // window of the newest decisions, so in a file longer than the window the
  // decisions gained push as many of the oldest out of it: what the
  // worktree lacks is then the first of what the base gave, and no more of
  // them than it gained.
  "mission-decisions": (a, b) => {
    const left = parsed(a),
      right = parsed(b);
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    const lacks = (rows) => (row) => !rows.some((other) => same(row, other));
    const lost = left.filter(lacks(right));
    const gained = right.filter(lacks(left));
    return (
      gained.length > 0 &&
      lost.length <= gained.length &&
      lost.every((row, index) => same(row, left[index]))
    );
  },
  // The exclusions are the same, and each thesis is the same but for white
  // space at its ends.
  "mission-vision": (a, b) => {
    const left = parsed(a),
      right = parsed(b);
    if (!left || !right || !same(left.exclusions, right.exclusions))
      return false;
    if (!Array.isArray(left.theses) || !Array.isArray(right.theses))
      return same(left.theses, right.theses);
    return (
      left.theses.length === right.theses.length &&
      left.theses.every((thesis, index) => {
        const other = right.theses[index];
        return (
          thesis.id === other.id &&
          thesis.title === other.title &&
          thesis.text.trim() === other.text.trim()
        );
      })
    );
  },
  // The worktree reads every id the base read, at the same line, and more:
  // each row gained is one whose first cell holds text before its code span,
  // which the base's pattern, anchored at the cell's start, could not match.
  "capability-row-ids": (a, b, input) => {
    const left = parsed(a),
      right = parsed(b);
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    const lines = inputText(input).split(/\r?\n/u);
    const gained = right.filter(
      (row) => !left.some((other) => same(row, other)),
    );
    return (
      gained.length > 0 &&
      left.every((row) => right.some((other) => same(row, other))) &&
      gained.every(([line, id]) => {
        const cell = lines[line - 1]?.split("|")[1] ?? "";
        return cell.includes(`\`${id}\``) && !cell.trimStart().startsWith("`");
      })
    );
  },
};
for (const name of Object.keys(NAMED))
  if (NAMED[name]["*"] && !WHOLE_CLASS[name])
    throw new Error(
      `${name}: a class named for every input needs a test of the class`,
    );
let unnamed = 0;
for (const name of names.length ? names : Object.keys(COMPARISONS)) {
  const comparison = await COMPARISONS[name]();
  const result = {
    comparison: name,
    base: commit,
    reads: comparison.reads,
    read: comparison.inputs.length,
    equal: 0,
    differences: {},
    examples: [],
  };
  for (const input of comparison.inputs) {
    const a = answer(() => comparison.old(input));
    const b = answer(() => comparison.new(input));
    if (a === b) {
      result.equal++;
      continue;
    }
    const named =
      NAMED[name]?.[input] ??
      (NAMED[name]?.["*"] && WHOLE_CLASS[name](a, b, input)
        ? NAMED[name]["*"]
        : "unnamed");
    if (named === "unnamed") {
      unnamed++;
      // Where the two answers first part, for whoever must name the class.
      if (process.env.SHOW) {
        let at = 0;
        while (at < a.length && a[at] === b[at]) at++;
        console.error(
          `${name} ${input}: unnamed at ${at}\n  old ${JSON.stringify(a.slice(Math.max(0, at - 80), at + 120))}\n  new ${JSON.stringify(b.slice(Math.max(0, at - 80), at + 120))}`,
        );
      }
    }
    result.differences[named] = (result.differences[named] ?? 0) + 1;
    if (
      result.examples.filter((row) => row.named === named).length <
      (Number(process.env.EXAMPLES) || 6)
    )
      result.examples.push({
        input,
        named,
        ...(comparison.summarize
          ? comparison.summarize(a, b)
          : { old: a.slice(0, 400), new: b.slice(0, 400) }),
      });
  }
  const output = `${JSON.stringify(result, null, 2)}\n`;
  if (args.includes("--write"))
    writeFileSync(join(here, `${name}.json`), output);
  console.log(
    `${name}: read ${result.read}, equal ${result.equal}, different ${JSON.stringify(result.differences)}`,
  );
  if (!args.includes("--write") || process.env.SHOW)
    for (const example of result.examples)
      console.log(JSON.stringify(example).slice(0, 900));
}
if (unnamed) {
  console.error(`${unnamed} difference(s) the table names no class for`);
  process.exitCode = 1;
}
