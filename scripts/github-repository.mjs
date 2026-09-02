import { spawnSync } from "node:child_process";

const failure =
  "origin must identify exactly one matching GitHub HOST/OWNER/REPO fetch and push target";

const remoteUrls = (root, push) => {
  const resolved = spawnSync(
    "git",
    [
      "-C",
      root,
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

const parseGitHubTarget = (remote) => {
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
