import test from "node:test";
import assert from "node:assert/strict";
import {
  calibrated,
  classifyDenial,
  commandExits,
  denialSummary,
  parseDenials,
  shellEnvironment,
} from "./codex-writer-qualification.mjs";
import { relativize } from "./qualification-fixture.mjs";

test("command exits retain only completed command_execution commands and exit codes", () => {
  const rows = [
    {
      type: "item.started",
      item: {
        type: "command_execution",
        command: "git add -A",
        exit_code: null,
      },
    },
    {
      type: "item.completed",
      item: {
        type: "command_execution",
        command: "git commit -F /synthetic/message",
        exit_code: 0,
        aggregated_output: "discarded output",
      },
    },
    {
      type: "item.completed",
      item: { type: "agent_message", text: "discarded summary" },
    },
    {
      type: "item.completed",
      item: { type: "command_execution", command: "interrupted" },
    },
  ];
  assert.deepEqual(
    commandExits(
      rows.map((row) => JSON.stringify(row)).join("\n") + "\ninvalid",
    ),
    [
      { command: "git commit -F /synthetic/message", exitCode: 0 },
      { command: "interrupted", exitCode: null },
    ],
  );
});
test("the denial parser strips process identity and calibrates multiplicities", () => {
  const first =
    "kernel Sandbox: git(12345) deny(1) file-write-create /synthetic/common/packed-refs.lock";
  const second = JSON.stringify({
    eventMessage:
      "Sandbox: touch(54321) deny(1) file-write-create /synthetic/common/hooks/marker",
    processID: 54321,
  });
  const concise = "(touch) file-write-create /synthetic/outside/marker";
  const rows = parseDenials(`${first}\n${second}\n${concise}\nnot a denial`);
  assert.deepEqual(rows, [
    {
      operation: "file-write-create",
      target: "/synthetic/common/packed-refs.lock",
    },
    {
      operation: "file-write-create",
      target: "/synthetic/common/hooks/marker",
    },
    { operation: "file-write-create", target: "/synthetic/outside/marker" },
  ]);
  assert.equal(calibrated(rows, rows), true);
  assert.equal(calibrated([...rows, rows[0]], rows), false);
  assert.equal(calibrated([], []), false);
  const paths = {
    common: "/synthetic/common",
    gitdir: "/synthetic/common/worktrees/writer",
    worktree: "/synthetic/tree",
    store: "/synthetic/private",
  };
  assert.equal(classifyDenial(rows[0], paths), "expected-packed-refs-lock");
  assert.equal(classifyDenial(rows[1], paths), "repository");
  assert.equal(
    classifyDenial(
      { operation: "network-outbound", target: "192.0.2.1:9" },
      paths,
    ),
    "network",
  );
  assert.deepEqual(denialSummary([rows[0], rows[0]], paths), [
    {
      operation: "file-write-create",
      path: "<common>/packed-refs.lock",
      classification: "expected-packed-refs-lock",
      count: 2,
    },
  ]);
  assert.equal(
    JSON.stringify(denialSummary(rows, paths)).includes("12345"),
    false,
  );
});
test("path replacement uses the most specific root and replaces the home in commands", () => {
  const paths = {
    scratch: "/Users/synthetic/tmp/probe",
    common: "/Users/synthetic/tmp/probe/target/.git",
    store: "/Users/synthetic/tmp/probe/target/.git/worktrees/w/dotln-objects",
  };
  assert.deepEqual(
    relativize(
      {
        command: "git -F /Users/synthetic/tmp/probe/message",
        entries: [
          "/Users/synthetic/.gitconfig",
          `${paths.common}/packed-refs.lock`,
          `${paths.store}/ab/object`,
        ],
      },
      paths,
      "/Users/synthetic",
    ),
    {
      command: "git -F <scratch>/message",
      entries: [
        "<home>/.gitconfig",
        "<common>/packed-refs.lock",
        "<store>/ab/object",
      ],
    },
  );
});
test("the emitted TOML environment is decoded without losing the alternate's quoting", () => {
  const env = {
    PATH: "/synthetic/bin:/usr/bin",
    GIT_OBJECT_DIRECTORY: "/synthetic/private",
    GIT_ALTERNATE_OBJECT_DIRECTORIES: JSON.stringify(
      "/synthetic/common/objects",
    ),
    GIT_CONFIG_COUNT: "2",
  };
  assert.deepEqual(
    shellEnvironment([
      `shell_environment_policy.set={${Object.entries(env)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(",")}}`,
    ]),
    env,
  );
});
