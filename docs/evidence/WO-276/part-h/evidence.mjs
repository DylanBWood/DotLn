// Part H's evidence: the host report on this host, its three injected
// outcomes, the host task in a kit root and in core on one injected host,
// and the update preview's floor lines with the reading's time.
//
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-h/evidence.mjs
//
// It writes, beside itself: host-report.txt and host-report.json (the
// command on this host), injected.json (criterion H2's outcomes),
// host-task.txt (criterion H4's two outputs), previews.txt (criterion H5's
// two previews) and results.json. The previews are made in a starter and a
// fork built from the launchpad tests' fixture export, since an export reads
// committed files and an order's branch commits nothing before final review.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  commitExport,
  env,
  git,
  repository,
  scratch,
} from "../../../../scripts/lib/launchpad-fixture.mjs";
import { doctor } from "../../../../scripts/doctor.mjs";
import {
  compilerFailure,
  hostLaneCapacity,
  memoryBudgets,
} from "../../../../scripts/lib/host-resources.mjs";
import { unmetIncomingFloors } from "../../../../scripts/launchpad.mjs";
import { checkHost } from "../../../../scripts/structural-checks.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const save = (name, text) => writeFileSync(join(here, name), text);
const node = (cwd, args) =>
  spawnSync(process.execPath, args, { cwd, encoding: "utf8", env });

test("Part H: the host report, the host task and the preview's floor lines", async () => {
  const results = {
    what: "Part H's observations on this host and on injected hosts.",
    command:
      "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-h/evidence.mjs",
  };

  // The command on this host: the table and the same rows as JSON.
  const table = node(repository, ["scripts/doctor.mjs"]);
  const json = node(repository, ["scripts/doctor.mjs", "--json"]);
  save(
    "host-report.txt",
    `$ node scripts/doctor.mjs   # exit ${table.status}\n${table.stdout}`,
  );
  save("host-report.json", json.stdout);
  const rows = JSON.parse(json.stdout);
  results.thisHost = {
    exitCode: table.status,
    rows: rows.length,
    verdicts: Object.fromEntries(rows.map((row) => [row.id, row.verdict])),
  };
  assert.equal(table.status, 0);

  // Criterion H2: injected facts through the entry.
  const facts = (over = {}) => ({
    root: repository,
    nodeVersion: process.version,
    gitVersion: "git version 2.55.0",
    platform: "darwin",
    wsl: null,
    processors: 16,
    memoryBytes: 48 * 2 ** 30,
    compile: () => {},
    symlink: () => {},
    laneCapacity: () => 8,
    gitConfig: () => null,
    lineAttributes: () => [{ text: "unset", eol: "unspecified" }],
    originUrl: () =>
      "git@forge.example.net:synthetic-owner/synthetic-repository.git",
    pushTarget: () => ({
      host: "forge.example.net",
      selector: "forge.example.net/synthetic-owner/synthetic-repository",
    }),
    tool: (command) =>
      command === "gh" || command === "claude" ? `${command} 1.2.3` : null,
    electedHosts: () => ({ "host-codex": false, "host-copilot": false }),
    hostName: "build-host-17.corp.example.net",
    userName: "synthetic-user",
    homeDirectory: "/Users/synthetic-user",
    ...over,
  });
  const failing = () => {
    throw new Error("spawn cc ENOENT");
  };
  const run = async (options) => {
    const lines = [];
    const exitCode = await doctor(["--json"], {
      root: repository,
      write: (text) => lines.push(text),
      ...options,
    });
    return { exitCode, rows: JSON.parse(lines.join("\n")) };
  };
  const injected = {
    "every assumption met": await run({ facts: facts() }),
    "a Node below the floor, a Git below the floor and a compiler that fails, at once":
      await run({
        nodeVersion: "v18.20.0",
        facts: facts({
          gitVersion: "git version 2.20.1",
          // The helpers' own error for a compiler that is not found.
          compile: () => {
            throw compilerFailure(
              "cc",
              Object.assign(new Error("spawn cc ENOENT"), { code: "ENOENT" }),
              "darwin",
            );
          },
        }),
      }),
    "two facts that cannot be read": await run({
      facts: facts({ gitConfig: failing, originUrl: () => null }),
    }),
    "a Node below the floor and a library that cannot be loaded": await run({
      nodeVersion: "v18.20.0",
      load: () => Promise.reject(new SyntaxError("Unexpected token")),
    }),
  };
  save("injected.json", `${JSON.stringify(injected, null, 2)}\n`);
  results.injected = Object.fromEntries(
    Object.entries(injected).map(([name, outcome]) => [
      name,
      {
        exitCode: outcome.exitCode,
        unmet: outcome.rows
          .filter((row) => row.verdict === "unmet")
          .map((row) => row.id),
        unknown: outcome.rows
          .filter((row) => row.verdict === "unknown")
          .map((row) => row.id),
      },
    ]),
  );
  assert.deepEqual(
    Object.values(injected).map((outcome) => outcome.exitCode),
    [0, 1, 0, 1],
  );

  // Criterion H4: one injected host, 16 GB and twelve processors, judged by
  // the host task for a kit root and for core.
  const kit = mkdtempSync(join(tmpdir(), "dotln-part-h-kit-"));
  try {
    writeFileSync(join(kit, "KIT-MANIFEST.json"), "{}\n");
    const physicalBytes = 16 * 2 ** 30;
    const sample = {
      level: "normal",
      pressure: 1,
      swapBytes: 0,
      physicalBytes,
      source: "injected",
    };
    const limits = memoryBudgets(kit, {
      capacity: hostLaneCapacity(12),
      physicalBytes,
    });
    const inKit = checkHost(sample, { root: kit, limits, fileEvents: {} });
    const inCore = checkHost(sample, {
      root: repository,
      limits,
      fileEvents: {},
    });
    save(
      "host-task.txt",
      [
        "# The host task (checkHost) on an injected host of 16 GB and twelve logical processors.",
        `## In a kit root: exit ${inKit.exitCode}`,
        inKit.output,
        `## In core: exit ${inCore.exitCode}`,
        inCore.output,
        "",
      ].join("\n"),
    );
    results.hostTask = { kitRoot: inKit.exitCode, core: inCore.exitCode };
    assert.deepEqual([inKit.exitCode, inCore.exitCode], [0, 1]);
  } finally {
    rmSync(kit, { recursive: true, force: true });
  }

  // Criterion H5: a starter, a fork of it, and a starter revision whose
  // floors no host meets.
  const starter = commitExport(join(scratch, "part-h-starter"));
  const fork = join(scratch, "part-h-fork");
  git(scratch, ["-c", "maintenance.auto=false", "clone", "-q", starter, fork]);
  const preview = (ref) => {
    const started = performance.now();
    const result = node(fork, [
      "scripts/launchpad.mjs",
      "preview",
      "--from",
      ref,
    ]);
    return { ...result, ms: Math.round(performance.now() - started) };
  };
  const met = preview("HEAD");
  const manifest = JSON.parse(
    readFileSync(join(starter, "package.json"), "utf8"),
  );
  manifest.engines = { ...manifest.engines, node: "^99.0.0", git: ">=99.0.0" };
  writeFileSync(
    join(starter, "package.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  git(starter, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qam",
    "raise both floors",
  ]);
  // No background maintenance: it would still be writing the fork's object
  // store when the fixture removes its scratch root.
  git(fork, ["-c", "maintenance.auto=false", "fetch", "-q", "origin"]);
  const unmet = preview("origin/main");
  const plain = (text) =>
    text.replaceAll(fork, "<fork>").replaceAll(scratch, "<scratch>");
  const head = (text) => plain(text).split("\n").slice(0, 8).join("\n");
  save(
    "previews.txt",
    [
      "# node scripts/launchpad.mjs preview --from <revision>, in a fork of a fresh export; the first eight lines of each.",
      `## A revision whose floors this host meets: exit ${met.status}`,
      head(met.stdout),
      `## A revision that declares engines.node ^99.0.0 and engines.git >=99.0.0: exit ${unmet.status}`,
      head(unmet.stdout),
      "",
    ].join("\n"),
  );
  const started = performance.now();
  const lines = unmetIncomingFloors(
    readFileSync(join(starter, "package.json"), "utf8"),
  );
  const readingMs = Math.round((performance.now() - started) * 10) / 10;
  results.preview = {
    met: {
      exitCode: met.status,
      floorLines: (met.stdout.match(/^incoming floor not met/gmu) ?? []).length,
      previewMs: met.ms,
    },
    unmet: {
      exitCode: unmet.status,
      floorLines: (unmet.stdout.match(/^incoming floor not met/gmu) ?? [])
        .length,
      previewMs: unmet.ms,
    },
    floorReadingMs: readingMs,
    floorReading:
      "unmetIncomingFloors over the incoming package.json, one git --version among it",
  };
  assert.equal(lines.length, 2);
  assert.deepEqual(
    [
      met.status,
      results.preview.met.floorLines,
      unmet.status,
      results.preview.unmet.floorLines,
    ],
    [0, 0, 0, 2],
  );
  assert.match(unmet.stdout, /^kit files: /mu);
  save("results.json", `${JSON.stringify(results, null, 2)}\n`);
});
