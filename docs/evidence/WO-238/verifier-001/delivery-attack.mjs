import { tmpdir } from "node:os";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
const source = process.cwd(),
  scratch = process.env.DOTLN_PROBE_SCRATCH ?? tmpdir();
const deliveryUrl = pathToFileURL(
  join(source, "scripts/lib/proposal-delivery.mjs"),
).href;
const { routedPacketEdits, writeDelivery } = await import(deliveryUrl);
const root = mkdtempSync(join(scratch, "delivery-attack-"));
const relative = "docs/proposals/late-route/packet.json";
mkdirSync(dirname(join(root, relative)), { recursive: true });
const pending = {
  schemaVersion: 1,
  kind: "FiledProductSuggestionPacket",
  deliveredBy: {
    workOrderId: "WO-901",
    release: null,
    recordedAt: "2030-01-01T00:00:00.000Z",
  },
};
writeFileSync(join(root, relative), JSON.stringify(pending, null, 2) + "\n");
const edits = routedPacketEdits(root, "WO-901", "v0.9.0");
assert.equal(edits.length, 1);
assert.equal(JSON.parse(edits[0].after).deliveredBy.release, "v0.9.0");
// A supported route arriving after the last preparation has no published
// release yet. writeDelivery is the production routing writer.
writeDelivery(root, relative, {
  workOrderId: "WO-901",
  release: null,
  recordedAt: "2030-01-02T00:00:00.000Z",
});
const before = readFileSync(join(root, relative), "utf8");
const release = readFileSync(join(source, "scripts/release.mjs"), "utf8");
const begin = release.indexOf("          // The packets this order delivered,");
const end = release.indexOf("          // Releasing the writer", begin);
assert.ok(begin > 0 && end > begin);
const handler = release.slice(begin, end);
assert.equal(
  (handler.match(/await import\("\.\/lib\/proposal-delivery.mjs"\)/g) ?? [])
    .length,
  1,
);
const runnable = handler.replace(
  'import("./lib/proposal-delivery.mjs")',
  `import(${JSON.stringify(deliveryUrl)})`,
);
const record = { publication: { tag: "v0.9.0" } },
  advisories = [];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
await new AsyncFunction(
  "record",
  "root",
  "workOrderId",
  "recordAdvisory",
  runnable,
)(record, root, "WO-901", (e) => advisories.push(e.message));
const after = readFileSync(join(root, relative), "utf8");
assert.equal(after, before);
assert.equal(JSON.parse(after).deliveredBy.release, null);
assert.equal(advisories.length, 1);
assert.equal(record.deliveredPackets[0].release, null);
const result = {
  method:
    "Evaluate the exact post-publication delivery handler extracted from scripts/release.mjs; substitute only its import URL. The preceding publication is represented by record.publication.tag. No live publication or full close was run.",
  handlerSha256: createHash("sha256").update(handler).digest("hex"),
  preparationCanFillRelease: JSON.parse(edits[0].after).deliveredBy.release,
  publishedTag: record.publication.tag,
  packetUnchanged: after === before,
  deliveredBy: JSON.parse(after).deliveredBy,
  recordedDelivery: record.deliveredPackets,
  advisories,
  expected:
    "A carrying order must not finish closing with its packet release still null.",
};
console.log(JSON.stringify(result, null, 2));
