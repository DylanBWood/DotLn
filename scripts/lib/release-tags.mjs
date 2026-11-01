import {
  defaultDocRelative,
  docPath,
  rootPattern,
  validReleaseDisplayName,
} from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";

import { failureOf, readGitObjects, runGit, spawnGitLimited } from "./git.mjs";
import { parseJson } from "./paths.mjs";

export const semver = (value) => {
  const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value);
  const parts = match?.slice(1).map(Number);
  return parts?.every(Number.isSafeInteger) ? parts : undefined;
};
export const strictVersionsIn = (source) =>
  [
    ...source.matchAll(
      /(?<![A-Za-z0-9._+\-])v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?![A-Za-z0-9._+\-])/g,
    ),
  ].map((match) => match[0]);
export const compareVersions = (left, right) => {
  const a = semver(left);
  const b = semver(right);
  if (!a || !b)
    throw new Error(
      `cannot compare malformed release versions: ${left}, ${right}`,
    );
  for (let index = 0; index < 3; index += 1)
    if (a[index] !== b[index]) return a[index] - b[index];
  return 0;
};
/** The one strict version a work-order heading names, or null. */
export const headingVersion = (heading) => {
  const versions = strictVersionsIn(heading);
  return versions.length === 1 && semver(versions[0]) ? versions[0] : null;
};
/** The latest semver-named tag among `tags`, a Map by name, or null. */
export const latestTagVersion = (tags) =>
  [...tags.keys()]
    .filter((name) => semver(name))
    .sort(compareVersions)
    .at(-1) ?? null;
/** The origin's tags as the checkout's own Git reads them: the comparison
 * release close makes, and the one the handoff describes. */
export const originTags = (root, { timeoutMs } = {}) => {
  const read = spawnGitLimited(["-C", root, "ls-remote", "--tags", "origin"], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...(timeoutMs ? { timeout: timeoutMs } : {}),
  });
  if (read.status !== 0)
    throw new Error(
      `git ls-remote --tags origin failed: ${failureOf(read, `ended by ${read.signal}`)}`,
    );
  const rows = read.stdout.trim();
  const tags = new Map();
  for (const row of rows.split("\n").filter(Boolean)) {
    const [object, ref] = row.split(/\s+/);
    const peeled = /\^\{\}$/.test(ref);
    const name = ref.replace(/^refs\/tags\//, "").replace(/\^\{\}$/, "");
    const prior = tags.get(name) ?? { name };
    tags.set(
      name,
      peeled
        ? { ...prior, target: object, annotated: true }
        : { ...prior, object, target: prior.target ?? object },
    );
  }
  return tags;
};
export const localTags = (root) => {
  const rows = runGit(root, [
    "for-each-ref",
    "--format=%(refname:strip=2)%00%(objecttype)%00%(objectname)%00%(*objectname)%00%(taggerdate:unix)",
    "refs/tags",
  ]);
  return new Map(
    rows
      .split("\n")
      .filter(Boolean)
      .map((row) => {
        const [name, objectType, object, peeled, seconds] = row.split("\0");
        const taggedAt = /^-?\d+$/.test(seconds)
          ? Number(seconds) * 1000
          : undefined;
        return [
          name,
          { name, objectType, object, target: peeled || object, taggedAt },
        ];
      }),
  );
};
export const tagContents = (root, tag) =>
  runGit(root, ["cat-file", "-p", `refs/tags/${tag}`], { trim: false });
const annotationFromObject = (object, tag) => {
  const boundary = object.indexOf("\n\n");
  if (boundary < 0) throw new Error(`${tag} is not an annotated tag object`);
  return object.slice(boundary + 2);
};
export const tagAnnotation = (root, tag) =>
  annotationFromObject(tagContents(root, tag), tag);
// A starter refresh tag describes core's export, not an instance release.
// Judge the annotation the refresh writes; a lightweight or retagged object
// remains an ordinary tag and cannot silently disappear from the baseline.
export const isStarterTag = (root, name, tag, annotations) => {
  if (tag.objectType !== "tag") return false;
  const annotation = annotations
    ? annotations.get(name)
    : tagAnnotation(root, name);
  return (
    typeof annotation === "string" &&
    annotation.startsWith(`Starter ${name}\n\n`) &&
    /^Core commit: (?:[a-f0-9]{40}|[a-f0-9]{64})$/mu.test(annotation)
  );
};
export const humanLayerFromAnnotation = (annotation) => {
  const marker = annotation.lastIndexOf("\n\nDOTLN-MANIFEST-BEGIN\n");
  if (marker >= 0 && /\nDOTLN-MANIFEST-END\n?$/.test(annotation.slice(marker)))
    return annotation.slice(0, marker);
  return annotation.endsWith("\n") ? annotation.slice(0, -1) : annotation;
};
export const humanLayerFromTag = (root, tag) =>
  humanLayerFromAnnotation(tagAnnotation(root, tag));
export const isDotLnRelease = (annotation, tag) => {
  const firstLine = annotation.split("\n", 1)[0];
  const suffix = ` ${tag}`;
  return (
    firstLine === `DotLn ${tag}` ||
    firstLine.startsWith(`DotLn ${tag} — `) ||
    (firstLine.endsWith(suffix) &&
      validReleaseDisplayName(firstLine.slice(0, -suffix.length)) &&
      annotation.includes("\n\nDOTLN-MANIFEST-BEGIN\n"))
  );
};
export const manifestFromAnnotation = (annotation, tag) => {
  const beginMarker = "DOTLN-MANIFEST-BEGIN\n";
  const endMarker = "\nDOTLN-MANIFEST-END";
  const begin = annotation.lastIndexOf(beginMarker);
  const end = annotation.endsWith(`${endMarker}\n`)
    ? annotation.length - `${endMarker}\n`.length
    : annotation.endsWith(endMarker)
      ? annotation.length - endMarker.length
      : -1;
  if (begin < 0 || end < begin + beginMarker.length)
    throw new Error(`${tag} does not contain a DotLn release manifest`);
  try {
    return parseJson(
      annotation.slice(begin + beginMarker.length, end),
      `${tag} release manifest`,
    );
  } catch {
    throw new Error(`${tag} contains invalid manifest JSON`);
  }
};
export const manifestFromTag = (root, tag) =>
  manifestFromAnnotation(tagAnnotation(root, tag), tag);
export const historicalWorkOrders = (root, tag) => {
  if (tag !== "v0.2.0") return [];
  const path = docPath(root, "releases", "v0.2.0.md");
  if (!existsSync(path)) return [];
  return [
    ...new Set(
      [...readFileSync(path, "utf8").matchAll(/\bWO-\d{3}\b/g)].map(
        (match) => match[0],
      ),
    ),
  ];
};

// Shared attribution for manifest-bearing releases. Preserve manifest order;
// consumers may sort their own presentation without inventing another parser.
// A changed-file list that is not a list, or an entry that is not a path,
// attributes nothing, as an unreadable manifest does.
export const manifestWorkOrders = (manifest, root) => {
  const reviews = root
    ? rootPattern(root, "finalReviews")
    : defaultDocRelative("finalReviews");
  const attributed = new RegExp(`^${reviews}/(WO-\\d{3})/`);
  return [
    ...new Set([
      ...(typeof manifest?.workOrder?.id === "string" &&
      /^WO-\d{3}$/.test(manifest.workOrder.id)
        ? [manifest.workOrder.id]
        : []),
      ...(Array.isArray(manifest?.notes?.changedFiles)
        ? manifest.notes.changedFiles
        : []
      ).flatMap((path) => {
        const match = typeof path === "string" ? attributed.exec(path) : null;
        return match ? [match[1]] : [];
      }),
    ]),
  ];
};

// Immutable tag objects are read together: release history must not add several
// subprocesses per tag to the harness's timed lifecycle dispatch.
export const releaseAnnotations = (root, tags) => {
  const selected = [...tags].filter(
    ({ name, objectType }) => semver(name) && objectType === "tag",
  );
  if (!selected.length) return new Map();
  const objects = readGitObjects(
    root,
    selected.map(({ object }) => object),
    "tag",
  );
  return new Map(
    selected.map(({ name, object }) => [
      name,
      annotationFromObject(objects.get(object).toString("utf8"), name),
    ]),
  );
};
export const releaseTagsFrom = (tags, annotations) =>
  [...tags]
    .filter(({ name, objectType }) => semver(name) && objectType === "tag")
    .sort((left, right) => compareVersions(left.name, right.name))
    .filter(({ name }) => isDotLnRelease(annotations.get(name), name));

export const localReleaseTags = (root) => {
  const tags = [...localTags(root).values()];
  return releaseTagsFrom(tags, releaseAnnotations(root, tags));
};

// Attribution is a local tag read; it must not require the gate runtime.
export const localReleaseRecords = (root, snapshot) => {
  const tags = localTags(root);
  for (const expected of snapshot ?? []) {
    const actual = tags.get(expected.name);
    if (
      !actual ||
      actual.objectType !== "tag" ||
      actual.object !== expected.object
    )
      throw new Error(
        `missing or changed recorded release tag: ${expected.name}`,
      );
  }
  const selected = snapshot && new Set(snapshot.map(({ name }) => name));
  const selectedTags = [...tags.values()].filter(
    ({ name }) => !selected || selected.has(name),
  );
  const annotations = releaseAnnotations(root, selectedTags);
  const records = releaseTagsFrom(selectedTags, annotations).map((tag) => {
    // The sole pre-manifest edition has a reviewed repository record.
    const annotation = annotations.get(tag.name);
    const historical =
      tag.name === "v0.2.0" && !annotation.includes("DOTLN-MANIFEST-BEGIN");
    const manifest = historical
      ? undefined
      : manifestFromAnnotation(annotation, tag.name);
    if (
      !historical &&
      (!manifest ||
        typeof manifest !== "object" ||
        Array.isArray(manifest) ||
        manifest.release?.application !== tag.name ||
        !/^WO-\d{3}$/.test(manifest.workOrder?.id) ||
        !Array.isArray(manifest.notes?.changedFiles) ||
        !manifest.notes.changedFiles.every((path) => typeof path === "string"))
    )
      throw new Error(`${tag.name} contains malformed release attribution`);
    const workOrders = historical
      ? historicalWorkOrders(root, tag.name)
      : manifestWorkOrders(manifest, root);
    if (historical && workOrders.length === 0)
      throw new Error(
        "v0.2.0 requires docs/releases/v0.2.0.md historical attribution",
      );
    const controlSegments = snapshot?.find(
      ({ name }) => name === tag.name,
    )?.controlSegments;
    return {
      ...tag,
      manifest,
      workOrders,
      historical,
      ...(controlSegments === undefined ? {} : { controlSegments }),
    };
  });
  if (snapshot && records.length !== snapshot.length)
    throw new Error("recorded tag snapshot contains a non-release tag");
  return records;
};
