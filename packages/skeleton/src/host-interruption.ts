import { WorkerFailure } from "./worker-protocol.js";

export const interruption = (signal: AbortSignal): WorkerFailure =>
  new WorkerFailure("interrupted", String(signal.reason));

export function throwIfInterrupted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw interruption(signal);
}

/** A synchronous child can return before Node delivers the foreground job's
 * signal. Two check phases include a poll turn, without a timed sleep. */
export async function deliverPendingSignal(
  signal: AbortSignal | undefined,
): Promise<boolean> {
  for (let turn = 0; signal && !signal.aborted && turn < 2; turn++)
    await new Promise<void>((resolve) => setImmediate(resolve));
  return signal?.aborted ?? false;
}

export async function interruptionCheckpoint(
  signal: AbortSignal | undefined,
): Promise<void> {
  await deliverPendingSignal(signal);
  throwIfInterrupted(signal);
}

/** Admit a synchronous host read/test only after the run has handled any
 * pending signal. Interruption takes precedence over both data and errors. */
export async function interruptibleHostCall<T>(
  signal: AbortSignal | undefined,
  call: () => T,
): Promise<T> {
  await interruptionCheckpoint(signal);
  let value: T;
  try {
    value = call();
  } catch (error) {
    await interruptionCheckpoint(signal);
    throw error;
  }
  await interruptionCheckpoint(signal);
  return value;
}
