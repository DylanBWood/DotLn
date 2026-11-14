// Part K's evidence: criterion K2's four outputs in an exported instance
// that holds files of its own under `extensions/`; criterion K3's merged
// settings and refusals, with emit's and check's times before and after the
// fragment; and the first lines of the status output of criterion K5.
//
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-k/evidence.mjs
//
// It writes, beside itself: k2-outputs.txt (the instance's `npm test`, its
// `harness emit` and `harness check`, and whether it is still a kit root),
// merged-settings.txt (the settings emit wrote with the fragment, and what
// the fragment added), refusals.txt (what emit says to a fragment it does
// not take), status.txt and results.json. The instance is the launchpad
// tests' exported fixture, committed and installed. Set PART_K_INSTANCE to a
// directory to keep the instance there after the run, with its fragment in
// place, for an observation of the host itself (host-observation.txt is
// written by hand from such a run and says how).
import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  commitWarmExport,
  env,
  git,
  harness,
  ok,
  run,
  scratch,
} from "../../../../scripts/lib/launchpad-fixture.mjs";
import { isKitRoot } from "../../../../packages/skeleton/src/runtime-inputs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const save = (name, text) => writeFileSync(join(here, name), text);
// No session of this host stands behind the instance's commands.
const quiet = {
  ...env,
  CLAUDE_CODE_SESSION_ID: "",
  CLAUDE_SESSION_ID: "",
  DOTLN_DRIVEN_WORKER: "",
};
const FRAGMENT = ".claude/settings.instance.json";
const SETTINGS = ".claude/settings.json";

test("Part K: an instance's own root through its gate, the merged settings and their refusals, and the status output", () => {
  const results = {
    what: "Part K's observations in an exported instance that holds files of its own under extensions/ and a settings fragment.",
    command:
      "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-k/evidence.mjs",
  };
  const kept = process.env.PART_K_INSTANCE;
  if (kept) rmSync(kept, { recursive: true, force: true });
  const instance = commitWarmExport(kept || join(scratch, "part-k-instance"));
  git(instance, ["branch", "-m", "instance"]);
  // Nothing of this host in a saved output.
  const plain = (text) =>
    text.replaceAll(instance, "<instance>").replaceAll(scratch, "<scratch>");
  const node = (args) =>
    run(process.execPath, args, { cwd: instance, env: quiet });
  const read = (path) => readFileSync(join(instance, path), "utf8");
  const write = (path, contents) => {
    mkdirSync(dirname(join(instance, path)), { recursive: true });
    writeFileSync(join(instance, path), contents);
  };

  // Criterion K2: four files of the instance's own, committed.
  const own = {
    "extensions/tools/scratch.mjs":
      'import { mkdtempSync } from "node:fs";\nimport { tmpdir } from "node:os";\nimport { join } from "node:path";\nexport const scratchRoot = () => mkdtempSync(join(tmpdir(), "instance-tool-"));\n',
    "extensions/tools/unformatted.mjs":
      "export const   rows = {a:1,b:[1,2 ,3]}\n",
    "extensions/package.json":
      '{ "name": "instance-tools", "private": true, "version": "0.0.0" }\n',
    "extensions/package-lock.json": `${JSON.stringify({ name: "instance-tools", version: "0.0.0", lockfileVersion: 3, requires: true, packages: { "": { name: "instance-tools", version: "0.0.0" } } })}\n`,
    "extensions/data/rows.jsonl": '{"row":1}\n{"row":2}\n',
  };
  for (const [path, contents] of Object.entries(own)) write(path, contents);
  git(instance, ["add", "extensions"]);
  git(instance, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "the instance's own tools",
  ]);
  // The kit's first step in a fresh instance: its generated pages.
  ok(node(["scripts/meta.mjs"]), "the instance's generated pages");
  const started = performance.now();
  const gate = ok(
    node(["scripts/harness.mjs", "bounded", "--", "npm", "test"]),
    "the instance's npm test",
  );
  const gateMs = Math.round(performance.now() - started);
  const emitted = ok(harness(instance, "emit", [], { env: quiet }), "emit");
  const checked = ok(harness(instance, "check", [], { env: quiet }), "check");
  assert.equal(isKitRoot(instance), true);
  for (const [path, contents] of Object.entries(own))
    assert.equal(read(path), contents, path);
  const untouched = git(instance, [
    "status",
    "--porcelain",
    "--",
    "extensions",
  ]).stdout;
  assert.equal(untouched, "");
  // The gate's own lines: each task it ran and how it ended.
  const tasks = [...gate.stdout.matchAll(/^PASS (\S+) /gmu)].map(
    (match) => match[1],
  );
  assert.ok(tasks.includes("format") && tasks.includes("declarations"));
  save(
    "k2-outputs.txt",
    plain(
      [
        "Files under extensions/, committed in the instance:",
        ...Object.keys(own).map((path) => `  ${path}`),
        "",
        "$ npm test   (through node scripts/harness.mjs bounded --)",
        `exit ${gate.status}; tasks run: ${tasks.join(", ")}`,
        ...gate.stdout
          .split("\n")
          .filter((line) => /^(?:PASS|FAIL|kit: )/u.test(line)),
        "",
        "$ node scripts/harness.mjs emit",
        emitted.stdout.trim(),
        "",
        "$ node scripts/harness.mjs check",
        checked.stdout.trim(),
        "",
        `kit root after the gate: ${isKitRoot(instance)}`,
        "git status --porcelain -- extensions: (empty: no tracked file there changed and no file Git does not ignore was added)",
        "",
      ].join("\n"),
    ),
  );
  results.k2 = {
    files: Object.keys(own),
    npmTest: { exit: gate.status, tasks, wallMs: gateMs },
    emit: emitted.stdout.trim(),
    check: checked.stdout.trim(),
    kitRoot: true,
  };

  // Emit's and check's time, five runs each, with no fragment and with one.
  const median = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const timed = (action) => {
    const runs = [];
    for (let index = 0; index < 5; index++) {
      const from = performance.now();
      ok(harness(instance, action, [], { env: quiet }), action);
      runs.push(Math.round(performance.now() - from));
    }
    return { runs, medianMs: median(runs) };
  };
  const before = { emit: timed("emit"), check: timed("check") };

  // Criterion K3: one hook and one permission rule.
  const bare = read(SETTINGS);
  const bareManifest = read(".claude/harness-manifest.json");
  const kit = JSON.parse(bare);
  const hook = {
    matcher: "Bash",
    hooks: [
      {
        type: "command",
        command:
          'echo ran >> "${DOTLN_LAUNCHPAD:-$CLAUDE_PROJECT_DIR}/extensions/hook-ran.log"',
        timeout: 15,
      },
    ],
  };
  const rule = "Bash(extensions/tools/deploy *)";
  const fragment = {
    hooks: { PostToolUse: [hook] },
    permissions: { deny: [rule] },
  };
  write(FRAGMENT, `${JSON.stringify(fragment, null, 2)}\n`);
  const stale = harness(instance, "check", [], { env: quiet });
  assert.notEqual(stale.status, 0);
  ok(harness(instance, "emit", [], { env: quiet }), "emit with the fragment");
  ok(harness(instance, "check", [], { env: quiet }), "check with the fragment");
  const merged = JSON.parse(read(SETTINGS));
  for (const [event, groups] of Object.entries(kit.hooks))
    assert.deepEqual(merged.hooks[event].slice(0, groups.length), groups);
  assert.deepEqual(merged.hooks.PostToolUse.at(-1), hook);
  assert.deepEqual(merged.permissions.deny, [...kit.permissions.deny, rule]);
  assert.deepEqual(merged.permissions.allow, kit.permissions.allow);
  const after = { emit: timed("emit"), check: timed("check") };
  const count = (settings) => ({
    hookGroups: Object.fromEntries(
      Object.entries(settings.hooks).map(([event, groups]) => [
        event,
        groups.length,
      ]),
    ),
    allow: settings.permissions.allow?.length ?? 0,
    ask: settings.permissions.ask?.length ?? 0,
    deny: settings.permissions.deny?.length ?? 0,
  });
  save(
    "merged-settings.txt",
    plain(
      [
        `The fragment, ${FRAGMENT}:`,
        JSON.stringify(fragment, null, 2),
        "",
        "$ node scripts/harness.mjs check   (the fragment written, emit not yet run)",
        `exit ${stale.status}: ${(stale.stderr || stale.stdout).trim().split("\n").at(-1)}`,
        "",
        "Entries before the merge and after it (hook groups by event; rules by list):",
        `  the kit's alone: ${JSON.stringify(count(kit))}`,
        `  merged:          ${JSON.stringify(count(merged))}`,
        "Every entry the kit emits is in the merged file at its place; the fragment's hook group is the last under PostToolUse and its rule the last of permissions.deny.",
        "",
        `The settings emit wrote, ${SETTINGS}:`,
        read(SETTINGS).trimEnd(),
        "",
      ].join("\n"),
    ),
  );

  // What emit says to a fragment it does not take; nothing is written.
  const mergedText = read(SETTINGS);
  const refusal = (label, value) => {
    write(FRAGMENT, `${JSON.stringify(value)}\n`);
    const result = harness(instance, "emit", [], { env: quiet });
    assert.notEqual(result.status, 0, label);
    assert.equal(read(SETTINGS), mergedText, label);
    const message = (result.stderr || result.stdout)
      .trim()
      .split("\n")
      .find((line) => line.includes("invalid settings fragment"));
    assert.ok(message, `${label}: ${result.stderr}`);
    return [label, JSON.stringify(value), plain(message)];
  };
  const refusals = [
    refusal("It would replace an entry the kit emits", {
      autoMemoryEnabled: true,
    }),
    refusal("It names a key the merge does not define", { env: { A: "1" } }),
    refusal("It names a permissions key the merge does not define", {
      permissions: { defaultMode: "bypassPermissions" },
    }),
    refusal("It would remove a list, were null read as removal", {
      permissions: { deny: null },
    }),
    refusal("A hook under PreToolUse", {
      hooks: { PreToolUse: [hook] },
    }),
    refusal("A hook under SubagentStop", {
      hooks: { SubagentStop: [hook] },
    }),
    refusal("A hook under UserPromptSubmit", {
      hooks: { UserPromptSubmit: [hook] },
    }),
    refusal("A hook the kit registers itself, registered again", {
      hooks: {
        Stop: [
          {
            hooks: [
              {
                type: "command",
                command: kit.hooks.Stop[0].hooks[0].command,
                timeout: 1,
              },
            ],
          },
        ],
      },
    }),
    refusal("A rule the kit emits, in another list", {
      permissions: { deny: [kit.permissions.allow[0]] },
    }),
    refusal("A rule with a character that cannot be seen", {
      permissions: { deny: ["Bash(extensions/tools/\u200bdeploy *)"] },
    }),
    refusal("A hook under an event the kit registers nothing under", {
      hooks: { Notification: [hook] },
    }),
    refusal("An entry of another shape than the kit's own", {
      hooks: { Stop: [{ matcher: ["Edit", "Write"], hooks: hook.hooks }] },
    }),
  ];
  save(
    "refusals.txt",
    `${refusals
      .map(
        ([label, value, message]) =>
          `${label}:\n  fragment: ${value}\n  $ node scripts/harness.mjs emit\n  ${message}\n`,
      )
      .join(
        "\n",
      )}\nAfter each refusal ${SETTINGS} holds the bytes it held before.\n`,
  );

  // With the fragment removed, the bytes emitted with none.
  unlinkSync(join(instance, FRAGMENT));
  ok(harness(instance, "emit", [], { env: quiet }), "emit with none");
  assert.equal(read(SETTINGS), bare);
  assert.equal(read(".claude/harness-manifest.json"), bareManifest);
  results.k3 = {
    fragment,
    merged: count(merged),
    kit: count(kit),
    removedEqualsBare: true,
    refusals: refusals.map(([label, , message]) => ({ label, message })),
    times: {
      note: "milliseconds, five runs each of the instance's own emit and check as child processes; before: no fragment; after: the fragment above",
      before,
      after,
    },
  };

  // Criterion K5: the status output's first lines.
  const status = ok(
    node(["scripts/resume.mjs", "status", "--json"]),
    "status --json",
  );
  const parsed = JSON.parse(status.stdout);
  assert.equal(Object.keys(parsed)[0], "schemaVersion");
  assert.equal(parsed.schemaVersion, 1);
  const all = ok(
    node(["scripts/resume.mjs", "status", "--all", "--json"]),
    "status --all --json",
  );
  save(
    "status.txt",
    plain(
      [
        "$ npm run resume -- status --json   (its first lines, in an instance with no order yet)",
        ...status.stdout.split("\n").slice(0, 6),
        "  …",
        "",
        "$ npm run resume -- status --all --json   (the same instance)",
        all.stdout.trim(),
        "",
      ].join("\n"),
    ),
  );
  results.k5 = {
    firstKey: Object.keys(parsed)[0],
    schemaVersion: parsed.schemaVersion,
    allWithNoOrder: all.stdout.trim(),
  };

  // Left for an observation of the host: the fragment back in place, and
  // a harmless program for its deny rule to name.
  if (kept) {
    write(
      "extensions/tools/deploy",
      '#!/bin/sh\necho "deployed $1" > "$(dirname "$0")/deploy-ran.txt"\n',
    );
    chmodSync(join(instance, "extensions/tools/deploy"), 0o755);
    write(FRAGMENT, `${JSON.stringify(fragment, null, 2)}\n`);
    ok(harness(instance, "emit", [], { env: quiet }), "emit for the host");
    ok(harness(instance, "check", [], { env: quiet }), "check for the host");
  }
  save("results.json", `${JSON.stringify(results, null, 2)}\n`);
});
