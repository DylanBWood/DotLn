import { parentPort, workerData } from "node:worker_threads";
import { sweepBeacons } from "../src/beacon-fs.js";

const { directory, signal, allowedSizes } = workerData as {
  directory: string;
  signal: SharedArrayBuffer;
  allowedSizes: string[];
};
const control = new Int32Array(signal);
const seen = new Set<string>();
parentPort!.postMessage("ready");
try {
  while (Atomics.load(control, 0) === 0) {
    const rows = sweepBeacons(directory);
    if (rows.length !== 1)
      throw new Error(`partial/extra names: ${rows.length}`);
    for (const row of rows) {
      if (
        !/^[a-f0-9]{64}\.beacon$/.test(row.address) ||
        row.decoded.status !== "decoded" ||
        !allowedSizes.includes(String(row.size))
      )
        throw new Error(
          `non-codeword or partial address: ${row.address}/${row.size}`,
        );
      seen.add(String(row.size));
    }
    Atomics.add(control, 1, 1);
    Atomics.notify(control, 1);
  }
  parentPort!.postMessage({
    samples: Atomics.load(control, 1),
    seen: [...seen],
  });
} catch (error) {
  Atomics.store(control, 0, 2);
  Atomics.notify(control, 1);
  throw error;
}
