import {
  closeSync,
  existsSync,
  fchmodSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { runGit } from "./git.mjs";

/** Git's files-backend ref lock also excludes stash pushes/drops in sibling
 * worktrees. Delete by object identity under that lock, never by a stale index.
 * Keep the packed row while entries remain: a concurrent pack-refs may still
 * prune the loose ref it packed. Remove it only with the last stash entry,
 * or that final entry would reappear after the loose ref is deleted. */
export function dropInventoriedStash(root, stash, subject, recoveryPath) {
  const backend = runGit(root, ["rev-parse", "--show-ref-format"]);
  if (backend !== "files")
    throw new Error("stash prune retains unsupported Git ref backend");
  const ref = resolve(
    root,
    runGit(root, ["rev-parse", "--git-path", "refs/stash"]),
  );
  const log = resolve(
    root,
    runGit(root, ["rev-parse", "--git-path", "logs/refs/stash"]),
  );
  const reflog = lstatSync(log, { throwIfNoEntry: false });
  if (!reflog?.isFile() || reflog.isSymbolicLink())
    throw new Error("stash prune requires regular stash ref and reflog");
  const locks = [];
  const lock = (path) => {
    const fd = openSync(`${path}.lock`, "wx", 0o600);
    locks.push({ path: `${path}.lock`, fd, owned: true });
    return fd;
  };
  const install = (path) => {
    renameSync(`${path}.lock`, path);
    locks.find((entry) => entry.path === `${path}.lock`).owned = false;
  };
  let refBefore,
    logBefore,
    packedBefore,
    installed = false;
  try {
    const refFd = lock(ref),
      logFd = lock(log);
    const packed = resolve(
      root,
      runGit(root, ["rev-parse", "--git-path", "packed-refs"]),
    );
    const packedFd = lock(packed);
    const packedInfo = lstatSync(packed, { throwIfNoEntry: false });
    if (packedInfo && (!packedInfo.isFile() || packedInfo.isSymbolicLink()))
      throw new Error("stash prune requires regular packed refs");
    const packedBytes = packedInfo ? readFileSync(packed) : null;
    packedBefore = packedBytes?.toString("utf8") ?? null;
    if (packedBytes && !Buffer.from(packedBefore, "utf8").equals(packedBytes))
      throw new Error("non-UTF-8 packed refs retained");
    if (packedBefore !== null && !packedBefore.endsWith("\n"))
      throw new Error("partial packed refs retained");
    const packedLines = packedBefore?.split("\n") ?? [];
    const stashRows = packedLines.filter((line) =>
      line.endsWith(" refs/stash"),
    );
    if (
      stashRows.length > 1 ||
      stashRows.some((line) => !/^[a-f0-9]{40,64} refs\/stash$/u.test(line)) ||
      (stashRows.length &&
        packedLines[packedLines.indexOf(stashRows[0]) + 1]?.startsWith("^"))
    )
      throw new Error("unrecognized packed stash ref retained");
    const packedSha = stashRows[0]?.split(" ")[0];
    const loose = lstatSync(ref, { throwIfNoEntry: false });
    if (loose && (!loose.isFile() || loose.isSymbolicLink()))
      throw new Error("stash prune requires regular stash ref");
    refBefore = loose ? readFileSync(ref, "utf8") : null;
    if (!refBefore && !packedSha)
      throw new Error("stash ref disappeared; retained");
    const logBytes = readFileSync(log);
    logBefore = logBytes.toString("utf8");
    if (!Buffer.from(logBefore, "utf8").equals(logBytes))
      throw new Error("non-UTF-8 stash reflog retained without rewriting");
    if (!logBefore.endsWith("\n"))
      throw new Error("partial stash reflog retained");
    const entries = logBefore
      .slice(0, -1)
      .split("\n")
      .map((line) => {
        const match =
          /^([a-f0-9]{40,64}) ([a-f0-9]{40,64}) ([^\n]+)\t([^\n]*)$/u.exec(
            line,
          );
        if (!match) throw new Error("unrecognized stash reflog retained");
        return {
          old: match[1],
          sha: match[2],
          identity: match[3],
          subject: match[4],
        };
      });
    if (entries.at(-1)?.sha !== (refBefore?.trim() ?? packedSha))
      throw new Error("stash ref and reflog disagree; retained");
    const selected = entries.filter(
      (entry) => entry.sha === stash && entry.subject === subject,
    );
    if (selected.length !== 1)
      throw new Error("stash identity changed or ambiguous; retained");
    const kept = entries.filter((entry) => entry !== selected[0]);
    mkdirSync(dirname(recoveryPath), { recursive: true, mode: 0o700 });
    const recovery =
      JSON.stringify({
        stash,
        ref: refBefore,
        reflog: logBefore,
        ...(packedBefore === null ? {} : { packedRefs: packedBefore }),
      }) + "\n";
    if (!existsSync(recoveryPath))
      writeFileSync(recoveryPath, recovery, {
        flag: "wx",
        mode: 0o600,
        flush: true,
      });
    if (readFileSync(recoveryPath, "utf8") !== recovery)
      throw new Error("stash recovery snapshot changed; retained");
    let previous = "0".repeat(entries[0].old.length);
    const nextLog = kept
      .map((entry) => {
        const line = `${previous} ${entry.sha} ${entry.identity}\t${entry.subject}\n`;
        previous = entry.sha;
        return line;
      })
      .join("");
    writeFileSync(logFd, nextLog);
    fsyncSync(logFd);
    writeFileSync(refFd, kept.length ? `${kept.at(-1).sha}\n` : "");
    fsyncSync(refFd);
    if (!kept.length && stashRows.length) {
      const nextPacked = packedLines
        .filter((line) => line !== stashRows[0])
        .join("\n");
      writeFileSync(packedFd, nextPacked);
      fchmodSync(packedFd, packedInfo.mode & 0o777);
      fsyncSync(packedFd);
    }
    if (kept.length) {
      install(log);
      installed = true;
      install(ref);
    } else {
      if (stashRows.length) {
        install(packed);
        installed = true;
      }
      unlinkSync(log);
      installed = true;
      if (loose) unlinkSync(ref);
    }
  } catch (error) {
    // Keep the ref lock held while rolling back partially installed files.
    if (installed && refBefore !== undefined && logBefore !== undefined) {
      writeFileSync(log, logBefore, { flush: true });
      if (refBefore === null) {
        if (existsSync(ref)) unlinkSync(ref);
      } else writeFileSync(ref, refBefore, { flush: true });
      const packed = resolve(
        root,
        runGit(root, ["rev-parse", "--git-path", "packed-refs"]),
      );
      if (packedBefore === null) {
        if (existsSync(packed)) unlinkSync(packed);
      } else if (packedBefore !== undefined)
        writeFileSync(packed, packedBefore, { flush: true });
    }
    if (existsSync(recoveryPath))
      throw new Error(
        `${error.message}; stash recovery snapshot: ${relative(root, recoveryPath)}`,
      );
    throw error;
  } finally {
    for (const { path, fd, owned } of locks.reverse()) {
      closeSync(fd);
      if (owned && existsSync(path)) unlinkSync(path);
    }
  }
}
