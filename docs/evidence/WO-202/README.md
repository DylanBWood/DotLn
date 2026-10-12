# WO-202 planning command evidence

[Base observations](commands.json) record 29 invocations in one fixture export,
before product fixes: 12 nonzero exits (10 product failures and two supplementary
fixture-invocation errors). Exit codes and output heads are preserved; `fix`
fields identify the correction. Temporary paths are normalized to `<fixture>`
and `<entropy-fixture>`. The base was `b96a69a6d640046c2dce5653aeb4bcd4249f2b31`.

[Final observations](commands-final.json) record 31 successful invocations after
the repairs, including two additional non-live harness/module observations.
The bounded fixture test passed in 26.49 seconds at 2026-10-12T14:11:04.607Z;
the command rows account for 21.16 seconds of that run. These are one-run
observations, not a cold/warm comparison or a suite-duration forecast.

The fixture creates a real planning branch, drafts a synthetic candidate,
exports and applies register dispositions, generates and commits its planning
subject/costs, prints the canonical prompt and files a synthetic result. It checks
both receipt files, then validates the plan. Entropy starts without a review,
uses only the fake transport, and files its pair below the instance roots;
those fixture entropy records are never committed. Every temporary repository
is removed in `finally`.

[Decisions](decisions.md) map repairs, the corrected base assumptions, alternatives
and carry-in outcomes. [Self-review](self-review.md) records the two fresh workers.
The default export is qualified here. Relocated roots, a tool checkout separate
from `DOTLN_LAUNCHPAD`, live transports and an actual publishing release close
are not claimed. D005 retains the root-resolution remainder under
`FUP-cb5c3b3e7d0b0c0d`; adjacent-0001 is deferred onto that public identifier.
