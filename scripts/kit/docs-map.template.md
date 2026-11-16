# docs

- A person setting the instance up, running an order or taking a release
  starts at [OPERATOR.md](OPERATOR.md), which holds the commands of each
  step.
- [docs/KIT.md](KIT.md) is the kit's guide to first steps, planning,
  releases and updates.
- `UPSTREAM.md` at the repository root names the kit's commit and the
  upstream documents the kit points to.

The roots use the default layout; the instance-owned `dotln.config.json`
can override them. Each root's README states its convention.

| Root | What it holds |
| --- | --- |
| `docs/work-orders/` | One scope authority per order, `WO-NNN-<slug>.md`, with **Model:** and **Effort:** as its leading metadata, and a generated index. |
| [docs/evidence/](evidence/README.md) | Each order's decisions, handoff and fixture transcripts. |
| [docs/verifications/](verifications/README.md) | The numbered verifier reports, grouped by work order. |
| [docs/final-reviews/](final-reviews/README.md) | The numbered final-review reports, with the pull-request and release-notes handoffs beside them. |
| [docs/planning/](planning/README.md) | The proposed sequence, the follow-up register, each planning pass's record and the refutation receipts. |
| [docs/workstreams/](workstreams/README.md) | One document per outcome; the README holds the convention and template. |
| [docs/repositories/](repositories/README.md) | One profile per registered repository; the README holds the convention and template. |
| [docs/control/](control/README.md) | The control records the lifecycle commands write. |
| [docs/lineage/](lineage/README.md) | `idea-ledger.md`, an append-only idea history, and a generated index. |
| [docs/product/](product/README.md) | The product documents the kit carries, and this instance's product overlay. |
| [docs/publication/](publication/README.md) | The implementation overlay template, and what this instance publishes. |
| [docs/discovery/](discovery/README.md) | The machine-audit outputs of this instance. |
| [docs/decisions/](decisions/README.md) | The architecture decision records of this instance. |
| [docs/releases/](releases/README.md) | The release records of the versions this instance publishes. |
| [docs/observations/](observations/README.md) | The observation logs the control plane appends to. |
| `docs/intake/` | Ignored, single-copy raw material. |

Two of these READMEs are generated indexes:

- `docs/work-orders/`: its README is the index
  `npm run work-orders -- index` generates at the first lifecycle
  transition (activate).
- `docs/lineage/`: its README is the index the export seeds and
  `node scripts/lineage.mjs index` regenerates after ledger edits; an older
  export generates it on its update branch or in its first steps, and
  bootstrap never writes it.
