// Independent verification variations; all mutations belong to disposable fixtures.
import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  commitWarmExport,
  scratch,
  run,
  ok,
  harness,
  harnessManifestOf,
  env,
} from "../../../scripts/lib/launchpad-fixture.mjs";
import {
  readFeatures,
  readFeatureInventory,
} from "../../../scripts/lib/features.mjs";
import { judgeGitRuntime } from "../../../scripts/lib/node-engines.mjs";
const clone = commitWarmExport(join(scratch, "verification-001"));
const original = JSON.parse(
  readFileSync(join(clone, "dotln.config.json"), "utf8"),
);
const config = (features) =>
  writeFileSync(
    join(clone, "dotln.config.json"),
    JSON.stringify({ ...original, features }, null, 2) + "\n",
  );
const emit = () => ok(harness(clone, "emit"), "fixture emit");
const profiles = () =>
  harnessManifestOf(clone).profiles.map((row) => row.profile.harness);

test("fresh export has bound standing documents; Copilot inference, shared skills and personal files survive host transitions", () => {
  assert.deepEqual(profiles(), ["claude-code"]);
  assert.equal(existsSync(join(clone, ".codex")), false);
  assert.equal(existsSync(join(clone, ".agents")), false);
  const documents = ok(
    run(process.execPath, ["scripts/docs-check.mjs"], { cwd: clone }),
    "fresh export docs",
  );
  assert.match(documents.stdout, /0 standing without a reader binding/u);
  assert.doesNotMatch(documents.stdout, /^UNBOUND /mu);
  mkdirSync(join(clone, "docs/control/orders"), { recursive: true });
  writeFileSync(
    join(clone, "docs/control/orders/WO-901.jsonl"),
    JSON.stringify({
      type: "ImplementationReady",
      actor: { harness: "copilot-cli" },
    }) + "\n",
  );
  assert.equal(readFeatures(clone)["host-copilot"], true);
  assert.equal(readFeatures(clone)["host-codex"], false);
  assert.match(
    readFeatureInventory(clone).find((row) => row.id === "host-copilot").source,
    /orders\/ attestations/u,
  );
  emit();
  assert.deepEqual(profiles(), ["claude-code", "copilot-cli"]);
  assert.equal(existsSync(join(clone, ".codex")), false);
  assert.equal(
    existsSync(join(clone, ".agents/skills/dotln-executor/SKILL.md")),
    true,
  );
  config({ "host-codex": true });
  emit();
  assert.deepEqual(profiles(), ["claude-code", "codex-cli", "copilot-cli"]);
  writeFileSync(join(clone, ".codex/personal.txt"), "personal fixture file\n");
  writeFileSync(join(clone, ".agents/personal.txt"), "personal fixture file\n");
  config({ "host-codex": false });
  emit();
  assert.deepEqual(profiles(), ["claude-code", "copilot-cli"]);
  assert.equal(existsSync(join(clone, ".codex/config.toml")), false);
  assert.equal(
    existsSync(join(clone, ".agents/skills/dotln-executor/SKILL.md")),
    true,
  );
  config({ "host-codex": false, "host-copilot": false });
  emit();
  assert.deepEqual(profiles(), ["claude-code"]);
  for (const directory of [".codex", ".agents"])
    assert.equal(
      readFileSync(join(clone, directory, "personal.txt"), "utf8"),
      "personal fixture file\n",
    );
  ok(harness(clone, "check"), "both hosts off with personal files");
});

test("old Git is refused by check and the host selection while bootstrap stays open; supported vendor suffixes pass", () => {
  for (const version of [
    "git version 2.40.0 (Apple Git-200)",
    "git version 2.40.0.windows.1",
    "git version 3.0.0",
  ])
    assert.equal(judgeGitRuntime(version, ">=2.40.0").admitted, true, version);
  const shim = join(scratch, "old-git");
  mkdirSync(shim);
  writeFileSync(
    join(shim, "git"),
    '#!/bin/sh\nif [ "$1" = "--version" ]; then echo "git version 2.31.0"; exit 0; fi\nexec "$DOTLN_VERIFY_REAL_GIT" "$@"\n',
  );
  chmodSync(join(shim, "git"), 0o755);
  const realGit = ok(
    run("/usr/bin/which", ["git"]),
    "locate fixture Git",
  ).stdout.trim();
  const oldEnv = {
    ...env,
    PATH: `${shim}:${env.PATH}`,
    DOTLN_VERIFY_REAL_GIT: realGit,
  };
  for (const args of [
    ["scripts/harness.mjs", "check"],
    ["scripts/test-runner.mjs", "--only", "host"],
  ]) {
    const result = run(process.execPath, args, { cwd: clone, env: oldEnv });
    assert.notEqual(result.status, 0, args.join(" "));
    assert.match(
      result.stdout + result.stderr,
      /Git 2\.31\.0 .*below package\.json engines\.git >=2\.40\.0/u,
    );
    if (args[0].includes("test-runner"))
      assert.match(result.stdout + result.stderr, /FAIL host/u);
  }
  ok(
    run(process.execPath, ["scripts/bootstrap.mjs"], {
      cwd: clone,
      env: oldEnv,
    }),
    "bootstrap under old Git shim",
  );
});

test("malformed plan-first values agree with actual status output and leave recovery prompts available", async () => {
  const { planFirstElected } = await import(
    pathToFileURL(
      join(clone, "packages/skeleton/dist/src/plan-first-boundary.js"),
    )
  );
  for (const value of ["on", "true", 1, { on: "true" }]) {
    config({ "plan-first": value });
    let message;
    try {
      planFirstElected(clone);
    } catch (error) {
      message = error.message;
    }
    assert.match(message ?? "", /features\.plan-first/u);
    const statusResult = run(
      process.execPath,
      ["scripts/resume.mjs", "status", "--json"],
      { cwd: clone },
    );
    assert.notEqual(statusResult.status, 0);
    assert.ok((statusResult.stdout + statusResult.stderr).includes(message));
    for (const prompt of [
      "analysis: inspect the fixture",
      "operator override: inspect the fixture",
    ]) {
      const reply = ok(
        run(process.execPath, [".claude/hooks/session.mjs"], {
          cwd: clone,
          input: JSON.stringify({
            hook_event_name: "UserPromptSubmit",
            cwd: clone,
            prompt,
          }),
        }),
        "recovery prompt",
      );
      assert.match(reply.stdout, /operator-control (analysis|override)/u);
      assert.doesNotMatch(reply.stdout, /DOTLN_PLAN_FIRST_REFUSED/u);
    }
  }
  config({});
});

test("siblings commands are harmless with no declaration and detect an orphan registry", () => {
  for (const args of [["index"], ["index", "--check"]]) {
    const result = ok(
      run(process.execPath, ["scripts/siblings.mjs", ...args], { cwd: clone }),
      "absent declaration",
    );
    assert.match(
      result.stdout,
      /no sibling declaration at docs\/siblings\/siblings\.json; nothing to index/u,
    );
  }
  mkdirSync(join(clone, "docs/siblings"), { recursive: true });
  writeFileSync(join(clone, "docs/siblings/README.md"), "# Fixture orphan\n");
  const orphan = run(
    process.execPath,
    ["scripts/siblings.mjs", "index", "--check"],
    { cwd: clone },
  );
  assert.notEqual(orphan.status, 0);
  assert.match(
    orphan.stderr,
    /no sibling declaration, but docs\/siblings\/README\.md exists/u,
  );
});
