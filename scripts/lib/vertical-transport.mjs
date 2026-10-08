import {
  WorkerFailure,
  isWriterRequest,
} from "../../packages/skeleton/dist/src/worker-protocol.js";
import { interruption } from "../../packages/skeleton/dist/src/vertical-host.js";

/** Preserve primitive transport semantics while observing the resident's
 * existing presence interpreter before launch and during the child process,
 * and the run's abort signal (WO-199 VER-001 F1): an interrupted run stops a
 * judgment, triage or repair-verifier child at once and rejects its
 * completion with the hosts' typed interruption. A source-change writer is
 * left to its host, which forwards the operator's signal to the writer group
 * and settles it within its bound. */
export function verticalTransport(transport, active, { signal } = {}) {
  if (!active && !signal) return transport;
  return {
    name: transport.name,
    harnessVersion: transport.harnessVersion,
    supportsDeferredStart: transport.supportsDeferredStart,
    dispatch(request, now, options) {
      const run = isWriterRequest(request) ? undefined : signal;
      let child,
        killed = false,
        busy = false,
        timer;
      const ready = Promise.resolve().then(async () => {
        if (run?.aborted) throw interruption(run);
        // A kill can arrive while authority is being read; check it again.
        if (killed || (active && !(await active(true))) || killed)
          throw new WorkerFailure(
            "profile-refused",
            "vertical child launch is no longer admitted",
          );
        if (run?.aborted) throw interruption(run);
        child = transport.dispatch(request, now, options);
        return child;
      });
      const receipt = ready.then((episode) => episode.receipt);
      const processGroupReady = ready.then(
        (episode) => episode.processGroupReady ?? episode.processGroup,
      );
      const completed = ready.then(async (episode) => {
        let stop;
        const stopped = new Promise((_, reject) => {
          stop = reject;
        });
        const interrupt = () => {
          episode.kill();
          stop(interruption(run));
        };
        run?.addEventListener("abort", interrupt, { once: true });
        if (run?.aborted) interrupt();
        if (active)
          timer = setInterval(async () => {
            if (busy) return;
            busy = true;
            try {
              if (!(await active(false))) {
                episode.kill();
                stop(
                  new WorkerFailure(
                    "interrupted",
                    "vertical running authority was interrupted",
                  ),
                );
              }
            } catch (error) {
              episode.kill();
              stop(error);
            } finally {
              busy = false;
            }
          }, 20);
        try {
          const value = await Promise.race([episode.completed, stopped]);
          if (active && !(await active(false)))
            throw new WorkerFailure(
              "interrupted",
              "vertical result authority was interrupted",
            );
          return value;
        } finally {
          if (timer) clearInterval(timer);
          run?.removeEventListener("abort", interrupt);
        }
      });
      void receipt.catch(() => {});
      void processGroupReady.catch(() => {});
      void completed.catch(() => {});
      return {
        receipt,
        completed,
        processGroupReady,
        get processGroup() {
          return child?.processGroup;
        },
        alive: () => child?.alive() ?? false,
        start: () => child?.start?.(),
        kill(hostSignal) {
          killed = true;
          child?.kill(hostSignal);
        },
        get usage() {
          return child?.usage;
        },
        get isolation() {
          return child?.isolation;
        },
      };
    },
  };
}
