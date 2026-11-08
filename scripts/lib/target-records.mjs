import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix } from "node:path";
import { loadConfig } from "./config.mjs";
import { eventsForOrder } from "./control-store.mjs";
import {
  mainWorktree,
  porcelainEntries,
  porcelainEntryName,
  runGit,
  runGitPathList,
} from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  launchpadInvocation,
  movedSourceStat,
  reviewedTargetSubject,
  targetRecordSources,
  targetWorktreeForOrder,
  readTargetOperation,
  recordTargetOperation,
  forgetTargetOperation,
} from "./target-worktrees.mjs";
import { checkLocalTerms } from "./terms.mjs";
import { privatePathLines } from "./private-paths.mjs";
import { checkOutwardArtifact } from "../outward-lint.mjs";
import {
  decodeCharacterReferences,
  markdownLinks,
  markdownNodes,
  parseMarkdown,
} from "./markdown-links.mjs";

// Publication reads the record sources through this module.
export { targetRecordSources };

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const refuse = (reason) => new Error(`target records refused: ${reason}`);

/** The `href` and `src` attributes of the tags in raw HTML, comments left
 * out and attribute names read whole, so `data-src` is no link; each value's
 * character references decode as a browser decodes them before it follows
 * the link, through the document check's own decoder. */
const htmlLinkTargets = (html) =>
  [
    ...html
      .replace(/<!--[\s\S]*?(?:-->|$)/gu, " ")
      .matchAll(
        /<[A-Za-z][\w:-]*((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*\/?>/gu,
      ),
  ].flatMap(([, attributes]) =>
    [
      ...attributes.matchAll(
        /\s+([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/gu,
      ),
    ]
      .filter(
        ([, name, ...values]) =>
          /^(?:href|src)$/iu.test(name) &&
          values.some((value) => value !== undefined),
      )
      .map(([, , double, single, bare]) =>
        decodeCharacterReferences(double ?? single ?? bare),
      ),
  );
/** Every link destination a record's reader can follow: its Markdown links
 * and the `href` and `src` attributes of the raw HTML it carries. */
export const recordLinkTargets = (text) => [
  ...markdownLinks(text).map(({ href }) => href),
  ...[...markdownNodes(parseMarkdown(text))]
    .filter((node) => node.type === "html")
    .flatMap((node) => htmlLinkTargets(node.value)),
];

/**
 * What a filing needs committed at the launchpad's HEAD, which its footer
 * names: each source, and every file a source's relative links reach, read
 * at its literal path. Returns the sources that differ from HEAD (untracked,
 * staged or edited) and the link destinations HEAD lacks or whose working
 * copy differs from it, each named by its launchpad path.
 */
export function uncommittedRecordInputs(root, sources) {
  const read = (args, options) =>
    runGit(root, [...HOST_GIT_READ, ...args], { raw: true, ...options });
  const changed = sources.filter(
    (source) =>
      read(["ls-files", "--error-unmatch", "--", source]).status !== 0 ||
      read(["diff", "--quiet", "HEAD", "--", source]).status !== 0,
  );
  // A reader follows the literal path from the footer's commit; the move
  // map only the local document check reads does not apply there.
  const destinations = new Set();
  for (const source of sources) {
    if (!source.endsWith(".md")) continue;
    let text;
    try {
      text = readFileSync(join(root, source), "utf8");
    } catch {
      continue;
    }
    for (const href of recordLinkTargets(text)) {
      if (/^[a-z][a-z0-9+.-]*:|^\/\/|^#/iu.test(href)) continue;
      let pathname;
      try {
        pathname = decodeURIComponent(href.split("#")[0].split("?")[0]);
      } catch {
        continue;
      }
      if (!pathname) continue;
      const path = posix.normalize(
        pathname.startsWith("/")
          ? pathname.replace(/^\/+/u, "")
          : posix.join(posix.dirname(source), pathname),
      );
      if (!path.startsWith("../") && path !== "..") destinations.add(path);
    }
  }
  const listed = [...destinations].sort();
  const checked = listed.length
    ? read(["cat-file", "--batch-check"], {
        input: listed.map((path) => `HEAD:${path}`).join("\n") + "\n",
        encoding: "utf8",
      })
        .stdout.split("\n")
        .slice(0, listed.length)
    : [];
  const missing = listed.filter((_, index) =>
    / missing$/u.test(checked[index] ?? ""),
  );
  // A destination HEAD holds whose working copy differs (edited or staged)
  // would resolve at the footer's commit to older bytes than the record read.
  const present = listed.filter((path) => !missing.includes(path));
  const edited = present.length
    ? runGit(
        root,
        [
          ...HOST_GIT_READ,
          "diff",
          "--name-only",
          "-z",
          "HEAD",
          "--",
          ...present.map((path) => `:(literal)${path}`),
        ],
        { trim: false },
      )
        .split("\0")
        .filter(Boolean)
    : [];
  return { sources: changed, links: [...missing, ...edited].sort() };
}

/** Check even existing ancestors: lexical containment alone admits symlinks. */
export function targetRecordDestination(target, path) {
  if (
    typeof path !== "string" ||
    path.startsWith("/") ||
    path.includes("\\") ||
    posix.normalize(path) !== path ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  )
    throw refuse(`path escapes the documentation root: ${path}`);
  let current = target;
  const parts = path.split("/");
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatSync(current, { throwIfNoEntry: false });
    if (!stat) continue;
    if (
      stat.isSymbolicLink() ||
      (index === parts.length - 1 ? !stat.isFile() : !stat.isDirectory())
    )
      throw refuse(`${path}: destination is not a contained regular file`);
  }
  return current;
}

/** Publication rechecks both the one-parent commit and every recorded blob. */
export function validateTargetRecordsCommit(
  target,
  subject,
  records,
  repository,
) {
  if (
    !records ||
    records.repositoryId !== subject.repositoryId ||
    records.branch !== subject.branch ||
    records.parent !== subject.commit ||
    records.root !== repository.documentationRoot
  )
    throw refuse(
      "records binding differs from the reviewed target or registered documentation root",
    );
  const git = (...args) => runGit(target, [...HOST_GIT_READ, ...args]);
  if (
    git("rev-list", "--parents", "-n", "1", records.commit) !==
    `${records.commit} ${subject.commit}`
  )
    throw refuse(
      "records commit must have the reviewed target as its single parent",
    );
  const paths = new Set(records.records.map((record) => record.path));
  const changed = runGitPathList(target, [
    ...HOST_GIT_READ,
    "diff",
    "--raw",
    "--no-renames",
    "--no-ext-diff",
    "--no-textconv",
    "-z",
    subject.commit,
    records.commit,
    "--",
  ]);
  const invalid = [];
  for (let index = 0; index < changed.length; index += 2) {
    const metadata = changed[index],
      path = changed[index + 1];
    const match = /^:(\d+) (\d+) [a-f0-9]+ [a-f0-9]+ ([AM])$/u.exec(metadata);
    if (
      !paths.has(path) ||
      !path.startsWith(`${records.root}/`) ||
      !match ||
      match[2] !== "100644" ||
      !["000000", "100644"].includes(match[1])
    )
      invalid.push(path);
  }
  if (invalid.length)
    throw refuse(
      `records commit changes unrecorded paths or modes: ${invalid.join(", ")}`,
    );
  for (const record of records.records) {
    if (!record.path.startsWith(`${records.root}/`))
      throw refuse(`record outside documentation root: ${record.path}`);
    const tree = git(
      "ls-tree",
      "--format=%(objectmode) %(objecttype) %(objectname)",
      records.commit,
      "--",
      `:(literal)${record.path}`,
    );
    const object = /^100644 blob ([a-f0-9]{40}|[a-f0-9]{64})$/u.exec(tree);
    if (
      !object ||
      hash(
        runGit(target, [...HOST_GIT_READ, "cat-file", "blob", object[1]], {
          encoding: null,
          trim: false,
        }),
      ) !== record.sha256
    )
      throw refuse(`recorded bytes differ: ${record.path}`);
  }
}

/** Resume only our exact partial record writes; unrelated changes stay protected. */
export function verifyPendingRecordChanges(target, records) {
  const expected = new Map(records.map((row) => [row.path, row.sha256]));
  const entries = porcelainEntries(
    runGitPathList(target, [
      ...HOST_GIT_READ,
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
    ]),
  );
  for (const entry of entries) {
    const { status, path, origin } = entry,
      destination = targetRecordDestination(target, path);
    const stat = lstatSync(destination, { throwIfNoEntry: false });
    if (
      origin !== undefined ||
      !/^(?:[ AM]{2}|\?\?)$/u.test(status) ||
      !expected.has(path) ||
      !stat?.isFile() ||
      stat.mode & 0o111 ||
      hash(readFileSync(destination)) !== expected.get(path)
    )
      throw refuse(
        `pending operation has changed or unrelated input: ${porcelainEntryName(entry)}`,
      );
  }
}

export function commitTargetRecords(root, state, control) {
  if (state.phase !== "closed" || !state.targetSubject)
    throw refuse("a passing final review with targetSubject is required");
  const entry = targetWorktreeForOrder(root, state.workOrderId);
  const repository = loadConfig(root).repositories[state.repositoryId];
  const sources = targetRecordSources(
    root,
    state,
    eventsForOrder(control, state.workOrderId),
  );
  const pending = readTargetOperation(root, "records", state.workOrderId);
  const movedSources = (records) =>
    sources
      .filter((row) => row.kind !== "order")
      .map((row) => ({
        source: row.source,
        path: row.path,
        sha256: records.find((record) => record.path === row.path)?.sha256,
      }));
  // A record moved into the target keeps its bytes and gains one provenance
  // footer naming the launchpad by its release display name, the launchpad
  // commit at filing and the record's path there, so a relative link that
  // resolves to nothing in the target has a line saying where it resolves.
  // The display name is the launchpad's public name: a target may be public
  // while the launchpad's address is private. The commit is the launchpad's
  // HEAD when the operation began, kept in the pending operation, so a
  // retried filing writes the same bytes; the filing refuses until every
  // source and every file its links reach is committed there, so the commit
  // the footer names holds them all.
  const config = loadConfig(root);
  const declaredName = config.present
    ? JSON.parse(readFileSync(config.path, "utf8")).release?.displayName
    : undefined;
  const launchpadName = config.release?.displayName ?? "DotLn";
  if (declaredName === undefined)
    console.warn(
      `DotLn advisory: release.displayName is unset, so the provenance footer names the launchpad ${launchpadName}, the kit's own name; declare the instance's release.displayName in dotln.config.json to name it.`,
    );
  const launchpadCommit =
    pending?.binding?.launchpadCommit ??
    runGit(root, [...HOST_GIT_READ, "rev-parse", "HEAD"]);
  // A filing begun under the earlier footer resumes with the footer it began
  // with, whose bytes its saved operation hashes; a new filing writes the
  // current one and saves its version.
  const footerVersion = pending ? (pending.binding?.footer ?? 1) : 2;
  const provenanceFooter = (source) =>
    Buffer.from(
      provenanceFooterText(
        launchpadName,
        launchpadCommit,
        source,
        footerVersion,
      ),
      "utf8",
    );
  if (state.targetRecords) {
    const observed = reviewedTargetSubject(root, state);
    if (observed.commit !== state.targetRecords.commit)
      throw refuse(
        `target commit ${observed.commit} differs from recorded records commit ${state.targetRecords.commit}`,
      );
    validateTargetRecordsCommit(
      entry.target,
      state.targetSubject,
      state.targetRecords,
      repository,
    );
    return {
      payload: state.targetRecords,
      already: true,
      moved: movedSources(state.targetRecords.records),
    };
  }
  if (
    state.documentationRoot &&
    state.documentationRoot !== repository.documentationRoot
  )
    throw refuse("registered documentation root differs from the activation");
  // The ordinary path checks cleanliness before inspecting destinations.
  const observed = pending ? undefined : reviewedTargetSubject(root, state);
  if (observed && observed.commit !== state.targetSubject.commit)
    throw refuse(
      `target commit ${observed.commit} differs from reviewed commit ${state.targetSubject.commit}`,
    );
  const rows = sources.map((row) => {
    const source = join(root, row.source);
    if (!containedRegularFile(source, root))
      throw refuse(`${row.source}: source is not a contained regular file`);
    const bytes = readFileSync(source),
      sha256 = hash(bytes);
    if (
      row.expectedHash !== undefined &&
      row.expectedHash !== `sha256:${sha256}`
    )
      throw refuse(`${row.source}: report hash differs from its recorded hash`);
    if (
      ["verification", "final-review"].includes(row.kind) &&
      !row.expectedHash
    )
      throw refuse(`${row.source}: report has no recorded hash`);
    const destination = targetRecordDestination(entry.target, row.path);
    const stat = lstatSync(destination, { throwIfNoEntry: false });
    // The filed bytes are the source's with the footer; the recorded hash is
    // the filed bytes', which the target's commit check reads back. The
    // screens below read the source bytes: the footer is the kit's own frame,
    // naming the record's path and the launchpad's public name.
    const filed = Buffer.concat([bytes, provenanceFooter(row.source)]);
    if (stat && (!readFileSync(destination).equals(filed) || stat.mode & 0o111))
      throw refuse(
        `${row.path}: destination already holds different bytes or mode`,
      );
    return {
      ...row,
      bytes: filed,
      sourceBytes: bytes,
      sha256: hash(filed),
      destination,
    };
  });
  const binding = {
    repositoryId: state.repositoryId,
    branch: state.targetSubject.branch,
    parent: state.targetSubject.commit,
    launchpadCommit,
    ...(footerVersion === 1 ? {} : { footer: footerVersion }),
    root: repository.documentationRoot,
    records: rows.map(({ kind, path, sha256 }) => ({ kind, path, sha256 })),
  };
  if (
    pending &&
    (pending.target !== entry.target ||
      JSON.stringify(pending.binding) !== JSON.stringify(binding))
  )
    throw refuse(
      "pending records differ from the current review or source bytes",
    );
  const main = mainWorktree(root);
  // The source bytes and the display name the footer carries are screened;
  // the record's own path and the commit are the kit's frame.
  const footerSurface = "release.displayName (the provenance footer)";
  if (
    checkLocalTerms(main, [
      ...rows.map((row) => ({
        name: row.source,
        text: row.sourceBytes.toString("utf8"),
      })),
      { name: footerSurface, text: launchpadName },
    ]).status !== "present"
  )
    throw refuse("local-terms list absent");
  if (privatePathLines(`${footerSurface}.md`, launchpadName)[0] !== undefined)
    throw refuse(
      `${footerSurface}: names a private absolute path, which every filed record would carry; declare a public release.displayName`,
    );
  for (const row of rows) {
    const [line] = privatePathLines(row.path, row.sourceBytes.toString("utf8"));
    if (line !== undefined)
      throw refuse(
        `${row.path}:${line}: private absolute path; write a repository-relative path or a placeholder such as <home>/, <worktree>/ or <tmp>/`,
      );
  }
  // The kit's own fixed message is a target commit: identifiers would refuse,
  // and a review word an instance happens to list is the kit's word, not a
  // review item for the publish.
  const message = "docs: record reviewed change and validation";
  const lint = checkOutwardArtifact(main, {
    kind: "commit",
    text: message,
    target: true,
  });
  if (!["pass", "review"].includes(lint.status))
    throw refuse(
      `record commit outward lint ${lint.status}: ${lint.findings.map((row) => row.rule).join(", ")}`,
    );
  // The first filing reads the sources and their links at HEAD, after every
  // byte, path and term screen: what the footer's commit does not hold, a
  // reader of the launchpad could not open.
  if (!pending) {
    const missing = uncommittedRecordInputs(
      root,
      sources.map((row) => row.source),
    );
    if (missing.sources.length || missing.links.length)
      throw refuse(
        `${[
          ...missing.sources.map((path) => `${path} is not committed`),
          ...missing.links.map(
            (path) => `${path}, which a record links, is not committed`,
          ),
        ].join(
          "; ",
        )} at the launchpad's HEAD; commit the instance records first (the order's records and evidence, as one commit on the order branch), then rerun ${launchpadInvocation(root, "resume")} target-records <actor flags>, and the footer names that commit`,
      );
  }
  runGit(entry.target, [...HOST_GIT_READ, "var", "GIT_AUTHOR_IDENT"]);
  if (pending) verifyPendingRecordChanges(entry.target, binding.records);
  // Permit only byte-checked partial writes from the saved operation when
  // validating the registered root, branch and ancestry on a retry.
  const current = reviewedTargetSubject(root, state, {
    pendingRecordPaths: pending ? binding.records.map((row) => row.path) : [],
  });
  if (current.commit === binding.parent) {
    recordTargetOperation(root, "records", state.workOrderId, {
      target: entry.target,
      binding,
    });
    for (const row of rows) {
      mkdirSync(dirname(row.destination), { recursive: true });
      writeFileSync(row.destination, row.bytes);
    }
    runGit(entry.target, [
      ...HOST_GIT_READ,
      "add",
      "--",
      ...rows.map((row) => `:(literal)${row.path}`),
    ]);
    runGit(entry.target, [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "core.fsmonitor=false",
      "commit",
      "--allow-empty",
      "-qm",
      message,
    ]);
  } else if (!pending) {
    throw refuse(
      `target commit ${current.commit} differs from reviewed commit ${binding.parent}`,
    );
  } else {
    reviewedTargetSubject(root, state);
  }
  const payload = {
    ...binding,
    commit: runGit(entry.target, [...HOST_GIT_READ, "rev-parse", "HEAD"]),
  };
  validateTargetRecordsCommit(
    entry.target,
    state.targetSubject,
    payload,
    repository,
  );
  return { payload, moved: movedSources(payload.records) };
}

/** The provenance footer a filed record ends with. */
// Each footer a filing has written, by the version its saved operation
// records: version 1 named the launchpad tree at filing, version 2 the commit
// at which the record's links resolve. The opening words are shared, so the
// read-back check below recognizes a record filed under either.
export const provenanceFooterText = (name, commit, source, version = 2) =>
  version === 1
    ? `\n\nFiled from the launchpad ${name} (its tree at commit ${commit}); this record's launchpad path was ${source}, and its relative links resolve against that path there, not in this repository.\n`
    : `\n\nFiled from the launchpad ${name} at commit ${commit}, where this record's path was ${source}: its relative links resolve at that commit on the launchpad, whose order branch history the launchpad records publish pushes, and not in this repository.\n`;

/** Whether this source's bytes with the provenance footer after them are the
 * filed record the recorded hash names: rebuilt from the pending operation's
 * commit and the launchpad's display name when the operation is still
 * recorded, else read back from the target worktree. */
const filedWithFooter = (
  root,
  workOrderId,
  source,
  recordPath,
  bytes,
  sha256,
) => {
  if (!recordPath) return false;
  const pending = readTargetOperation(root, "records", workOrderId);
  if (pending?.binding?.launchpadCommit) {
    const name = loadConfig(root).release?.displayName ?? "DotLn";
    const rebuilt = Buffer.concat([
      bytes,
      Buffer.from(
        provenanceFooterText(
          name,
          pending.binding.launchpadCommit,
          source,
          pending.binding.footer ?? 1,
        ),
        "utf8",
      ),
    ]);
    if (hash(rebuilt) === sha256) return true;
  }
  try {
    const entry = targetWorktreeForOrder(root, workOrderId);
    const filed = readFileSync(
      targetRecordDestination(entry.target, recordPath),
    );
    return (
      hash(filed) === sha256 &&
      filed.length > bytes.length &&
      filed.subarray(0, bytes.length).equals(bytes) &&
      /^\n\nFiled from the launchpad /u.test(
        filed.subarray(bytes.length).toString("utf8"),
      )
    );
  } catch {
    return false;
  }
};

export function removeMovedTargetRecords(root, paths, workOrderId) {
  const present = [];
  // Check the complete removal set before deleting any remaining source: a
  // source matches its record by the recorded hash, or by the filed bytes
  // when the record carries the provenance footer.
  for (const { source, path: recordPath, sha256 } of paths ?? []) {
    const path = join(root, source);
    if (!movedSourceStat(path)) continue;
    const bytes = containedRegularFile(path, root) ? readFileSync(path) : null;
    if (
      bytes === null ||
      (hash(bytes) !== sha256 &&
        !filedWithFooter(root, workOrderId, source, recordPath, bytes, sha256))
    )
      throw refuse(
        `${source}: moved source differs from its recorded bytes; source retained. The target's records commit holds the recorded bytes: move the changed file out of the launchpad or restore those bytes, then rerun ${launchpadInvocation(root, "resume")} target-records <actor flags> to finish removing the moved sources`,
      );
    present.push(path);
  }
  for (const path of present) rmSync(path);
  forgetTargetOperation(root, "records", workOrderId);
}
