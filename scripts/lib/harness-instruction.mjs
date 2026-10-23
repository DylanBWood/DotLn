// Shared by emit and starter preflight; this module loads no compiled runtime.
export const HARNESS_START = "<!-- dotln-harness:start -->";
export const HARNESS_END = "<!-- dotln-harness:end -->";
export const NO_COMPILED_HARNESS =
  "No compiled refusal, hook or verification governs this instance (build: none).";

// These exact legacy navigation lines used to live in the seed floor.
// Preserve all customized instructions while moving the known lines to
// generated output, where removing a build also removes its navigation.
const legacyReads = new Set([
  "Read[executor]: `@skills/dotln-executor/SKILL.md` — next, fix, status, times.",
  "Read[verifier]: `@skills/dotln-verifier/SKILL.md` — verify.",
  "Read[reviewer]: `@skills/dotln-reviewer/SKILL.md` — final review.",
  "Read[release-close]: `@skills/dotln-release-close/SKILL.md` — release close.",
  "Read[planner]: `@skills/dotln-planner/SKILL.md` — planning or ideation.",
]);
export const migrateHarnessFloor = (text) =>
  text
    .split("\n")
    .filter((line) => !legacyReads.has(line))
    .join("\n");

const compiledFloorText = [
  "Whole `resume:` phrases select their skill through canonical status.\n`@skills`: `.claude/skills` in Claude, `.agents/skills` in Codex.\n",
  "Whole `resume:` phrases select their skill through canonical status\n(`npm run resume -- status --json` is the record). `@skills`: `.claude/skills`\nin Claude, `.agents/skills` in Codex. ",
  "Expand skill read/review selectors from order/report paths. Read cited sections;\nname new inputs. A session that cannot load skills runs the\n`npm run resume -- <action>` commands itself.\n",
  "Expand skill read/review selectors from order/report paths. Read cited sections;\nname new inputs.\n",
  "The marked blocks\nat the end are generated: the kit block by the export (its provenance) and the\nharness block by `node scripts/harness.mjs emit`, which `harness check`\nverifies.",
  "This export carries the compiled runtime under packages/<name>/dist/ (hashed in KIT-MANIFEST.json) and the Contributor harness bundle its own emit wrote from it; node scripts/harness.mjs check verifies the pinned runtime snapshot and every generated surface. The hooks import an ignored snapshot under .runtime/harness/: a fresh clone runs node scripts/bootstrap.mjs once (npm ci, then the emit that installs it); until then each hook reports snapshot-missing once per session and host permissions alone decide.\n",
];
/** Remove only known standing references to the harness surfaces a disabled
 * build removes. The clean-room floor and custom operator instructions stay. */
export const withoutCompiledHarnessFloor = (text) =>
  compiledFloorText.reduce(
    (floor, paragraph) => floor.replace(paragraph, ""),
    text,
  );

export function harnessInstructionBlock(text) {
  const starts = text.split(HARNESS_START).length - 1;
  const ends = text.split(HARNESS_END).length - 1;
  if (
    starts !== 1 ||
    ends !== 1 ||
    text.indexOf(HARNESS_END) < text.indexOf(HARNESS_START)
  )
    throw new Error("harness instruction requires one ordered marker pair");
  return (
    text.slice(
      text.indexOf(HARNESS_START),
      text.indexOf(HARNESS_END) + HARNESS_END.length,
    ) + "\n"
  );
}
/** The operating contract an emit writes: a floor that holds the marker pair
 * gets its block replaced; a floor without one gets the block after a blank
 * line. One rule for emitHarness and for a prediction of its output. */
export function composeHarnessInstruction(floor, block) {
  if (typeof floor === "string") {
    if (floor.includes(HARNESS_START) || floor.includes(HARNESS_END)) {
      const prior = harnessInstructionBlock(floor).trimEnd();
      floor =
        migrateHarnessFloor(floor.slice(0, floor.indexOf(HARNESS_START))) +
        prior +
        migrateHarnessFloor(
          floor.slice(floor.indexOf(HARNESS_END) + HARNESS_END.length),
        );
    } else floor = migrateHarnessFloor(floor);
  }
  if (typeof floor !== "string" || !floor.trim())
    throw new Error("harness emit requires the hand-written clean-room floor");
  if (floor.includes(HARNESS_START) || floor.includes(HARNESS_END)) {
    const prior = harnessInstructionBlock(floor).trimEnd();
    if (!floor.replace(prior, "").trim())
      throw new Error(
        "harness emit requires the hand-written clean-room floor outside the generated block",
      );
    // A function replacement inserts the block literally, so `$&` and the
    // other replacement patterns in an identity cannot corrupt the contract.
    return floor.replace(prior, () => block.trimEnd());
  }
  return floor.trimEnd() + "\n\n" + block;
}
