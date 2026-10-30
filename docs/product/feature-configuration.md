# Feature configuration

This inventory tells an operator where choices live today and which choices
are still planned. `dotln.config.json` is the primary versioned configuration;
`scripts/lib/config.mjs` validates it. An absent file uses the existing defaults.
An instance owns its configuration and any selected build overlay.

| Area | Current control and reader | What the choice does | Classification / availability |
| --- | --- | --- | --- |
| Document locations | `roots`, config resolver | Moves the document roots used by the control plane | Optional layout; implemented |
| Build selection | `build.loadout`, `build.profile`, `build.overlay`; harness library | Selects emitted Contributor build/profile and an instance-owned JSON overlay | Instance preference; implemented |
| Optional supports | overlay `equip` / `unequip`; Contributor support IDs | Selects adjacent repair, decision receipts, follow-up queue, operator check-in, observation/recommendation/intent communication, tinkerer economy, process cost and goal alignment | Operator preferences; implemented, with validation of conflicting communication supports |
| No emitted build | overlay `build: none`; harness emit/check | Removes owned generated surfaces, keeps the handwritten floor and an empty manifest | Instance choice; implemented, not a way to disable the floor |
| Repository and check boundaries | repositories/classes, configured target gate and documentation root | Chooses registered targets, their checks and scoped authority | Instance configuration; implemented; WO-243 aligns closeout advice |
| Effect authority | overlay narrowing and explicit grants | Narrows authority or records separately granted effects; host permissions still decide | Required provenance and host boundary; implemented, never a free on/off switch |
| Runtime | package engine declarations | Admits Node 26 today; WO-240 adds tested Node 24.15.0 support | Compatibility, not a feature toggle; second line planned |
| Portable versus core-operator loadout | current Contributor definitions and instance overlay | Today's switches do not separate every embedded operator preference | WO-241 planned; core behavior retained by default |
| Destination policy | handwritten repository floor plus active clean-room behavior | Core excludes employer material; the starter's owner-rights wording and inherited behavior need a consistent private-instance selection | WO-241 planned; no `cleanRoom: false` switch |
| Interaction | current lifecycle; future assisted selection | Current direct execution, or a plan/dialogue/complete-proposal review before source application | WO-242 planned; not implemented by operator-check-in alone |
| Local planning input | an explicitly invoked repository-owned script | Produces inputs for that instance's planning session under local authority | Available manual composition; no tracker dependency in core |
| Automatic source loading | WO-207's proposed extensions configuration and SourceAdapter loader | Loads an instance-owned adapter in the vertical | Planned; not required for the manual script route |

Defaults and effective selected values are still obtained from the configuration,
overlay and emitted manifest; a consolidated human-readable inspector is WO-241.
Unknown keys refuse today. This table does not advertise new working switches.
WO-241 must tie each new selection to a real consumer, disclose dependencies and
the effect of turning it off, and retain existing configurations' behavior.
Later work orders update the inventory when adding or removing a capability.

Private repository visibility does not itself grant data rights. The instance's
explicit destination policy may permit ordinary project links within that
authorized private target; credentials and unauthorized disclosures remain
excluded. Core's locked floor is unchanged. Private discussions and scripts do
not become public request content: the operator writes the generic request.

Source and decisions: [2026-10-30 planning pass](../planning/portable-config-assisted-2026-10-30.md),
WO-240 through WO-242. The inventory is standing product guidance, not evidence
that the planned selectors exist.
