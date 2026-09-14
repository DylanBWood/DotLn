import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { join } from "node:path";

// Where the host can start a read-denying sandbox, a replica execution also
// denies literal absolute candidate reads. The denial is an addition: a host
// that refuses sandbox startup still narrows, records and reuses the same key,
// and every gate and suite row records whether the denial applied.
export function probeKernelDenial(
  repo,
  { platform = process.platform, run = spawnSync } = {},
) {
  if (platform !== "darwin")
    return {
      available: false,
      reason: "kernel sandbox unavailable on this platform",
    };
  const candidate = realpathSync(repo);
  const profile = `(version 1) (allow default) (deny file-read* (subpath ${JSON.stringify(candidate)}))`;
  const target = join(candidate, "package.json");
  const args = [
    "-e",
    "require('node:fs').readFileSync(process.argv[1]);",
    target,
  ];
  const options = { encoding: "utf8", timeout: 5000 };
  // Distinguish an effective denial from a host that refuses sandbox startup.
  const baseline = run(process.execPath, args, options);
  const launch = run(
    "/usr/bin/sandbox-exec",
    ["-p", profile, process.execPath, "-e", "process.exit(0)"],
    options,
  );
  if (baseline.status !== 0 || launch.status !== 0)
    return {
      available: false,
      reason:
        baseline.status !== 0
          ? "probe input unavailable"
          : "host refused sandbox startup",
    };
  const denied = run(
    "/usr/bin/sandbox-exec",
    ["-p", profile, process.execPath, ...args],
    options,
  );
  if (
    denied.status === 0 ||
    !/EACCES|EPERM|Operation not permitted|Permission denied/.test(
      denied.stderr ?? "",
    )
  )
    return {
      available: false,
      reason: "probe did not establish candidate read denial",
    };
  return {
    available: true,
    reason: "candidate read denied; sandbox startup passed",
    command: ["/usr/bin/sandbox-exec", "-p", profile],
  };
}

export const kernelDenialRecord = (probe, applied = false) => ({
  available: probe.available,
  reason: probe.reason,
  applied: Boolean(probe.available && applied),
});
