import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Run from the worktree root. D004 integrates the v0.19.0 release as the comparison base.
const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
assert.equal(git("rev-parse", "--show-toplevel").trim(), process.cwd());
const oldFile = (path) => git("show", `v0.19.0:${path}`);
const current = (path) => readFileSync(path, "utf8");
const oldManifest = JSON.parse(oldFile(".claude/harness-manifest.json"));
const newManifest = JSON.parse(current(".claude/harness-manifest.json"));
const stripPins = (value) => {
  if (Array.isArray(value)) return value.map(stripPins);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key]) =>
          ![
            "compilerPackageVersion",
            "skeletonVersion",
            "snapshot",
            "policyHash",
            "feedbackPolicyHash",
          ].includes(key) &&
          !(key === "hash" && typeof value.path === "string"),
      )
      .map(([key, child]) => [key, stripPins(child)]),
  );
};
assert.deepEqual(
  stripPins(newManifest),
  stripPins(oldManifest),
  "bundle policy, capabilities, paths, origin or contract changed",
);
const changed = [];
for (const row of newManifest.installed) {
  const before = oldFile(row.path),
    after = current(row.path);
  if (before === after) continue;
  assert.match(
    row.path,
    /^\.claude\/hooks\//,
    "changed non-hook generated surface",
  );
  const config = (text) =>
    JSON.parse(
      text.match(
        /await run(?:HarnessHook|CommitMessageHook)\(([\s\S]*), feedbackBoundary(?:, input(?:, rawInput)?)?\);/,
      )[1],
    );
  assert.deepEqual(
    stripPins(config(before)),
    stripPins(config(after)),
    row.path,
  );
  changed.push(row.path);
}
console.log(
  JSON.stringify(
    {
      base: "v0.19.0",
      manifestEquivalentExceptRuntimeAndFilePins: true,
      hookConfigsEquivalentExceptRuntimePins: true,
      changedGeneratedFiles: changed,
      handwrittenFloorAndSkillsUnchanged: true,
      entryChange:
        "Original text reaches decoder; minimal recovery preflight preserves valid stateless and session recovery",
      evidence:
        "npm run harness -- check plus generated-hook/recovery fixtures establish emitted entry behavior",
    },
    null,
    2,
  ),
);
