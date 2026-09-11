#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { arch, platform, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { publishBuildTree } from "./build.mjs";

// Optional historical comparator, never imported or invoked by the build.
// These are the same libc exchanges used before VER-001 F4, on macOS/Linux.
const exchange = `import ctypes, os, sys
library = ctypes.CDLL(None, use_errno=True)
if sys.platform == "darwin":
    rename, cwd = library.renameatx_np, -2
elif sys.platform.startswith("linux"):
    rename, cwd = library.renameat2, -100
else:
    raise SystemExit("atomic directory exchange unavailable on this host")
rename.argtypes = [ctypes.c_int, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p, ctypes.c_uint]
rename.restype = ctypes.c_int
if rename(cwd, os.fsencode(sys.argv[1]), cwd, os.fsencode(sys.argv[2]), 2):
    error = ctypes.get_errno()
    raise OSError(error, os.strerror(error))
`;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const comparePython = args.includes("--compare-python");
if (args.some((arg) => arg !== "--compare-python") || args.length > 1)
  throw new Error(
    "usage: node scripts/benchmark-build-publication.mjs [--compare-python]",
  );

function manifest(directory, base = "") {
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .flatMap((entry) => {
      const path = join(base, entry.name),
        file = join(directory, entry.name);
      if (entry.isDirectory()) return manifest(file, path);
      if (!entry.isFile())
        throw new Error("Benchmark requires regular built output");
      const bytes = readFileSync(file);
      return [
        {
          path,
          bytes: bytes.length,
          hash: createHash("sha256").update(bytes).digest("hex"),
        },
      ];
    });
}
const names = readdirSync(join(root, "packages"))
  .filter((name) => existsSync(join(root, "packages", name, "tsconfig.json")))
  .sort();
const input = names.flatMap((name) =>
  manifest(join(root, "packages", name, "dist")).map((row) => ({
    ...row,
    path: `${name}/${row.path}`,
  })),
);
const implementations = [
  "node-files",
  ...(comparePython ? ["python-directories"] : []),
];
let pythonVersion = null;
if (comparePython) {
  const probe = spawnSync("python3", ["--version"], {
    encoding: "utf8",
    timeout: 5000,
  });
  if (probe.status !== 0)
    throw new Error(
      "Optional Python comparison unavailable; no build prerequisite was installed",
    );
  pythonVersion = probe.stdout.trim();
}
const fixture = mkdtempSync(join(tmpdir(), "dotln-build-comparison-"));
const samples = [];
try {
  for (const implementation of implementations)
    for (const name of names)
      cpSync(
        join(root, "packages", name, "dist"),
        join(fixture, implementation, "dist", name),
        { recursive: true },
      );
  // Alternate paired order to reduce a systematic warm-cache ordering bias.
  // Copying, TypeScript, hashing and validation are outside the timed region.
  for (let pair = 0; pair < 5; pair++) {
    for (const implementation of pair % 2
      ? [...implementations].reverse()
      : implementations) {
      const staged = join(fixture, implementation, "staged");
      rmSync(staged, { recursive: true, force: true });
      for (const name of names) {
        cpSync(join(root, "packages", name, "dist"), join(staged, name), {
          recursive: true,
        });
        writeFileSync(
          join(staged, name, "publication-canary.txt"),
          `pair ${pair}\n`,
        );
      }
      const expected = names.map((name) => manifest(join(staged, name)));
      const started = performance.now();
      for (const name of names) {
        const source = join(staged, name),
          destination = join(fixture, implementation, "dist", name);
        if (implementation === "node-files")
          publishBuildTree(source, destination);
        else {
          const run = spawnSync(
            "python3",
            ["-c", exchange, source, destination],
            { encoding: "utf8", timeout: 10000 },
          );
          if (run.status !== 0)
            throw new Error(
              `Python comparison failed: ${run.stderr || run.error?.message}`,
            );
        }
      }
      const durationMs = performance.now() - started;
      for (const [index, name] of names.entries())
        if (
          JSON.stringify(
            manifest(join(fixture, implementation, "dist", name)),
          ) !== JSON.stringify(expected[index])
        )
          throw new Error("Published bytes do not match the staged candidate");
      samples.push({
        pair: pair + 1,
        implementation,
        durationMs,
        subprocesses: implementation === "node-files" ? 0 : names.length,
        byteValidation: "pass",
      });
    }
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
const summarize = (implementation) => {
  const durations = samples
    .filter((row) => row.implementation === implementation)
    .map((row) => row.durationMs)
    .sort((a, b) => a - b);
  return {
    implementation,
    samples: durations.length,
    minMs: durations[0],
    medianMs: durations[Math.floor(durations.length / 2)],
    maxMs: durations.at(-1),
  };
};
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      observedAt: new Date().toISOString(),
      host: {
        platform: platform(),
        architecture: arch(),
        node: process.version,
        python: pythonVersion,
      },
      scope:
        "Publication only; five alternating paired runs on copied compiled output. Compilation, copying, hashing, byte validation and version probes excluded. Each package adds one small changing canary. No live repository output is replaced.",
      input: {
        packages: names,
        files: input.length,
        bytes: input.reduce((sum, row) => sum + row.bytes, 0),
        identity: createHash("sha256")
          .update(JSON.stringify(input))
          .digest("hex"),
        canaries: names.length,
      },
      source: {
        nodePublisher: "scripts/build.mjs",
        nodePublisherSha256: createHash("sha256")
          .update(readFileSync(join(root, "scripts/build.mjs")))
          .digest("hex"),
        comparator:
          "VER-001 F4 historical Python/libc exchange, reproduced above",
      },
      guarantees: {
        "node-files":
          "Each file is replaced atomically. Ordinary dist is a changing view until the build barrier completes. Installed hooks use an immutable pinned snapshot.",
        "python-directories":
          "Each package directory is exchanged atomically, with an additional Python/libc/platform prerequisite. Packages are still published sequentially.",
      },
      limits:
        "One host, five local filesystem samples; not a cross-platform benchmark or a measurement of whole-build time. Historical observations are retained if later source changes.",
      summaries: implementations.map(summarize),
      samples,
    },
    null,
    2,
  ),
);
