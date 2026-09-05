import { runGit } from "./git.mjs";

const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const validateRecordedAt = (event, location) => {
  if (event == null || !Object.hasOwn(event, "recordedAt")) return;
  const value = event.recordedAt;
  if (
    typeof value !== "string" ||
    !timestampPattern.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  )
    throw new Error(
      `invalid recordedAt ${location}: expected a valid UTC timestamp YYYY-MM-DDTHH:mm:ss.sssZ`,
    );
};

const phaseStarts = new Map([
  ["WorkOrderActivated", "implementation"],
  ["VerificationRequested", "verification"],
  ["RepairRequested", "repair"],
  ["FinalReviewRequested", "finalReview"],
]);
const phaseEnds = new Map([
  ["ImplementationReady", "implementation"],
  ["VerificationCompleted", "verification"],
  ["RepairCompleted", "repair"],
  ["FinalReviewCompleted", "finalReview"],
]);

// Timing is a projection over append order, never an input to lifecycle state.
// Each phase names its latest completed attempt, including failed attempts.
export const controlTimeProjection = (events) => {
  let workOrderId;
  let elapsed = {};
  const starts = new Map();
  for (const event of events) {
    if (event.type === "WorkOrderActivated") {
      workOrderId = event.workOrderId;
      starts.clear();
      elapsed = {};
    }
    if (event.workOrderId !== workOrderId) continue;
    const start = phaseStarts.get(event.type);
    if (start) starts.set(start, event.recordedAt);
    const end = phaseEnds.get(event.type);
    if (end) {
      const from = starts.get(end);
      elapsed[end] =
        from === undefined || event.recordedAt === undefined
          ? "unknown"
          : Date.parse(event.recordedAt) - Date.parse(from);
      starts.delete(end);
    }
  }
  return { recordedAt: events.at(-1)?.recordedAt ?? null, elapsed };
};

// Only named local commit refs may supply missing times. No object payload,
// author identity, remote, nearest-neighbor estimate, or current clock is read.
export const recoverControlTimes = (root, events, locations = []) => {
  const refs = new Map();
  const counts = {
    recordedAt: 0,
    "recovered-from-local-checkpoint-ref": 0,
    unknown: 0,
  };
  const observations = events.map((event, index) => {
    const location = locations[index];
    const at = location
      ? `in ${location.segment} at ordinal ${location.ordinal}`
      : `at line ${index + 1}`;
    let time = event.recordedAt ?? "unknown";
    let source = event.recordedAt === undefined ? "unknown" : "recordedAt";
    if (source === "unknown" && event.checkpointRef !== undefined) {
      const ref = event.checkpointRef;
      if (
        typeof ref !== "string" ||
        !/^refs\/dotln\/checkpoint\/WO-\d{3}\/[1-9]\d*$/.test(ref) ||
        ref.split("/")[3] !== event.workOrderId
      )
        throw new Error(`invalid checkpoint ref ${at}`);
      if (!refs.has(ref)) {
        const row = runGit(root, [
          "for-each-ref",
          "--format=%(refname) %(objecttype) %(objectname) %(committerdate:unix)",
          ref,
        ])
          .split("\n")
          .find((line) => line.startsWith(`${ref} `));
        if (!row) throw new Error(`missing local checkpoint ref ${at}: ${ref}`);
        const [, type, sha, seconds] = row.split(" ");
        if (type !== "commit" || !/^-?\d+$/.test(seconds ?? ""))
          throw new Error(`invalid checkpoint commit ${at}: ${ref}`);
        refs.set(ref, {
          sha,
          time: new Date(Number(seconds) * 1000).toISOString(),
        });
      }
      const recovered = refs.get(ref);
      if (
        event.checkpointSha !== undefined &&
        event.checkpointSha !== recovered.sha
      )
        throw new Error(`checkpoint SHA mismatch ${at}: ${ref}`);
      time = recovered.time;
      source = "recovered-from-local-checkpoint-ref";
    }
    counts[source] += 1;
    return {
      ordinal: location?.ordinal ?? index + 1,
      workOrder: event.workOrderId,
      type: event.type,
      time,
      source,
      ...(location ? { segment: location.segment } : {}),
    };
  });
  const metadata = JSON.stringify(
    {
      eventCount: events.length,
      localRefsRead: refs.size,
      checkpointRefs: "These local checkpoint refs remain unpushed.",
      recoveredPrecision:
        "Committer dates have second precision; .000 is normalization, not measured milliseconds.",
      counts,
    },
    null,
    2,
  );
  // A JSON document with one physical line per event, for a byte-exact dated
  // observation. No observation clock makes repeated read-only runs identical.
  return `${metadata.slice(0, -2)},\n  "events": [${observations.length ? `\n${observations.map((event) => `    ${JSON.stringify(event)}`).join(",\n")}\n  ` : ""}]\n}`;
};
