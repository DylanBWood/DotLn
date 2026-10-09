import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { projectBoard } from "../src/board.js";
import { collectSources } from "../src/collect.js";
import type { BoardSources } from "../src/types.js";
import { array, available, object, string } from "../src/values.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const { installBeaconFixture } = (await import(
  pathToFileURL(join(root, "scripts/test-beacon-fixture.mjs")).href
)) as { installBeaconFixture: (root: string) => void };
const realGit = execFileSync("sh", ["-c", "command -v git"], {
  encoding: "utf8",
}).trim();
const cache = "docs/control/local/cache/release-list.json";
// One range selection per tag and one tree per unique historical view.
// Tag objects, control blobs and note diffs each use bounded batches.
const gitPerNewTag = 2;
const batchGit = 4; // tag batch, control batch, note batch, boundary view
// Every warm collection, whatever the order and tag counts: the branch, the
// release set dependency edges read once, the worktree list, and the
// listing's tags, ignore check and history view.
const warmGit = [
  "cat-file",
  "check-ignore",
  "for-each-ref",
  "for-each-ref",
  "rev-parse",
  "symbolic-ref",
  "tag",
  "worktree",
];

test("WO-164 console collection spawns a constant number of processes and Git reads only new or moved tags", async (t) => {
  const base = mkdtempSync(join(tmpdir(), "dotln-collect-"));
  const repo = join(base, "repo");
  const gitLog = join(base, "git.log");
  const nodeLog = join(base, "node.log");
  const saved = {
    PATH: process.env["PATH"],
    NODE_OPTIONS: process.env["NODE_OPTIONS"],
    DOTLN_LAUNCHPAD: process.env["DOTLN_LAUNCHPAD"],
  };
  const git = (...args: string[]) =>
    execFileSync(
      realGit,
      [
        "-C",
        repo,
        ...[
          "user.name=Fixture",
          "user.email=fixture@example.invalid",
          "commit.gpgSign=false",
          "tag.gpgSign=false",
          "core.hooksPath=/dev/null",
        ].flatMap((setting) => ["-c", setting]),
        ...args,
      ],
      { encoding: "utf8" },
    ).trim();
  const write = (path: string, text: string) => {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), text);
  };
  const activation = (id: string) =>
    `${JSON.stringify({ schemaVersion: 1, type: "WorkOrderActivated", workOrderId: id, workOrderPath: `docs/work-orders/${id}-fixture.md` })}\n`;
  // Every release order carries a release edge, so the status fold reads the
  // release set; reading it per order would grow with the orders.
  const order = (id: string, edge = true) =>
    write(
      `docs/work-orders/${id}-fixture.md`,
      `# ${id} — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n${edge ? `\n<!-- dotln-dependencies:start -->\n${JSON.stringify([{ workOrderId: "WO-900", relation: "satisfied-by-release", release: "v0.1.1", reason: "fixture release edge" }])}\n<!-- dotln-dependencies:end -->\n` : ""}\n**Objective:** fixture.\n`,
    );
  const tagRelease = (tag: string, manifest?: unknown, target?: string) => {
    const message = join(base, `${tag}.message`);
    writeFileSync(
      message,
      `DotLn ${tag} — fixture\n\nBody.${manifest === undefined ? "" : `\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest)}\nDOTLN-MANIFEST-END`}\n`,
    );
    git(
      "tag",
      ...(target ? ["-f"] : []),
      "-a",
      tag,
      "-F",
      message,
      ...(target ? [target] : []),
    );
  };
  // One first-parent commit per release: an order segment and its notes.
  const release = (index: number, manifest?: unknown) => {
    const id = `WO-${910 + index}`;
    order(id);
    write(`docs/control/orders/${id}.jsonl`, activation(id));
    write(`docs/final-reviews/${id}/RELEASE-NOTES.md`, `# ${id}\n`);
    git("add", "-A");
    git("commit", "-q", "-m", `${id} merged`);
    tagRelease(`v0.1.${index}`, manifest);
  };
  const lines = (path: string) =>
    readFileSync(path, "utf8").split("\n").filter(Boolean);
  const census = async () => {
    writeFileSync(gitLog, "");
    writeFileSync(nodeLog, "");
    const sources = await collectSources(repo);
    const gits = lines(gitLog);
    return {
      sources,
      node: lines(nodeLog),
      git: gits,
      subcommands: gits
        .map((line) => {
          const words = line.split(" ");
          return words[0] === "-C" ? words[2]! : words[0]!;
        })
        .sort(),
    };
  };
  const releases = (sources: BoardSources) => {
    if (sources.releases?.status !== "available")
      assert.fail(
        `release list unavailable: ${JSON.stringify(sources.releases)}`,
      );
    return sources.releases.value;
  };
  const listCold = () => {
    rmSync(join(repo, cache), { force: true });
    return execFileSync(
      process.execPath,
      [join(repo, "scripts/release.mjs"), "list"],
      { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  };
  const row = (tag: string, application: string, orders: string) =>
    new RegExp(
      `^${tag.replaceAll(".", "\\.")}\\t[0-9a-f]{40,64}\\t${application}\\t${orders}$`,
      "mu",
    );
  try {
    mkdirSync(repo);
    cpSync(join(root, "scripts"), join(repo, "scripts"), { recursive: true });
    installBeaconFixture(repo);
    git("init", "-q", "-b", "main");
    // Only documents are history; the copied scripts and packages are tools.
    write(".gitignore", "docs/control/local/\nscripts/\npackages/\n");
    order("WO-900", false);
    write("docs/control/resume.jsonl", activation("WO-900"));
    git("add", "-A");
    git("commit", "-q", "-m", "fixture");
    for (let index = 1; index <= 4; index += 1)
      release(
        index,
        index % 2 === 0
          ? {
              release: {
                application: `v0.1.${index}`,
                previousRelease: `v0.1.${index - 1}`,
              },
            }
          : undefined,
      );
    // Neither is a DotLn release: a foreign annotation and a lightweight tag.
    writeFileSync(join(base, "foreign"), "Not a release\n");
    git("tag", "-a", "v9.0.0", "-F", join(base, "foreign"));
    git("tag", "v8.0.0");

    mkdirSync(join(base, "bin"));
    writeFileSync(
      join(base, "bin", "git"),
      `#!/bin/sh\nprintf '%s\\n' "$*" >> '${gitLog}'\nexec '${realGit}' "$@"\n`,
      { mode: 0o755 },
    );
    writeFileSync(
      join(base, "node-census.mjs"),
      `import { appendFileSync } from "node:fs";\nappendFileSync(${JSON.stringify(nodeLog)}, process.argv.slice(1, 3).join(" ") + "\\n");\n`,
    );
    process.env["PATH"] = `${join(base, "bin")}:${saved.PATH ?? ""}`;
    process.env["NODE_OPTIONS"] =
      `${saved.NODE_OPTIONS ?? ""} --import=${pathToFileURL(join(base, "node-census.mjs")).href}`.trim();
    process.env["DOTLN_LAUNCHPAD"] = repo;

    const cold = await census();
    assert.equal(cold.node.length, 4, cold.node.join("\n"));
    assert.ok(
      cold.git.length <= warmGit.length + gitPerNewTag * 4 + batchGit,
      `cold collection starts ${cold.git.length} Git processes:\n${cold.git.join("\n")}`,
    );
    const warm = await census();
    assert.equal(warm.node.length, 4, warm.node.join("\n"));
    assert.deepEqual(warm.subcommands, warmGit, warm.git.join("\n"));
    assert.equal(releases(warm.sources), releases(cold.sources));
    assert.equal(git("status", "--porcelain"), "");

    // Double the orders and the releases.
    for (let index = 5; index <= 8; index += 1) release(index);
    const grown = await census();
    assert.equal(grown.node.length, 4, grown.node.join("\n"));
    assert.ok(grown.git.length > warm.git.length);
    assert.ok(
      grown.git.length - warm.git.length <= gitPerNewTag * 4 + batchGit,
      `four new tags cost ${grown.git.length - warm.git.length} Git spawns:\n${grown.git.join("\n")}`,
    );
    const steady = await census();
    assert.equal(steady.node.length, 4, steady.node.join("\n"));
    assert.deepEqual(steady.subcommands, warmGit, steady.git.join("\n"));
    t.diagnostic(
      `node/Git spawns: cold 5 orders 4 tags ${cold.node.length}/${cold.git.length}; warm ${warm.node.length}/${warm.git.length}; four new tags ${grown.node.length}/${grown.git.length}; warm 9 orders 8 tags ${steady.node.length}/${steady.git.length}`,
    );
    const statuses = steady.sources.controlStatus;
    if (statuses?.status !== "available")
      assert.fail(`status unavailable: ${JSON.stringify(statuses)}`);
    const ids = [
      "WO-900",
      ...[1, 2, 3, 4, 5, 6, 7, 8].map((index) => `WO-${910 + index}`),
    ];
    assert.deepEqual(
      statuses.value.map((status) => string(object(status)["workOrder"])),
      ids,
    );
    const listed = releases(steady.sources);
    assert.equal(
      listed.split("\n")[0],
      "TAG\tCOMMIT\tAPPLICATION\tWORK ORDERS",
    );
    assert.equal(listed.trimEnd().split("\n").length, 9);
    for (let index = 1; index <= 8; index += 1)
      assert.match(
        listed,
        row(`v0.1.${index}`, `v0.1.${index}`, `WO-${910 + index}`),
      );

    // One status process per order and an uncached listing, against the
    // batched fold and the cached listing. The listing code before this order
    // is compared on the real tree (WO-164 decisions).
    const perOrder = ids.map(
      (id) =>
        JSON.parse(
          execFileSync(
            process.execPath,
            [
              join(repo, "scripts/resume.mjs"),
              "status",
              "--json",
              "--work-order",
              id,
            ],
            { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
          ),
        ) as unknown,
    );
    assert.deepEqual(statuses.value, perOrder);
    assert.equal(
      object(array(object(object(perOrder[1])["dependencies"])["entries"])[0])[
        "state"
      ],
      "met",
      "the shared release set meets a release edge",
    );
    assert.equal(
      JSON.stringify(
        projectBoard({
          ...steady.sources,
          controlStatus: available("resume:status--json", perOrder),
          releases: available("release:list", listCold()),
        }),
      ),
      JSON.stringify(projectBoard(steady.sources)),
    );

    // A failed fold falls back to one process per order, and the source's
    // ref records that it did (planning receipt 028).
    const resumeModule = join(repo, "scripts/resume.mjs");
    const resumeSource = readFileSync(resumeModule, "utf8");
    const failingFold = resumeSource.replace(
      'const allOrders = action === "status" && args.includes("--all");',
      'if (args.includes("--all")) throw new Error("fixture fold failure");\n  const allOrders = false;',
    );
    assert.notEqual(failingFold, resumeSource);
    writeFileSync(resumeModule, failingFold);
    const fellBack = await census();
    writeFileSync(resumeModule, resumeSource);
    assert.equal(
      fellBack.node.length,
      4 + ids.length,
      fellBack.node.join("\n"),
    );
    const fallback = fellBack.sources.controlStatus;
    if (fallback?.status !== "available")
      assert.fail(`status unavailable: ${JSON.stringify(fallback)}`);
    assert.equal(fallback.ref, "resume:status--json#per-order-fallback");
    assert.deepEqual(fallback.value, perOrder);
    assert.deepEqual(
      projectBoard(fellBack.sources).sources.find(({ ref }) =>
        ref.startsWith("resume:status--json"),
      ),
      {
        ref: "resume:status--json#per-order-fallback",
        status: "available",
        explanation: null,
      },
    );

    // A tag moved to another commit is read again, and so is the range of
    // the release that names it as previous.
    const settled = await census();
    tagRelease(
      "v0.1.3",
      { release: { application: "moved" }, workOrder: { id: "WO-913" } },
      git("rev-parse", "v0.1.2^{commit}"),
    );
    const moved = await census();
    assert.ok(moved.git.length > settled.git.length);
    const afterMove = releases(moved.sources);
    assert.match(afterMove, row("v0.1.3", "moved", "WO-913"));
    assert.match(afterMove, row("v0.1.4", "v0.1.4", "WO-913,WO-914"));
    assert.equal(afterMove, listCold());

    // Unreadable records are derived afresh; a code change retires records.
    writeFileSync(join(repo, cache), "{");
    const repaired = await census();
    assert.equal(releases(repaired.sources), afterMove);
    assert.equal(
      (
        JSON.parse(readFileSync(join(repo, cache), "utf8")) as {
          schemaVersion: number;
        }
      ).schemaVersion,
      1,
    );
    assert.deepEqual((await census()).subcommands, warmGit);
    appendFileSync(join(repo, "scripts/lib/release-tags.mjs"), "// edited\n");
    const edited = await census();
    assert.ok(edited.subcommands.includes("rev-list"), "records retired");
    assert.equal(releases(edited.sources), afterMove);

    // A replace ref changes what history means: records are neither read nor
    // written until it is gone.
    const records = readFileSync(join(repo, cache), "utf8");
    const sixth = git("rev-parse", "v0.1.6^{commit}");
    git("replace", "--graft", sixth, git("rev-parse", "v0.1.4^{commit}"));
    const grafted = await census();
    assert.match(
      releases(grafted.sources),
      row("v0.1.6", "v0.1.6", "WO-915,WO-916"),
    );
    assert.equal(readFileSync(join(repo, cache), "utf8"), records);
    git("replace", "-d", sixth);
    const restored = await census();
    assert.deepEqual(restored.subcommands, warmGit);
    assert.equal(releases(restored.sources), afterMove);

    // Multiple commits per release, a side-parent tag excluded from the
    // range, and NUL-framed paths. A merge is compared with its first parent.
    git("checkout", "-q", "-b", "side");
    write("docs/final-reviews/WO-980/RELEASE-NOTES.md", "Side notes\n");
    git("add", "-A");
    git("commit", "-q", "-m", "side notes");
    git("tag", "side-boundary");
    git("checkout", "-q", "main");
    for (let index = 0; index < 18; index += 1) {
      write("unrelated.txt", `${index}\n`);
      git("add", "-A");
      git("commit", "-q", "-m", "unrelated change");
    }
    write("docs/final-reviews/WO-979/RELEASE-NOTES.md", "Main notes\n");
    write("docs/final-reviews/odd\n\tünicode.md", "Not release membership\n");
    git("add", "-A");
    git("commit", "-q", "-m", "main notes");
    git("merge", "-q", "--no-ff", "side", "-m", "merge side notes");
    tagRelease("v0.1.9", { release: { previousRelease: "side-boundary" } });
    const many = await census();
    assert.match(
      releases(many.sources),
      row("v0.1.9", "v0.1.9", "WO-979,WO-980"),
    );
    assert.equal(many.node.length, 4);
    assert.ok(
      many.git.length <= warmGit.length + 21 + 1 + 5,
      `one new tag over 20 commits starts ${many.git.length} Git processes`,
    );
    assert.equal(releases(many.sources), listCold());

    // Optional aggregate reads must not reject a history that fits the
    // individual reads. Inject failures in the fixture's Git adapters.
    const gitModule = join(repo, "scripts/lib/git.mjs");
    const gitSource = readFileSync(gitModule, "utf8");
    const controlModule = join(repo, "scripts/lib/control-store.mjs");
    const controlSource = readFileSync(controlModule, "utf8");
    writeFileSync(
      controlModule,
      controlSource.replace(
        "export const readControls = (root, revisions) => {",
        'export const readControls = (root, revisions) => { if (revisions.length > 1) throw new Error("fixture aggregate control overflow");',
      ),
    );
    writeFileSync(
      gitModule,
      gitSource.replace(
        "export const runGitPathList = (cwd, args, options = {}) => {",
        'export const runGitPathList = (cwd, args, options = {}) => { if (args.includes("--stdin")) throw new Error("fixture aggregate diff overflow");',
      ),
    );
    assert.equal(listCold(), releases(many.sources));
    writeFileSync(gitModule, gitSource);
    writeFileSync(controlModule, controlSource);

    // A manifest whose changedFiles is not a list attributes nothing, as an
    // unreadable manifest does: a range that attributes orders still prints
    // them, the record is cached with no attribution, and an empty range
    // prints its row with none recorded.
    for (const [index, changedFiles] of [
      [11, "docs/final-reviews/WO-921/RELEASE-NOTES.md"],
      [12, { path: "docs/final-reviews/WO-922/RELEASE-NOTES.md" }],
      [13, 13],
    ] as const)
      release(index, {
        release: { application: `v0.1.${index}` },
        notes: { changedFiles },
      });
    const malformed = listCold();
    for (let index = 11; index <= 13; index += 1)
      assert.match(
        malformed,
        row(`v0.1.${index}`, `v0.1.${index}`, `WO-${910 + index}`),
      );
    assert.equal(releases((await census()).sources), malformed);
    assert.deepEqual(
      (
        JSON.parse(readFileSync(join(repo, cache), "utf8")) as {
          tags: Record<string, { manifestWorkOrders: unknown } | undefined>;
        }
      ).tags["v0.1.11"]?.manifestWorkOrders,
      [],
      "a non-list changed-file list is cached as no attribution",
    );
    for (const [tag, changedFiles] of [
      ["v0.1.14", "docs/final-reviews/WO-923/RELEASE-NOTES.md"],
      ["v0.1.15", { path: "docs/final-reviews/WO-923/RELEASE-NOTES.md" }],
      ["v0.1.16", 16],
    ] as const)
      tagRelease(tag, {
        release: { application: tag },
        notes: { changedFiles },
      });
    const emptyRanges = listCold();
    for (const tag of ["v0.1.14", "v0.1.15", "v0.1.16"])
      assert.match(emptyRanges, row(tag, tag, "none recorded"));
    assert.equal(releases((await census()).sources), emptyRanges);
    for (let index = 11; index <= 16; index += 1)
      git("tag", "-d", `v0.1.${index}`);

    // Rewriting historical control bytes is still refused by the same
    // append-only comparison used by the individual reader.
    write(
      "docs/control/orders/WO-911.jsonl",
      activation("WO-911").replace('"schemaVersion":1', '"schemaVersion": 1'),
    );
    git("add", "-A");
    git("commit", "-q", "-m", "invalid control rewrite");
    tagRelease("v0.1.10");
    assert.throws(listCold, /control log is not append-only/);
    git("tag", "-d", "v0.1.10");

    // A record in an unignored lane is never read or written.
    const tampered = records.replace(
      '"application":"v0.1.5"',
      '"application":"tampered"',
    );
    assert.notEqual(tampered, records);
    writeFileSync(join(repo, cache), tampered);
    write(".gitignore", "scripts/\npackages/\n");
    const unignored = await census();
    assert.equal(releases(unignored.sources), releases(many.sources));
    assert.equal(readFileSync(join(repo, cache), "utf8"), tampered);
  } finally {
    for (const [key, value] of Object.entries(saved))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    rmSync(base, { recursive: true, force: true });
  }
});
