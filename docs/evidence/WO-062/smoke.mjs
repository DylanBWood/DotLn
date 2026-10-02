#!/usr/bin/env node
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  canonicalStringify,
  decodeSourceBundle,
  resolveSourceSpan,
} from "@dotln/compiler";
import { fetchIssueBundle } from "../../../packages/skeleton/dist/src/github-issue-source.js";
import { executeGh } from "../../../scripts/lib/github-repository.mjs";

const options = new Map();
const args = process.argv.slice(2);
while (args.length) {
  const key = args.shift(),
    value = args.shift();
  if (
    !["--issue", "--store", "--record"].includes(key) ||
    !value ||
    options.has(key)
  )
    throw new Error(
      "usage: node docs/evidence/WO-062/smoke.mjs --issue <public-issue-url> --store <directory> [--record <json-file>]",
    );
  options.set(key, value);
}
if (!options.get("--issue") || !options.get("--store"))
  throw new Error("--issue and --store are required");
const url = new URL(options.get("--issue"));
const match = /^\/([^/]+)\/([^/]+)\/issues\/([1-9]\d*)\/?$/u.exec(url.pathname);
if (
  !match ||
  url.protocol !== "https:" ||
  url.username ||
  url.password ||
  url.port ||
  url.search
)
  throw new Error("expected a public HTTPS issue URL");
const [, owner, name, number] = match;
const namedComment = url.hash
  ? /^#issuecomment-([1-9]\d*)$/u.exec(url.hash)?.[1]
  : undefined;
if (url.hash && !namedComment) throw new Error("unsupported issue fragment");
const repo = `https://${url.hostname}/${owner}/${name}`;
const cwd = process.cwd();
function json(args) {
  const result = executeGh(cwd, args, { maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0)
    throw new Error("read-only smoke metadata request failed");
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error("read-only smoke metadata is not JSON");
  }
}
const metadata = json([
  "api",
  "graphql",
  "--hostname",
  url.hostname,
  "-f",
  "query=query($owner: String!, $name: String!, $number: Int!) { repository(owner: $owner, name: $name) { isPrivate issue(number: $number) { number comments { totalCount } } } }",
  "-f",
  `owner=${owner}`,
  "-f",
  `name=${name}`,
  "-F",
  `number=${number}`,
]);
if (
  metadata.errors?.length ||
  metadata.data?.repository?.isPrivate !== false ||
  metadata.data.repository.issue?.number !== Number(number)
)
  throw new Error("smoke requires the named issue in a public repository");
let commentId;
if (namedComment) {
  const comment = json([
    "api",
    `repos/${owner}/${name}/issues/comments/${namedComment}`,
    "--hostname",
    url.hostname,
  ]);
  if (
    typeof comment.node_id !== "string" ||
    comment.issue_url !==
      `https://api.${url.hostname}/repos/${owner}/${name}/issues/${number}`
  )
    throw new Error("named comment does not identify this issue");
  commentId = `node:${createHash("sha256").update(comment.node_id).digest("hex")}`;
}
console.log(
  "Fetching the public issue twice; source text and identifiers stay in the caller's local store.",
);
const store = resolve(options.get("--store"));
const start = performance.now();
const one = await fetchIssueBundle(repo, Number(number), {
  directory: store,
  cwd,
});
console.log(
  `First fetch: ${one.bundle.discussion.length} retained comments, ${one.receipt.refused.length} refusals.`,
);
const two = await fetchIssueBundle(repo, Number(number), {
  directory: store,
  cwd,
});
const stable = one.hash === two.hash;
let spanCount = 0;
for (const item of [...one.bundle.sections, ...one.bundle.discussion]) {
  if (resolveSourceSpan(one.bundle, item.span) !== item.text)
    throw new Error("source span did not resolve");
  spanCount++;
}
for (const revision of one.bundle.revisions)
  for (const span of revision.changedSpans) {
    resolveSourceSpan(one.bundle, span);
    spanCount++;
  }
for (const image of one.receipt.imageReferences) {
  resolveSourceSpan(one.bundle, image.referencedBy);
  spanCount++;
}
const version = executeGh(cwd, ["--version"]);
const record = {
  schemaVersion: 1,
  recordedAt: new Date().toISOString(),
  runner:
    "executor repair; codex-cli 0.160.0; gpt-6-astra; max; codex-session-readback",
  node: process.version,
  gh: /gh version (\d+\.\d+\.\d+)/u.exec(version.stdout)?.[1] ?? "unknown",
  operation:
    "read-only public issue fetch; no forge mutation or model invocation",
  target: {
    repository: `${url.hostname}/<owner>/<public-repository>`,
    issue: "positive-integer",
    namedComment: namedComment ? "issuecomment-positive-integer" : null,
    public: true,
  },
  fetches: 2,
  wallSeconds: (performance.now() - start) / 1000,
  hashShape: /^fnv1a64:[0-9a-f]{16}$/u.test(one.hash)
    ? "fnv1a64:hex-16"
    : "unexpected",
  hashStable: stable,
  receiptStable:
    canonicalStringify(one.receipt) === canonicalStringify(two.receipt),
  bundleDecodes: decodeSourceBundle(one.bundle, {
    allowedHosts: [url.hostname],
  }).ok,
  revisionShape: /^\d{4}-\d{2}-\d{2}T/u.test(one.bundle.revisionId)
    ? "UTC-timestamp"
    : "unexpected",
  status: one.status,
  sections: one.bundle.sections.length,
  currentSectionsOnly: one.bundle.sections.every((item) =>
    ["title", "body"].includes(item.id),
  ),
  historyTextFree: one.receipt.history.every((item) =>
    Object.keys(item).every((key) =>
      ["id", "editedAt", "subjectId"].includes(key),
    ),
  ),
  retainedComments: one.bundle.discussion.length,
  sourceCommentCount: metadata.data.repository.issue.comments.totalCount,
  namedCommentObserved:
    commentId === undefined
      ? null
      : one.bundle.discussion.some((item) => item.id === commentId) ||
        one.receipt.refused.some((item) => item.id === commentId) ||
        one.receipt.omitted.some((item) => item.id === commentId),
  omittedComments: one.receipt.omitted.length,
  refusals: one.receipt.refused.length,
  refusalShapes: [
    ...new Set(one.receipt.refused.map((item) => item.shape)),
  ].sort(),
  absentFields: one.receipt.absent.length,
  editRecords: one.receipt.history.length,
  imageReferences: one.receipt.imageReferences.length,
  imageByteHashes: "not supplied by the declared API fields",
  spansResolved: spanCount,
};
writeFileSync(
  resolve(options.get("--record") ?? "docs/evidence/WO-062/smoke.json"),
  JSON.stringify(record, null, 2) + "\n",
  { flag: "wx" },
);
console.log(
  `Recorded two fetches: hashStable=${stable}, status=${one.status}; ${spanCount} spans resolved.`,
);
if (
  !stable ||
  !record.receiptStable ||
  !record.bundleDecodes ||
  !record.currentSectionsOnly ||
  !record.historyTextFree ||
  record.namedCommentObserved === false
)
  process.exitCode = 1;
