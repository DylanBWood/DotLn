import { pathToFileURL } from "node:url";
import { buildIdCorpus } from "./id-corpus-lib.mjs";
import { buildManifest } from "./manifest-lib.mjs";
import { buildProgramCorpus } from "./program-corpus-lib.mjs";
import {
  PATHS,
  REPO_ROOT,
  assertRecordedSeed,
  checkExact,
  jsonBytes,
  parseGeneratorArgs,
  writeExact,
} from "./wo101-support.mjs";

export async function buildAllCorpus(seed) {
  const kernelUrl = pathToFileURL(`${REPO_ROOT}/packages/kernel/dist/src/index.js`).href;
  const kernel = await import(kernelUrl);
  const program = buildProgramCorpus(seed, kernel);
  const ids = buildIdCorpus(seed);
  const manifest = buildManifest(program, ids);
  return { kernel, program, ids, manifest, manifestBytes: jsonBytes(manifest) };
}

export async function runGenerator(lane, argv) {
  const { mode, seed } = parseGeneratorArgs(argv);
  assertRecordedSeed(seed);
  if (lane !== "program" && lane !== "ids") throw new Error(`unknown generator lane ${lane}`);
  const corpus = await buildAllCorpus(seed);
  const files = lane === "program" ? corpus.program.files : corpus.ids.files;
  const operation = mode === "write" ? writeExact : checkExact;
  for (const file of files) operation(file.absolutePath, file.bytes);
  operation(PATHS.manifest, corpus.manifestBytes);
  const laneSummary = lane === "program" ? corpus.program.summary : corpus.ids.summary;
  process.stdout.write(`${JSON.stringify({ workOrderId: "WO-101", lane, mode, seed, files: files.length, summary: laneSummary })}\n`);
}

export function isMain(metaUrl) {
  return process.argv[1] !== undefined && metaUrl === pathToFileURL(process.argv[1]).href;
}

