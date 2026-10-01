# WO-105 structural tree fixtures

These fixtures and every `ground-truth.json` are **NON-NORMATIVE structural
data**. They describe inventory counts, incoming reference edges, graph
reachability from the explicit root, orphan files (zero incoming edges), and
planted `generated-stale` candidates. An orphan root is allowed; an unreachable
cycle need not contain an orphan. None of this authorizes deletion or defines
Seiri's evidence, proposal, policy or loadout schemas.

The four seeded families vary file count, all four classifications used by the
canonical fixture, chains, reachable/unreachable cycles, orphans and candidate
counts. The source-only family has no deletion candidates. Each family records
its actual live scenario signature in `index.json` and the manifest; differing
filenames alone do not establish distinct behavior. A scenario that throws is
explicitly excluded with its error. Such a family still passes structural
validation but has no completed live trace to compare.

Run commands, recorded seeds, exact scope and compact sweep results are in
[`../../manifests/WO-105.json`](../../manifests/WO-105.json).
