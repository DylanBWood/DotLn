import { spawnGit, runGit } from "./git.mjs";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const failure =
  "origin must identify exactly one matching GitHub HOST/OWNER/REPO fetch and push target";
export const HOST_GIT_READ = [
  "-c",
  "core.hooksPath=/dev/null",
  "-c",
  "core.fsmonitor=false",
  "-c",
  "log.showSignature=false",
  "-c",
  "gpg.program=/usr/bin/false",
  "-c",
  "gpg.ssh.program=/usr/bin/false",
];

const remoteUrls = (root, push) => {
  const resolved = spawnGit(
    [
      "-C",
      root,
      ...HOST_GIT_READ,
      "remote",
      "get-url",
      ...(push ? ["--push"] : []),
      "--all",
      "origin",
    ],
    { encoding: "utf8" },
  );
  const urls =
    resolved.status === 0
      ? resolved.stdout.trim().split("\n").filter(Boolean)
      : [];
  if (urls.length !== 1) throw new Error(failure);
  return urls[0];
};

export const parseGitHubTarget = (remote) => {
  let host;
  let pathname;
  const scp = /^(?:([^@/:]+)@)?([^/:]+):(.+)$/.exec(remote);
  if (scp && !remote.includes("://")) {
    if (scp[1] && scp[1] !== "git") throw new Error(failure);
    host = scp[2].toLowerCase();
    pathname = scp[3];
  } else {
    try {
      const parsed = new URL(remote);
      const https = parsed.protocol === "https:";
      const ssh = parsed.protocol === "ssh:";
      if (
        (!https && !ssh) ||
        parsed.port ||
        parsed.password ||
        parsed.search ||
        parsed.hash ||
        (https && parsed.username) ||
        (ssh && parsed.username && parsed.username !== "git")
      )
        throw new Error(failure);
      host = parsed.hostname.toLowerCase();
      pathname = parsed.pathname.replace(/^\//, "");
    } catch {
      throw new Error(failure);
    }
  }

  const parts = pathname.replace(/\.git$/, "").split("/");
  if (
    !/^[A-Za-z0-9.-]+$/.test(host ?? "") ||
    parts.length !== 2 ||
    parts.some((part) => !/^[A-Za-z0-9_.-]+$/.test(part))
  )
    throw new Error(failure);
  const target = {
    host,
    selector: `${host}/${parts[0]}/${parts[1]}`,
  };
  return { ...target, identity: target.selector.toLowerCase() };
};

export const resolveGitHubPushTarget = (root) => {
  const fetch = parseGitHubTarget(remoteUrls(root, false));
  const push = parseGitHubTarget(remoteUrls(root, true));
  if (fetch.identity !== push.identity) throw new Error(failure);
  return { host: push.host, selector: push.selector };
};

export const environmentWithoutGhRepo = (environment = process.env) => {
  const clean = { ...environment };
  delete clean.GH_REPO;
  delete clean.GH_HOST;
  return clean;
};

export const executeGh = (cwd, args, { maxBuffer } = {}) =>
  spawnSync("gh", args, {
    cwd,
    encoding: "utf8",
    env: environmentWithoutGhRepo(),
    ...(maxBuffer === undefined ? {} : { maxBuffer }),
  });

// Every remote mutation first proves the push target, gh and its login.
export const ensureGh = (path) =>
  ensureGhFor(path, resolveGitHubPushTarget(path));
/** The gh preflight for a repository the caller has already bound from the
 * raw push URL, where Git's URL rewriting must not re-enter (WO-221). */
export const ensureGhFor = (path, repository) => {
  const available = executeGh(path, ["--version"]);
  if (available.status !== 0)
    throw new Error(
      "gh is required before any remote mutation; install and authenticate GitHub CLI, then retry publish",
    );
  const authenticated = executeGh(path, [
    "auth",
    "status",
    "--hostname",
    repository.host,
  ]);
  if (authenticated.status !== 0)
    throw new Error(
      "gh authentication is required before any remote mutation; authenticate GitHub CLI, then retry publish",
    );
  return repository;
};

const publishRefusal = (reason) =>
  new Error(`target publish refused: ${reason}`);
/** The push URL origin's configuration names, before any URL rewrite, which
 * must be the GitHub repository ensureGh resolved: a rewrite the target's
 * configuration adds cannot redirect the push (WO-157). */
export const pushUrl = (repo, repository) => {
  const values = (key) =>
    spawnGit(["-C", repo, ...HOST_GIT_READ, "config", "--get-all", key], {
      encoding: "utf8",
    })
      .stdout.split("\n")
      .filter(Boolean);
  const pushed = values("remote.origin.pushurl");
  const urls = pushed.length ? pushed : values("remote.origin.url");
  if (urls.length !== 1)
    throw publishRefusal("origin must name exactly one push URL");
  let target;
  try {
    target = parseGitHubTarget(urls[0]);
  } catch {
    throw publishRefusal(
      "origin's configured push URL is not a GitHub repository",
    );
  }
  if (repository && target.identity !== repository.selector.toLowerCase())
    throw publishRefusal(
      `origin's configured push URL names ${target.selector}, but its resolved target is ${repository.selector}`,
    );
  return urls[0];
};
/** Push the observed commit from a host-created bare repository, so neither
 * the target's hooks nor its repository configuration (core.sshCommand,
 * include.path, remote.<name>.receivepack, credential helpers, URL rewrites)
 * runs in the operator's publish process; only the operator's global and
 * system configuration apply (WO-157). */
export function pushObservedCommit(
  repo,
  url,
  branch,
  commit,
  destination = branch,
  {
    sourceRef = `refs/heads/${branch}`,
    lease,
    allowAbsent = false,
    pullRequest,
  } = {},
) {
  withPublishLane((inLane) => {
    inLane([
      "fetch",
      "--quiet",
      "--no-tags",
      repo,
      `+${sourceRef}:refs/heads/${branch}`,
    ]);
    if (
      inLane(["rev-parse", "--verify", `refs/heads/${branch}^{commit}`]) !==
      commit
    )
      throw publishRefusal(
        `branch ${branch} no longer names the observed commit`,
      );
    if (lease) {
      const remote =
        inLane([
          "ls-remote",
          "--heads",
          url,
          `refs/heads/${destination}`,
        ]).split(/\s+/u)[0] || null;
      if (
        remote !== lease &&
        remote !== commit &&
        !(allowAbsent && remote === null)
      )
        throw publishRefusal(
          `remote draft branch ${destination}${pullRequest ? ` for pull request #${pullRequest}` : ""} moved from the recorded head ${lease} to ${remote ?? "absent"}; preserve the remote change, integrate and review it, then explicitly rebind publication before retrying`,
        );
      if (remote === commit) return;
      if (remote === null && allowAbsent) lease = "";
    }
    // A reuse of a draft branch moves it only from the recorded draft head;
    // any other remote state refuses the push (WO-221).
    inLane([
      "push",
      "--no-follow-tags",
      ...(lease !== undefined
        ? [`--force-with-lease=refs/heads/${destination}:${lease}`]
        : []),
      url,
      `${commit}:refs/heads/${destination}`,
    ]);
  });
}
/** One host-created bare lane, as pushObservedCommit uses: only the
 * operator's global and system Git configuration apply inside it. */
function withPublishLane(run) {
  const lane = mkdtempSync(join(tmpdir(), "dotln-target-push-"));
  try {
    const init = spawnGit(["init", "--quiet", "--bare", "--template=", lane], {
      encoding: "utf8",
    });
    if (init.status !== 0)
      throw publishRefusal(
        `git init failed for the publish lane: ${init.stderr}`,
      );
    const inLane = (args, options = {}) => {
      const result = spawnGit(["-C", lane, ...HOST_GIT_READ, ...args], {
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
        ...options,
      });
      if (result.status !== 0)
        throw publishRefusal(
          `git ${args[0]} failed in the publish lane: ${String(result.stderr ?? "").trim()}`,
        );
      return result.stdout.trim();
    };
    return run(inLane);
  } finally {
    rmSync(lane, { recursive: true, force: true });
  }
}
/** Fetch through a host-owned lane, then import its bundle without consulting
 * the clone's transport configuration or moving any branch in the clone. */
export function fetchRemoteBranch(repo, url, branch) {
  return withPublishLane((inLane) => {
    inLane([
      "fetch",
      "--quiet",
      "--no-tags",
      url,
      `refs/heads/${branch}:refs/heads/fetched`,
    ]);
    const commit = inLane(["rev-parse", "refs/heads/fetched^{commit}"]);
    const scratch = mkdtempSync(join(tmpdir(), "dotln-target-fetch-"));
    try {
      const bundle = join(scratch, "fetched.bundle");
      inLane(["bundle", "create", bundle, "refs/heads/fetched"]);
      runGit(repo, [...HOST_GIT_READ, "bundle", "unbundle", bundle]);
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
    return commit;
  });
}
/** The commit a remote tag names, peeled, or null when the tag is absent;
 * read through the lane so the checkout's transport configuration stays out. */
/** Every tag of the remote at `url`, read through the lane: `object` is the
 * tag's own object and `target` the commit it names (an annotated tag's
 * peeled row, or the object itself for a lightweight tag). */
export function remoteTags(url) {
  return withPublishLane((inLane) => {
    const tags = new Map();
    for (const row of inLane(["ls-remote", "--tags", url])
      .split("\n")
      .filter(Boolean)) {
      const [object, ref] = row.split("\t");
      if (!ref?.startsWith("refs/tags/")) continue;
      const peeled = ref.endsWith("^{}");
      const name = ref.slice("refs/tags/".length).replace(/\^\{\}$/u, "");
      const prior = tags.get(name) ?? { name, object, target: object };
      tags.set(
        name,
        peeled
          ? { ...prior, target: object }
          : { ...prior, object, target: prior.target ?? object },
      );
    }
    return tags;
  });
}
/** The commit a remote tag names, or null when the tag is absent. */
export function remoteTagTarget(url, tag) {
  return remoteTags(url).get(tag)?.target ?? null;
}
/** The pull-request number a `gh pr create` printed for `forge`, or null
 * when its last line is not that repository's pull-request URL. */
export function parsePullRequestUrl(stdout, forge) {
  const url =
    /^https:\/\/([^/\s]+)\/([^/\s]+)\/([^/\s]+)\/pull\/([1-9][0-9]*)$/u.exec(
      stdout.trim().split("\n").at(-1) ?? "",
    );
  if (!url || `${url[1]}/${url[2]}/${url[3]}`.toLowerCase() !== forge.identity)
    return null;
  return Number(url[4]);
}
/** The repository's GitHub Release for `tag`: current when one exists with
 * this title and body, created otherwise, refused when it differs. */
export function ensureRelease(
  cwd,
  repository,
  tag,
  title,
  body,
  { matchTitle = true, admittedTitles = [title] } = {},
) {
  const viewed = executeGh(cwd, [
    "release",
    "view",
    tag,
    "--repo",
    repository.selector,
    "--json",
    "body,name,isDraft,isPrerelease,assets",
  ]);
  if (viewed.status === 0) {
    let release;
    try {
      release = JSON.parse(viewed.stdout);
    } catch {
      throw publishRefusal(`${tag} GitHub Release returned invalid metadata`);
    }
    if (
      release.isDraft ||
      release.isPrerelease ||
      (Array.isArray(release.assets) && release.assets.length)
    )
      throw publishRefusal(
        `${tag} GitHub Release on ${repository.selector} is a draft, a prerelease or carries assets; the kit never edits a published Release`,
      );
    if (
      (matchTitle && !admittedTitles.includes(release.name)) ||
      release.body !== body
    )
      throw publishRefusal(
        `${tag} GitHub Release on ${repository.selector} differs from the expected ${matchTitle ? "title and body" : "body"}`,
      );
    return "existing";
  }
  if (!/\brelease not found\b/iu.test(`${viewed.stderr}${viewed.stdout}`))
    throw publishRefusal(
      `${tag} GitHub Release state not verified: ${String(viewed.stderr ?? "").trim()}`,
    );
  const notes = join(
    mkdtempSync(join(tmpdir(), "dotln-release-notes-")),
    "RELEASE.md",
  );
  try {
    writeFileSync(notes, body);
    const created = executeGh(cwd, [
      "release",
      "create",
      tag,
      "--repo",
      repository.selector,
      "--verify-tag",
      "--title",
      title,
      "--notes-file",
      notes,
    ]);
    if (created.status !== 0)
      throw publishRefusal(
        `tag published; GitHub Release not created; rerun the same command: ${String(created.stderr ?? "").trim()}`,
      );
  } finally {
    rmSync(join(notes, ".."), { recursive: true, force: true });
  }
  return "created";
}
/** Create an annotated tag object for `commit` in the lane and push it to
 * `url` as `refs/tags/<tag>`, never touching the checkout's refs (WO-221).
 * Returns the tag object's id. */
export function pushAnnotatedTag(
  repo,
  url,
  { sourceRef, commit, tag, message, tagger },
) {
  return withPublishLane((inLane) => {
    inLane([
      "fetch",
      "--quiet",
      "--no-tags",
      repo,
      `+${sourceRef}:refs/heads/tagged`,
    ]);
    if (
      inLane(["rev-parse", "--verify", "refs/heads/tagged^{commit}"]) !== commit
    )
      throw publishRefusal(`${sourceRef} no longer names the commit to tag`);
    const object = inLane(["mktag"], {
      input: `object ${commit}\ntype commit\ntag ${tag}\ntagger ${tagger}\n\n${message}\n`,
    });
    inLane(["push", "--no-follow-tags", url, `${object}:refs/tags/${tag}`]);
    return object;
  });
}
