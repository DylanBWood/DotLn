// A filed proposal packet learns what shipped it. `deliveredBy` is its last
// field: the order a disposal routed it to, the release that carried that
// order once release preparation assigns one, and when that was recorded. The
// bytes the filing event bound are the packet without the field, so the
// entropy chain's hash still judges what was filed. Release preparation loads
// this module alone, apart from the review machinery, and release close
// refuses to publish while a packet routed to the closing order names
// another release.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { docRelative } from "./config.mjs";
import { readControl } from "./control-store.mjs";
import { runGit, runGitPathList } from "./git.mjs";
import { json as prettyJson } from "./helpers.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  headingVersion,
  localReleaseTags,
  manifestFromTag,
} from "./release-tags.mjs";

const proposalsRoot = (root) => docRelative(root, "docs", "proposals");
const DELIVERY_FIELDS = ["workOrderId", "release", "recordedAt"];
export function validDelivery(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === DELIVERY_FIELDS.length &&
    DELIVERY_FIELDS.every((key) => key in value) &&
    /^WO-\d{3,}$/u.test(value.workOrderId) &&
    (value.release === null || /^v\d+\.\d+\.\d+$/u.test(value.release)) &&
    Number.isFinite(Date.parse(value.recordedAt)),
  );
}
/** The bytes a filing event bound: the packet without its delivery. */
export function filedPacketBytes(text) {
  const parsed = JSON.parse(text);
  if (!("deliveredBy" in parsed)) return text;
  const { deliveredBy, ...filed } = parsed;
  return prettyJson(filed);
}
export function writeDelivery(root, path, deliveredBy) {
  const absolute = join(root, path);
  const { deliveredBy: _previous, ...filed } = JSON.parse(
    readFileSync(absolute, "utf8"),
  );
  if (!validDelivery(deliveredBy))
    throw new Error(`invalid delivery for ${path}`);
  writeFileSync(absolute, prettyJson({ ...filed, deliveredBy }), {
    mode: 0o644,
  });
  return path;
}
export const packetPath = (root, suggestionId) =>
  `${proposalsRoot(root)}/${suggestionId}/packet.json`;

/** Release preparation's half: every packet routed to `workOrderId` names
 * `release`, the version that carries the order. Returns the changed paths. */
export function deliverRoutedPackets(root, workOrderId, release, options) {
  return routedPacketEdits(root, workOrderId, release, options).map((edit) => {
    writeFileSync(edit.path, edit.after, { mode: 0o644 });
    return edit.relative;
  });
}

/** The edits that name `release` on every packet routed to `workOrderId`,
 * read and judged before anything is written, so release preparation applies
 * them with its own edits and restores all of them if one write fails. */
export function routedPacketEdits(
  root,
  workOrderId,
  release,
  { now = () => new Date().toISOString() } = {},
) {
  const directory = join(root, proposalsRoot(root));
  if (!existsSync(directory)) return [];
  const edits = [];
  for (const name of readdirSync(directory).sort()) {
    const relative = packetPath(root, name);
    const path = join(root, relative);
    if (!containedRegularFile(path, root)) continue;
    const before = readFileSync(path, "utf8");
    const { deliveredBy, ...filed } = JSON.parse(before);
    if (
      deliveredBy?.workOrderId !== workOrderId ||
      deliveredBy.release === release
    )
      continue;
    const delivery = { workOrderId, release, recordedAt: now() };
    if (!validDelivery(delivery))
      throw new Error(`invalid delivery for ${relative}`);
    edits.push({
      path,
      relative,
      before,
      after: prettyJson({ ...filed, deliveredBy: delivery }),
    });
  }
  return edits;
}

/** The release that carried `workOrderId`: the newest annotated DotLn
 * release tag whose manifest names the order, or null before its close. */
export function publishedRelease(root, workOrderId) {
  try {
    const tags = localReleaseTags(root).reverse();
    for (const tag of tags) {
      const manifest = manifestFromTag(root, tag.name);
      if (manifest?.workOrder?.id === workOrderId) return tag.name;
    }
  } catch {
    // A checkout without readable release tags names no release yet.
  }
  return null;
}

/** The release that carries `workOrderId`: its published release, or, once
 * the order's merge has brought its passed final review into this checkout,
 * the version its release preparation wrote into its heading, which its
 * close publishes. Null while the order is in flight, for an order that
 * publishes no release of its own, or when neither can be read. */
export function carryingRelease(root, workOrderId) {
  const published = publishedRelease(root, workOrderId);
  if (published) return published;
  try {
    const state = readControl(root).orders.get(workOrderId)?.state;
    if (state?.phase !== "closed" || state.repositoryId) return null;
    return headingVersion(
      readFileSync(join(root, state.workOrderPath), "utf8").split("\n", 1)[0],
    );
  } catch {
    return null;
  }
}

/** The packets routed to `workOrderId`, with the release each names and the
 * review and identifier a route command takes, read from the working tree or,
 * given `revision`, from that commit. */
export function deliveredPackets(root, workOrderId, revision) {
  const directory = proposalsRoot(root);
  const packets = revision
    ? runGitPathList(root, [
        "ls-tree",
        "-z",
        "--name-only",
        revision,
        "--",
        `${directory}/`,
      ])
        .map((path) => `${path}/packet.json`)
        .map((path) => ({
          path,
          text: runGit(root, ["show", `${revision}:${path}`], {
            trim: false,
            onFailure: () => null,
          }),
        }))
    : existsSync(join(root, directory))
      ? readdirSync(join(root, directory))
          .map((name) => packetPath(root, name))
          .filter((path) => containedRegularFile(join(root, path), root))
          .map((path) => ({
            path,
            text: readFileSync(join(root, path), "utf8"),
          }))
      : [];
  return packets
    .filter((row) => row.text !== null)
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((row) => ({ path: row.path, packet: JSON.parse(row.text) }))
    .filter((row) => row.packet.deliveredBy?.workOrderId === workOrderId)
    .map((row) => ({
      path: row.path,
      release: row.packet.deliveredBy.release,
      receiptId: row.packet.sourceReceiptId ?? null,
      suggestionId: row.packet.packet?.suggestion?.suggestionId ?? null,
    }));
}

/** Release close's delivery rule, judged before anything publishes: every
 * packet routed to the closing order, as main carries it at `revision`,
 * names `release`, the version the close publishes. A packet routed after
 * the order's last release preparation still names none, and a successful
 * close would leave it so; the failure names the route command that writes
 * the release from a checkout of main that holds the order's merge. An order
 * no packet names adds no line. */
export function deliveryRules(root, workOrderId, release, revision) {
  let packets;
  try {
    packets = deliveredPackets(root, workOrderId, revision);
  } catch (error) {
    return [
      {
        pass: false,
        line: `FAIL proposal-delivery: observed unreadable proposal packets (${String(error.message).replace(/\s+/gu, " ").trim()}); expected every routed packet to name the release that carries the order`,
      },
    ];
  }
  if (!packets.length) return [];
  const late = packets.filter((row) => row.release !== release);
  if (!late.length)
    return [
      {
        pass: true,
        line: `PASS proposal-delivery: observed ${packets.length} packet(s) routed to ${workOrderId} naming ${release}; expected every routed packet to name the release that carries the order`,
      },
    ];
  return late.map((row) => ({
    pass: false,
    line: `FAIL proposal-delivery ${row.path}: observed release ${row.release ?? "none"} for ${workOrderId}; expected ${release}, the release this close publishes. ${
      row.release === null
        ? `The packet was routed after the order's last release preparation; on a planning branch of main, which holds the order's merge, run npm run entropy -- dispose ${row.receiptId} ${row.suggestionId} route 'Delivered by ${workOrderId}' --order ${workOrderId}, which writes ${release}; merge that change, then rerun the close`
        : `A reviewed change on main makes the packet name ${release} before the close publishes; the route command refuses a packet that already names a release`
    }`,
  }));
}
