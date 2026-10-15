import { spawnGit } from "./git.mjs";
import { mkdtempSync, rmSync } from "node:fs";
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
export const ensureGh = (path) => {
  const repository = resolveGitHubPushTarget(path);
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
) {
  const lane = mkdtempSync(join(tmpdir(), "dotln-target-push-"));
  try {
    const init = spawnGit(["init", "--quiet", "--bare", lane], {
      encoding: "utf8",
    });
    if (init.status !== 0)
      throw publishRefusal(
        `git init failed for the publish lane: ${init.stderr}`,
      );
    const inLane = (args) => {
      const result = spawnGit(["-C", lane, ...HOST_GIT_READ, ...args], {
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      });
      if (result.status !== 0)
        throw publishRefusal(
          `git ${args[0]} failed in the publish lane: ${String(result.stderr ?? "").trim()}`,
        );
      return result.stdout.trim();
    };
    inLane([
      "fetch",
      "--quiet",
      "--no-tags",
      repo,
      `+refs/heads/${branch}:refs/heads/${branch}`,
    ]);
    if (
      inLane(["rev-parse", "--verify", `refs/heads/${branch}^{commit}`]) !==
      commit
    )
      throw publishRefusal(
        `branch ${branch} no longer names the observed commit`,
      );
    inLane([
      "push",
      "--no-follow-tags",
      url,
      `${commit}:refs/heads/${destination}`,
    ]);
  } finally {
    rmSync(lane, { recursive: true, force: true });
  }
}
