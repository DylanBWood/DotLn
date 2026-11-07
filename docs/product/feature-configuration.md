# Feature configuration — an instance's choices and their readers

This page is for the operator of a launchpad or exported instance deciding
what to turn on or off. `dotln.config.json` is the one configuration file;
`scripts/lib/config.mjs` validates it. An absent file keeps the existing
layout and defaults. The [generated inventory](../control/FEATURES.md) lists
every registered election and selection with its scope, default, effective
value, source, election key and consumer. Its single source is the registry
in `scripts/lib/feature-registry.mjs`, read by `scripts/lib/features.mjs`;
later orders add a row there with its consumer and behavioral test. The
[kit guide](../KIT.md#features) gives the entry forms and the commands to
edit, render and check the choices.

The named `features` elections are Tinkerer economy (on by default),
private-destination, desktop-control and plan-first (off). Private-destination admits only an exported instance owner's
ordinary project links and identifiers inside that instance. Credentials
remain excluded and publication screens still judge outward artifacts.
Desktop control still requires an explicit operator request in the session.
Plan-first asks the executor to present its plan and complete proposed diff,
then wait for approval before applying the change. Its lifecycle and host
boundaries read the election; the [kit guide](../KIT.md#plan-first-mode) explains
the conversation and approval steps. Future-consumer declarations
travel with the registry; copied and installed runtimes do not need core's
work-order archive. A local record showing that a consumer closed without a
registry update produces a planning advisory.

Existing choices stay at their addresses: build selections and overlays
under `build`, the drive sandbox under `drive`, kit instance actions under
`kit`, and release surface elections under `release`. The four release
switches and the saved `build.loadout` and `build.profile` keys remain unread; the registry does not pretend that a declared key
changes output. Budgets and retention remain in `docs/control/budgets.json`,
where `null` removes a bound or retains a class. Their actual file source
is shown in the generated page. The spawn-cap runtime still reads the default
`docs/control/budgets.json` even when the control root is relocated; process
bounds, driven limits and retention read the configured control root. The
inventory reflects that distinction. An instance owns these files and its overlay;
`scope: core` marks a core choice, not an instance obligation.

Some configuration is not a feature toggle. `roots` relocates the document
layout; `repositories` and `classes` declare target repositories, checks and
authority profiles. Runtime compatibility is the packages' `engines.node`
contract. An instance can gather its own planning inputs with an owned script
on the operator's word; a source adapter remains WO-207's work. These
contracts stay in [product 07](07-execution-guide.md#where-the-control-plane-finds-its-documents).

The generated harness contract's refusal classes, the single-writer
reservation and the clean-room floor are not electable. A feature changes
behavior under that floor; it cannot turn the floor off.

Source: [the planning pass of 2026-10-30](../planning/passes/node24-features-config-plan-first-no-work-stream-2026-10-30.md)
and [WO-241's implementation decisions](../evidence/WO-241/decisions.md).
