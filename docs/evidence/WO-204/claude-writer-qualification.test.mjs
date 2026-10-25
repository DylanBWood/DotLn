import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyObjectLocations,
  relativize,
} from "./claude-writer-qualification.mjs";
import { changedSharedPaths } from "./qualification-fixture.mjs";

test("object location separates a private candidate from a shared or missing one", () => {
  assert.equal(
    classifyObjectLocations({
      changed: true,
      privateReadable: true,
      sharedReadable: false,
    }),
    "private-only",
  );
  assert.equal(
    classifyObjectLocations({
      changed: true,
      privateReadable: true,
      sharedReadable: true,
    }),
    "shared-before-import",
  );
  assert.equal(
    classifyObjectLocations({
      changed: true,
      privateReadable: false,
      sharedReadable: false,
    }),
    "candidate-unreadable",
  );
  assert.equal(
    classifyObjectLocations({
      changed: false,
      privateReadable: true,
      sharedReadable: true,
    }),
    "no-candidate",
  );
});
test("shared comparison reports created, removed and changed paths without file bytes", () => {
  assert.deepEqual(
    changedSharedPaths(
      { config: ["file", 1, "before"], old: ["directory", 1], same: [1] },
      { config: ["file", 1, "after"], new: ["directory", 1], same: [1] },
    ),
    ["<common>/config", "<common>/new", "<common>/old"],
  );
});
test("Claude evidence paths and nested home paths are relativized", () => {
  const value = relativize(
    {
      paths: [
        "/Users/synthetic/tmp/check/tree/fixture.txt",
        "/Users/synthetic/.gitconfig",
      ],
      nested: { path: "/Users/synthetic/tmp/check/target/.git/config" },
    },
    {
      scratch: "/Users/synthetic/tmp/check",
      worktree: "/Users/synthetic/tmp/check/tree",
      common: "/Users/synthetic/tmp/check/target/.git",
    },
    "/Users/synthetic",
  );
  assert.deepEqual(value, {
    paths: ["<worktree>/fixture.txt", "<home>/.gitconfig"],
    nested: { path: "<common>/config" },
  });
  assert.equal(JSON.stringify(value).includes("/Users/"), false);
});
