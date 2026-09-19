import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { decodeLog, encodeLog } from "@dotln/kernel";
import { runWorkerDemo } from "../src/worker-demo.js";
import {
  runVerificationDemo,
  VERIFICATION_WORKSTREAM,
} from "../src/verification-demo.js";
import { FakeVerificationTransport } from "../src/verification-fake.js";
import { WorkerStore } from "../src/worker-store.js";
import { WorkerHost } from "../src/worker-host.js";
import {
  preflightVerificationRecovery,
  VerificationDriver,
  VerificationHost,
} from "../src/verification-host.js";
import { LiveReactorDriver, type FixtureTree } from "../src/scenario.js";
import {
  LEASE_MS,
  parseWorkerResult,
  type WorkerRequest,
} from "../src/worker-protocol.js";
import type { WorkOrderTransport } from "../src/worker-transport.js";
import type { EvidenceWorkerRequest } from "../src/verification-protocol.js";

interface Shape {
  id: string;
  target: "lock" | "receipt" | "log" | "pending" | "command" | "capsule";
  operation: "truncate" | "replace" | "set" | "delete" | "pending";
  pointer?: string;
  value?: unknown;
  shape: string;
}
const shapes: Shape[] = JSON.parse(
  readFileSync(
    new URL("../../fixtures/worker-store-malformed.json", import.meta.url),
    "utf8",
  ),
);
const fixture: FixtureTree = JSON.parse(
  readFileSync(
    new URL("../../fixtures/repo-tree.json", import.meta.url),
    "utf8",
  ),
);
const json = (value: unknown) => JSON.stringify(value) + "\n";
const clock = 10_000_000;

/** Include every directory entry and file byte, including synthetic Git state. */
function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const visit = (relative: string) => {
    const path = join(root, relative);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) result[relative] = `link:${readlinkSync(path)}`;
    else if (stat.isDirectory()) {
      result[relative] = "directory";
      for (const name of readdirSync(path).sort()) visit(join(relative, name));
    } else result[relative] = readFileSync(path).toString("base64");
  };
  visit("");
  return result;
}
function mutate(value: unknown, shape: Shape): unknown {
  if (shape.operation === "replace") return shape.value;
  const parts = shape.pointer!.split(".");
  let parent = value as Record<string, unknown>;
  for (const part of parts.slice(0, -1))
    parent = parent[part] as Record<string, unknown>;
  if (shape.operation === "delete") delete parent[parts.at(-1)!];
  else parent[parts.at(-1)!] = shape.value;
  return value;
}

for (const mode of ["inspection", "verification"] as const) {
  test(`WO-048 ${mode} malformed recovery corpus preserves all store bytes`, async (t) => {
    const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-decode-")));
    let launches = 0;
    let afterSave = 0;
    const inspection: WorkOrderTransport = {
      name: "fake",
      harnessVersion: "fixture-v1",
      dispatch(request: WorkerRequest, now: () => number) {
        launches++;
        return {
          receipt: Promise.resolve({
            commandId: request.command.commandId,
            acceptedAt: now(),
            transport: "fake",
          }),
          completed: Promise.resolve(
            parseWorkerResult(
              {
                envelope: {
                  workOrderId: request.workOrder.workOrderId,
                  episodeId: request.episodeId,
                  resultId: `result_${request.command.commandId}`,
                  status: "completed",
                  summary: "Synthetic inspection",
                  requiresHuman: false,
                },
                candidates: [],
                beaconClaim: "inspection-completed",
              },
              request,
            ),
          ),
          alive: () => false,
          kill() {},
        };
      },
    };
    const fake = new FakeVerificationTransport();
    const verification: WorkOrderTransport<EvidenceWorkerRequest> = {
      name: fake.name,
      harnessVersion: fake.harnessVersion,
      dispatch: (request, now) => {
        launches++;
        return fake.dispatch(request, now);
      },
    };
    const run = (crash: boolean) => {
      const common = {
        directory: root,
        model: "fixture-model",
        effort: "high",
        now: () => clock + (crash ? 0 : LEASE_MS + 1),
        afterResultSaved: () => {
          afterSave++;
          if (crash) throw new Error("seed crash");
        },
      };
      return mode === "inspection"
        ? runWorkerDemo({ ...common, fixture, transport: inspection })
        : runVerificationDemo({ ...common, transport: verification });
    };
    try {
      await assert.rejects(run(true), /seed crash/u);
      assert.equal(launches, 1);
      const dead = spawnSync(process.execPath, ["-e", ""], {
        encoding: "utf8",
      });
      assert.equal(dead.status, 0);
      assert.throws(() => process.kill(dead.pid, 0), { code: "ESRCH" });
      const lock = join(root, "host.lock");
      const log = join(root, "events.jsonl");
      const receipt = join(
        root,
        readdirSync(root).find((name) => name.endsWith(".result.json"))!,
      );
      const pending = `${receipt}.pending`;
      writeFileSync(lock, json({ pid: dead.pid }));
      const original = new Map(
        [lock, log, receipt].map((path) => [path, readFileSync(path, "utf8")]),
      );
      const selected = shapes.filter(
        (shape) => mode === "verification" || shape.target !== "capsule",
      );
      for (const shape of selected)
        await t.test(shape.id, async () => {
          const target =
            shape.target === "lock"
              ? lock
              : shape.target === "receipt"
                ? receipt
                : shape.target === "pending"
                  ? pending
                  : log;
          if (shape.operation === "pending")
            writeFileSync(pending, original.get(receipt)!);
          else if (shape.operation === "truncate")
            writeFileSync(target, original.get(target)!.slice(0, -2));
          else if (["command", "capsule"].includes(shape.target)) {
            const events = JSON.parse(
              `[${original.get(log)!.trim().split("\n").join(",")}]`,
            );
            const persisted = events.find(
              (event: { type: string }) => event.type === "CommandPersisted",
            );
            if (shape.target === "command")
              persisted.payload.command = mutate(
                persisted.payload.command,
                shape,
              );
            else
              persisted.payload.command.intent.payload.capsule = mutate(
                persisted.payload.command.intent.payload.capsule,
                shape,
              );
            writeFileSync(log, events.map(json).join(""));
          } else
            writeFileSync(
              target,
              json(mutate(JSON.parse(original.get(target)!), shape)),
            );
          const before = snapshot(root);
          await assert.rejects(run(false), (error: Error) => {
            assert.ok(error.message.includes(target), error.message);
            if (shape.target === "receipt")
              assert.ok(
                error.message.startsWith(target),
                "receipt path must lead: " + error.message,
              );
            assert.ok(error.message.includes(shape.shape), error.message);
            return true;
          });
          assert.equal(launches, 1, "no recovery dispatch");
          assert.equal(afterSave, 1, "no accepted result");
          assert.deepEqual(
            snapshot(root),
            before,
            "no file, lock, event or directory changes",
          );
          if (shape.target === "pending") unlinkSync(pending);
          else writeFileSync(target, original.get(target)!);
        });

      await t.test("malformed-attempt-tail", async () => {
        const events = JSON.parse(
          `[${original.get(log)!.trim().split("\n").join(",")}]`,
        );
        events.find(
          (event: { type: string }) => event.type === "WorkerAttemptStarted",
        ).payload.leaseExpiresAt = "not-a-time";
        writeFileSync(log, events.map(json).join(""));
        const before = snapshot(root);
        await assert.rejects(run(false), /events\.jsonl.*worker lease/u);
        assert.deepEqual(snapshot(root), before);
        assert.equal(launches, 1);
        writeFileSync(log, original.get(log)!);
      });

      for (const path of [lock, log, receipt])
        await t.test(`dangling-${path.split("/").at(-1)}`, async () => {
          unlinkSync(path);
          symlinkSync(join(root, "absent-target"), path);
          const before = snapshot(root);
          await assert.rejects(run(false), (error: Error) => {
            assert.ok(error.message.includes(path), error.message);
            return true;
          });
          assert.deepEqual(snapshot(root), before);
          assert.equal(launches, 1);
          unlinkSync(path);
          writeFileSync(path, original.get(path)!);
        });

      await t.test("direct-host-run-refuses-before-events", async () => {
        // Already locked hosts must also validate before redispatch/expiry events.
        for (const preflight of [undefined, () => {}]) {
          const before = snapshot(root);
          assert.throws(
            () => new WorkerStore(root).acquire(preflight),
            /requires original request context/u,
          );
          assert.deepEqual(snapshot(root), before);
        }
        unlinkSync(lock);
        const store = new WorkerStore(root);
        store.acquire(() => {
          if (mode === "inspection") {
            const driver = new LiveReactorDriver();
            driver.restore(store.read());
            new WorkerHost({ store, driver, transport: inspection }).preflight(
              join(
                root,
                "worktrees",
                JSON.parse(
                  original.get(receipt)!,
                ).result.envelope.resultId.slice(7),
              ),
              fixture,
              "fixture-model",
              "high",
            );
          } else
            preflightVerificationRecovery(
              store,
              VERIFICATION_WORKSTREAM,
              (commandId) => join(root, "worktrees", commandId),
              "fixture-model",
              "high",
            );
        });
        try {
          writeFileSync(receipt, "null\n");
          const before = snapshot(root);
          if (mode === "inspection") {
            const driver = new LiveReactorDriver(undefined, store.append);
            driver.restore(store.read());
            await assert.rejects(
              new WorkerHost({
                store,
                driver,
                transport: inspection,
                now: () => clock + LEASE_MS + 1,
              }).run(
                join(
                  root,
                  "worktrees",
                  JSON.parse(
                    original.get(receipt)!,
                  ).result.envelope.resultId.slice(7),
                ),
                fixture,
                "fixture-model",
                "high",
              ),
              /saved result receipt/u,
            );
            assert.equal(driver.log, original.get(log));
          } else {
            const driver = new VerificationDriver(
              store,
              VERIFICATION_WORKSTREAM,
            );
            await assert.rejects(
              new VerificationHost({
                driver,
                transport: verification,
                now: () => clock + LEASE_MS + 1,
              }).run(
                join(
                  root,
                  "worktrees",
                  driver.state.pending!.command.commandId,
                ),
                "fixture-model",
                "high",
              ),
              /saved result receipt/u,
            );
            assert.equal(driver.log, original.get(log));
          }
          assert.deepEqual(snapshot(root), before);
          assert.equal(launches, 1);
        } finally {
          store.release();
          writeFileSync(receipt, original.get(receipt)!);
        }
      });
      assert.ok(decodeLog(encodeLog(decodeLog(original.get(log)!))).length > 0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}
