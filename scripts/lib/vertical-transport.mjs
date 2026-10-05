/** Preserve primitive transport semantics while observing the resident's
 * existing presence interpreter before launch and during the child process. */
export function verticalTransport(transport, active) {
  if (!active) return transport;
  return {
    name: transport.name,
    harnessVersion: transport.harnessVersion,
    dispatch(request, now) {
      let child,
        killed = false,
        busy = false,
        timer;
      const ready = Promise.resolve().then(async () => {
        // A kill can arrive while authority is being read; check it again.
        if (killed || !(await active(true)) || killed)
          throw new Error("vertical child launch is no longer admitted");
        child = transport.dispatch(request, now);
        return child;
      });
      const receipt = ready.then((run) => run.receipt);
      const completed = ready.then(async (run) => {
        let stop;
        const stopped = new Promise((_, reject) => {
          stop = reject;
        });
        timer = setInterval(async () => {
          if (busy) return;
          busy = true;
          try {
            if (!(await active(false))) {
              run.kill();
              stop(new Error("vertical running authority was interrupted"));
            }
          } catch (error) {
            run.kill();
            stop(error);
          } finally {
            busy = false;
          }
        }, 20);
        try {
          const value = await Promise.race([run.completed, stopped]);
          if (!(await active(false)))
            throw new Error("vertical result authority was interrupted");
          return value;
        } finally {
          clearInterval(timer);
        }
      });
      void receipt.catch(() => {});
      void completed.catch(() => {});
      return {
        receipt,
        completed,
        alive: () => child?.alive() ?? false,
        kill() {
          killed = true;
          child?.kill();
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
