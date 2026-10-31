# Feature configuration — where an instance's choices live, and which are still planned

This page is for the operator of a launchpad or an exported instance who wants
to know what can be turned on or off, where the switch is, what it does, and
whether anything reads it yet. `dotln.config.json` at the launchpad root is the
one configuration file; `scripts/lib/config.mjs` validates it, and an absent
file means today's layout and defaults ([product 07 §Where the control plane
finds its documents](07-execution-guide.md#where-the-control-plane-finds-its-documents)).
An instance owns its configuration file and any build overlay it selects.
Budgets and bounds live in `docs/control/budgets.json`, where `null` means no
bound or keep.

| Choice | Where it lives today, and who reads it | What it does | Kind and state |
| --- | --- | --- | --- |
| Document locations | `roots` in `dotln.config.json`; the configuration loader | Moves the document roots the control plane resolves | layout; implemented |
| Build, profile and overlay | `build.loadout`, `build.profile`, `build.overlay`; `harness emit` and `check` | Selects the emitted build and profile and an instance-owned overlay | instance selection; implemented |
| Optional supports | the overlay's `equip` and `unequip` over the Contributor's support ids | Equips or removes adjacent repair, decision receipts, the follow-up queue, operator check-in, the Tinkerer economy and the rest | instance preference; implemented, with conflicting communication supports refused |
| No emitted build | the overlay's `build: none`; `harness emit` and `check` | Removes the generated surfaces and keeps the hand-written floor | instance choice; implemented; not a way to disable the floor |
| Registered repositories and their checks | `repositories` and `classes`; the target gate runner and the documentation root | Names the targets an instance works on, their gates and their scoped authority | instance configuration; implemented; closeout selection follows in WO-243 |
| Release surfaces | `release.readmeBlock`, `componentVersions`, `corpus`, `publicationCheck` | Declared toggles for the release's surfaces | declared; read by nothing yet, listed so the page tells the truth |
| Kit instance actions | `kit.applyInstanceActions`; the update | Lets an update perform the kit's declared instance actions | instance choice; implemented |
| Subagent cap and dispatch bounds | `subagentCap`, `drivenSessionCeiling`, `drivenPhaseTimeoutMs` and `dispatches.*` in `budgets.json`; the hooks, the gate and the lifecycle | Bounds the agents a session may spawn and how long a dispatch may run; `null` lifts a bound | instance budget; implemented |
| Retention windows | `retention.*` in `budgets.json`; the prune | How long each class of owned temporary root is kept; `null` keeps | instance budget; implemented |
| Runtime | the `engines` field of every package; `harness check`, `harness evidence` and the gate's `host` task | Admits Node 24.15 or later in the 24 line and Node 26, and refuses any other Node by name | compatibility, not a toggle; implemented |
| Named feature elections | a `features` section in `dotln.config.json`, a boolean or `{ on, note }` per feature; a registry in the kit; a generated `docs/control/FEATURES.md` | One place for the elections above and the new ones, each with its scope (core, instance or both), default and reader | WO-241 planned; the generated page then carries an instance's effective values and this page links it |
| Private destination | `features.private-destination` | Admits ordinary project links of the instance's own organisation inside that instance; credentials stay excluded and publications still refuse private terms | WO-241 planned; core's floor is not electable |
| Plan-first mode | `features.plan-first` | A plan, a conversation and a proposal before anything is implemented, and the operator's approval before it is | WO-242 planned; direct execution stays the default |
| An instance's own planning inputs | a script the instance owns, run on the operator's word; later a `source` adapter under WO-207's extension root | Gathers a tracker's items for the instance's own planning session | available by hand today; the adapter route is WO-207's |

What is not electable: the six refusals, the writer reservation and the
clean-room floor ([product 07 §Operator recovery controls](07-execution-guide.md#operator-recovery-controls);
`CLAUDE.md` §Clean Room). A switch for them does not exist and this page
will not list one.

This page states where things are; it is not evidence that a planned selector
exists. WO-241 transcribes its rows into the registry, ties each new row to a
real reader, and keeps old configurations' behavior; later orders add or
retire rows together with their consumers and update this page.
Source: [the planning pass of 2026-10-30](../planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md),
on the operator's items 2, 2.a and 2.b of that day and the operator's
direction to take the best of the two passes of that day (the other pass
wrote the first version of this inventory).
