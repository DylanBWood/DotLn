import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runGit } from "./git.mjs";
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
export const tagAnnotation = (root, tag) => {
  const object = tagContents(root, tag);
  const boundary = object.indexOf("\n\n");
  if (boundary < 0) throw new Error(`${tag} is not an annotated tag object`);
  return object.slice(boundary + 2);
};
export const humanLayerFromTag = (root, tag) => {
  const annotation = tagAnnotation(root, tag);
  const marker = annotation.lastIndexOf("\n\nDOTLN-MANIFEST-BEGIN\n");
  if (marker >= 0 && /\nDOTLN-MANIFEST-END\n?$/.test(annotation.slice(marker)))
    return annotation.slice(0, marker);
  return annotation.endsWith("\n") ? annotation.slice(0, -1) : annotation;
};
export const isDotLnRelease = (humanLayer, tag) => {
  const firstLine = humanLayer.split("\n", 1)[0];
  return (
    firstLine === `DotLn ${tag}` || firstLine.startsWith(`DotLn ${tag} — `)
  );
};
export const manifestFromTag = (root, tag) => {
  const annotation = tagAnnotation(root, tag);
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
export const historicalWorkOrders = (root, tag) => {
  if (tag !== "v0.2.0") return [];
  const path = join(root, "docs/releases/v0.2.0.md");
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
export const manifestWorkOrders = (manifest) => [
  ...new Set([
    ...(/^WO-\d{3}$/.test(manifest?.workOrder?.id)
      ? [manifest.workOrder.id]
      : []),
    ...(manifest?.notes?.changedFiles ?? []).flatMap((path) => {
      const match = /^docs\/final-reviews\/(WO-\d{3})\//.exec(path);
      return match ? [match[1]] : [];
    }),
  ]),
];

const releaseTagsFrom = (root, tags) =>
  [...tags]
    .filter(({ name, objectType }) => semver(name) && objectType === "tag")
    .sort((left, right) => compareVersions(left.name, right.name))
    .filter(({ name }) => isDotLnRelease(humanLayerFromTag(root, name), name));

export const localReleaseTags = (root) =>
  releaseTagsFrom(root, localTags(root).values());

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
  const records = releaseTagsFrom(
    root,
    [...tags.values()].filter(({ name }) => !selected || selected.has(name)),
  ).map((tag) => {
    // The sole pre-manifest edition has a reviewed repository record.
    const annotation = tagAnnotation(root, tag.name);
    const historical =
      tag.name === "v0.2.0" && !annotation.includes("DOTLN-MANIFEST-BEGIN");
    const manifest = historical ? undefined : manifestFromTag(root, tag.name);
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
      : manifestWorkOrders(manifest);
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
