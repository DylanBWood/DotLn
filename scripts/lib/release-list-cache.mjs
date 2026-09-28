import { spawnGit } from "./git.mjs";
import { createHash } from "node:crypto";

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { TOOL_ROOT, docPath, docRelative } from "./config.mjs";
import { controlPaths } from "./control.mjs";

// `release list` derives each row from immutable Git objects, so a tag's
// record is reused while its tag object, the code that derives it and the
// configured roots it reads are unchanged (WO-164). Records live in the
// ignored local lane, and only while Git reports that path ignored.
const SCHEMA_VERSION = 1;
const scripts = join(TOOL_ROOT, "scripts");

// Any edit to the release script or a shared library module retires every
// record: a derivation never outlives the code that produced it.
const codeIdentity = () => {
  const hash = createHash("sha256");
  for (const name of [
    "release.mjs",
    ...readdirSync(join(scripts, "lib"), { withFileTypes: true })
      .filter((entry) => entry.isFile() && /^[^.].*\.mjs$/u.test(entry.name))
      .map((entry) => `lib/${entry.name}`)
      .sort(),
  ])
    hash
      .update(`${name}\0`)
      .update(readFileSync(join(scripts, name)))
      .update("\0");
  return hash.digest("hex");
};

// Records hold what full, immutable history derives. A shallow boundary, a
// graft or a replace ref changes what the same objects mean, so the lane is
// neither read nor written while any of them is present.
const plainHistory = (root) => {
  const base = process.env.GIT_REPLACE_REF_BASE || "refs/replace/";
  const result = spawnGit(
    [
      "-C",
      root,
      "rev-parse",
      "--is-shallow-repository",
      "--git-path",
      "info/grafts",
      `--glob=${base}`,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) return false;
  const [shallow, grafts, ...replaced] = result.stdout.split("\n");
  return (
    shallow === "false" &&
    !existsSync(resolve(root, grafts)) &&
    !(process.env.GIT_GRAFT_FILE && existsSync(process.env.GIT_GRAFT_FILE)) &&
    replaced.every((line) => line === "")
  );
};

const ids = (value) =>
  Array.isArray(value) && value.every((id) => typeof id === "string");
const nullableText = (value) => value === null || typeof value === "string";
const validRecord = (record) =>
  record !== null &&
  typeof record === "object" &&
  typeof record.object === "string" &&
  typeof record.dotln === "boolean" &&
  (!record.dotln ||
    (typeof record.application === "string" &&
      (record.previousRelease === undefined ||
        nullableText(record.previousRelease)) &&
      ids(record.manifestWorkOrders) &&
      (record.between === null ||
        (typeof record.between === "object" &&
          nullableText(record.between.previous) &&
          nullableText(record.between.previousObject) &&
          ids(record.between.workOrders)))));

/** Records by tag name; `get` answers only for the same tag object, and
 * `save` keeps exactly the records `set` during this call. Anything that
 * cannot be established leaves the listing uncached, never refused. */
export function releaseListCache(root) {
  const relativePath = docRelative(
    root,
    "control",
    "local",
    "cache",
    "release-list.json",
  );
  const path = docPath(root, "control", "local", "cache", "release-list.json");
  const records = new Map();
  let context;
  let stored;
  try {
    // A tracked or unignored path is never trusted or written.
    if (
      spawnGit(["-C", root, "check-ignore", "-q", "--", relativePath], {
        stdio: "ignore",
      }).status === 0 &&
      plainHistory(root)
    ) {
      const { legacy, orders } = controlPaths(root);
      context = createHash("sha256")
        .update(
          JSON.stringify([
            SCHEMA_VERSION,
            codeIdentity(),
            legacy,
            orders,
            docRelative(root, "finalReviews"),
          ]),
        )
        .digest("hex");
      stored = existsSync(path) ? readFileSync(path, "utf8") : undefined;
    }
  } catch {
    context = undefined;
  }
  try {
    const value = stored === undefined ? undefined : JSON.parse(stored);
    if (
      value?.schemaVersion === SCHEMA_VERSION &&
      value.context === context &&
      value.tags !== null &&
      typeof value.tags === "object" &&
      !Array.isArray(value.tags)
    )
      for (const [name, record] of Object.entries(value.tags))
        if (validRecord(record)) records.set(name, record);
  } catch {
    // Unreadable records are derived afresh and rewritten.
  }
  const next = new Map();
  return {
    get: (name, object) => {
      const record = records.get(name);
      return record?.object === object ? record : undefined;
    },
    set: (name, record) => {
      if (validRecord(record)) next.set(name, record);
    },
    save: () => {
      if (context === undefined) return;
      const text = `${JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        context,
        tags: Object.fromEntries(next),
      })}\n`;
      if (text === stored) return;
      const temporary = `${path}.${process.pid}.tmp`;
      try {
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(temporary, text);
        renameSync(temporary, path);
      } catch {
        // An unwritable lane costs the next call its Git reads, never this one.
        try {
          rmSync(temporary, { force: true });
        } catch {
          // Nothing further to recover.
        }
      }
    },
  };
}
