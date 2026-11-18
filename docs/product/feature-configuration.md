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
is shown in the generated page. The spawn cap, process bounds, driven limits
and retention all read `budgets.json` in the configured control root, so a
relocated root moves every one of them; the inventory names that file. An
instance owns these files and its overlay;
`scope: core` marks a core choice, not an instance obligation.

Some configuration is not a feature toggle. `roots` relocates the document
layout; `repositories` and `classes` declare target repositories, checks and
authority profiles. Runtime compatibility is the packages' `engines.node`
contract. An instance can gather its own planning inputs with an owned script
on the operator's word; a source adapter remains WO-207's work. These
contracts stay in [product 07](07-execution-guide.md#where-the-control-plane-finds-its-documents).

What a hook denies and what fails a gate is not a feature either. Each is
a stop of one table, with a class (what it protects) and a level (`refuse`,
`advise` or `off`) that one line of the `stops` section of
`dotln.config.json` sets; the generated page lists every stop under the
feature table, with its level in that root and the line that changes it,
and the writer reservation and the nine hook refusals are rows of it
([docs/KIT.md §Stops](../KIT.md#stops);
[decision](../evidence/WO-287/decisions.md#wo-287-d005--part-a-the-table-of-stops-as-built-its-rows-their-classes-and-what-has-no-line)).
The rules the kit puts into a session's instructions are on the same page:
each feedback unit and shared role rule with its layer, `platform` or
`author`, and an instance removes any of the author's in its build overlay
([docs/KIT.md §What is the kit's and what is the author's](../KIT.md#what-is-the-kits-and-what-is-the-authors);
[decision](../evidence/WO-287/decisions.md#wo-287-d015--part-b-the-layer-of-each-shared-rule-and-of-the-ten-units-with-its-reason)).
The Clean Room floor is neither a feature, a stop nor a rule of that table.
In core it is repository governance, hand-written and locked; in an
exported instance the Clean Room and Secrets sections of `CLAUDE.md` are
the owner's own text (ADR-0006, decision 6): no stop and no overlay line
names them, and `private-destination` above changes one paragraph of
Secrets where the owner elects it.

Source: [the planning pass of 2026-10-30](../planning/passes/node24-features-config-plan-first-no-work-stream-2026-10-30.md)
and [WO-241's implementation decisions](../evidence/WO-241/decisions.md).
