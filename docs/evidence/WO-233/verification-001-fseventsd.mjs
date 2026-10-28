// VER-001 F2 probe: the gate's fseventsd sample must read a running daemon.
// Exit 1 when an independent process-table read finds fseventsd and
// sampleFileEventDaemon() still reports it unavailable; exit 0 otherwise.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-001-fseventsd.mjs
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../../../", import.meta.url));
const { sampleFileEventDaemon } = await import(
  join(sourceRoot, "scripts/lib/host-resources.mjs")
);
if (process.platform !== "darwin") {
  console.log(JSON.stringify({ platform: process.platform, judged: false }));
} else {
  const sample = sampleFileEventDaemon();
  // The command column last is never truncated; first, ps cuts it to 16 bytes.
  const independent = execFileSync("ps", ["-A", "-o", "rss=,comm="], {
    encoding: "utf8",
  })
    .split("\n")
    .flatMap((line) => {
      const match = /^\s*(\d+)\s+(.*\/)?fseventsd$/.exec(line);
      return match ? [Number(match[1]) * 1024] : [];
    });
  const truncated = execFileSync("ps", ["-A", "-o", "comm=", "-o", "rss="], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  const widths = truncated.map((line) => line.trim().split(/\s+/)[0].length);
  console.log(
    JSON.stringify({
      sample,
      independentResidentBytes: independent,
      commandColumnMaxBytesWhenFirst: Math.max(...widths),
    }),
  );
  if (independent.length && sample.residentBytes === null) {
    console.error(
      "F2 reproduced: fseventsd is running and the sampler reports it unavailable.",
    );
    process.exitCode = 1;
  }
}
