// Final-review supplement for the witnessed run: the directories it wrote
// outside this repository, the export's own checks, the delivery's shapes and
// each native episode's launch claim. The run directory lives under the system
// temporary root and can be purged, so these facts are copied while it exists.
// Run through the bounded wrapper; it prints sanitized JSON and writes nothing:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-118/final-001/supplement.mjs
// The ignored pointer docs/control/local/wo118-witnessed.json locates the run.
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const text = (path) => readFileSync(path, "utf8");
const rows = (path) =>
  text(path)
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
const files = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(directory, entry.name))
      : [join(directory, entry.name)],
  );
const need = (condition, reason) => {
  if (!condition) throw new Error(reason);
};

const temp = realpathSync(tmpdir());
const base = realpathSync(
  json(join(root, "docs/control/local/wo118-witnessed.json")).directory,
);
need(base.startsWith(temp + sep), "run directory outside the temporary root");
const binding = json(join(base, "binding.json"));
const run = json(join(base, "run-result.json"));
const alias = (value) => String(value).replaceAll(run.key, "<run-key>");

// Every directory the run wrote, by role, as a shape under the system
// temporary root that every default role is granted.
const outside = [
  ["exported instance", binding.root],
  ["export candidate checkout", join(base, "candidate")],
  ["scratch target checkout", binding.target],
  ["governed worktree parent", binding.trees],
  ["resident and vertical stores", binding.store],
  ["status snapshot copies", join(base, "snapshots")],
].map(([role, path]) => {
  const real = realpathSync(path);
  need(real.startsWith(base + sep), `${role} lies outside the run directory`);
  return {
    role,
    shape: `<system-temp>/<run>/${relative(base, real)}`,
    grantRoot: "system-temp",
  };
});

const number = (source, pattern) => {
  const match = source.match(pattern);
  need(match, `missing ${pattern}`);
  return Number(match[1]);
};
const exported = text(join(base, "export.txt"));
const emitted = text(join(base, "harness-emit.txt"));
const checked = text(join(base, "harness-check.txt"));
const verified = text(join(base, "verify.txt"));
const exportChecks = {
  kitFiles: number(exported, /(\d+) kit files in KIT-MANIFEST\.json/u),
  instanceSeeds: number(exported, /(\d+) instance seeds/u),
  compiledRuntimeFiles: number(exported, /runtime: (\d+) compiled files/u),
  harnessEmitSurfaces: number(emitted, /harness emit: (\d+) generated/u),
  harnessCheckSurfaces: number(checked, /harness check: (\d+) generated/u),
  kitFilesVerified: number(verified, /kit: (\d+) files verified/u),
  localTermsList: checked.match(/local-terms list: (\w+)/u)?.[1] ?? "unknown",
};

const pr = json(join(base, "pr-observed.json"));
const delivery = {
  state: pr.state,
  title: pr.title,
  branch: alias(pr.headRefName),
  commitSubjects: pr.commits.map((commit) => commit.messageHeadline),
};

// Launch claims are the host's selections; effective model and effort stay
// unknown unless a record says otherwise.
const claim = (record) => ({
  transport: record.transport,
  harnessVersion: record.harnessVersion,
  model: record.model,
  effort: record.effort,
  selectionSource: record.selectionSource ?? "host-launch",
  effectiveModel: record.effectiveModel ?? "unknown",
  effectiveEffort: record.effectiveEffort ?? "unknown",
});
const store = files(binding.store);
const vertical = join(binding.store, "vertical", run.key);
const intake = store
  .filter((file) => /\/issue-intake\/[^/]+\.json$/u.test(file))
  .map((file) => json(file).provenance)
  .map((record) => ({
    kind: "intake",
    episode: alias(record.episodeId),
    ...claim(record),
    dispatchedAt: record.dispatchedAt,
  }));
const workers = store
  .filter((file) => file.endsWith("/events.jsonl"))
  .flatMap((file) =>
    rows(file)
      .filter((event) => event.type === "WorkerAttemptStarted")
      .map((event) => ({
        kind: "worker",
        store: alias(relative(vertical, join(file, ".."))),
        episode: alias(event.payload.workerEpisodeId),
        command: alias(event.payload.commandId),
        ...claim(event.payload),
        startedAt: new Date(event.occurredAt).toISOString(),
      })),
  );
const triage = store
  .filter((file) => /\/triage-[^/]+\.json$/u.test(file))
  .map((file) => json(file).provenance)
  .map((record) => ({
    kind: "triage",
    episode: alias(record.episodeId),
    ...claim(record),
    dispatchedAt: record.dispatchedAt,
  }));
const launches = [...intake, ...workers, ...triage].sort((a, b) =>
  (a.dispatchedAt ?? a.startedAt).localeCompare(b.dispatchedAt ?? b.startedAt),
);
need(launches.length === run.launches.total, "launch count differs");

console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      label: "observed",
      source:
        "the retained witnessed run directory under the system temporary root, located by an ignored local pointer and read by supplement.mjs",
      collectedAt: new Date().toISOString(),
      outsideDirectories: outside,
      exportChecks,
      delivery,
      launches: {
        total: launches.length,
        intake: intake.length,
        workers: workers.length,
        triage: triage.length,
        episodes: launches,
      },
    },
    null,
    2,
  ),
);
