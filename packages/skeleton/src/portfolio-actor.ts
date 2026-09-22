/** WO-100: the resident's portfolio actor. One episode materializes the
 * activated order through WO-120, changes source through WO-052 and verifies
 * the change through WO-054; the hosts are bound by the caller, so an
 * unbound resident reports the actor unavailable and dispatches nothing. */
import {
  assertActorSpec,
  type ActorAdapter,
  type ActorResult,
} from "./actor-contract.js";
import {
  assertPortfolioObservation,
  portfolioObservationVerified,
  type PortfolioActivation,
  type PortfolioObservation,
} from "./portfolio.js";
import { sha256Text } from "./sha256.js";

export interface PortfolioIdentity {
  readonly workOrderId: string;
  readonly workOrderPath: string;
}
export type PortfolioChange = PortfolioObservation["change"] & {
  readonly tokens?: number;
};
export type PortfolioVerdict = Extract<
  PortfolioObservation["verification"],
  { verdict: "pass" | "fail" }
> & { readonly tokens?: number };
export interface PortfolioPorts {
  /** WO-120: allocate or recover the durable identity and activate it. */
  materialize(activation: PortfolioActivation): Promise<PortfolioIdentity>;
  /** WO-052: one source change inside the derived surfaces and envelope. */
  change(
    activation: PortfolioActivation,
    identity: PortfolioIdentity,
  ): Promise<PortfolioChange>;
  /** WO-054: independent verification of the observed change. */
  verify(
    activation: PortfolioActivation,
    identity: PortfolioIdentity,
    change: Extract<PortfolioChange, { status: "observed" }>,
  ): Promise<PortfolioVerdict>;
}
export const PORTFOLIO_UNBOUND =
  "portfolio execution unavailable: no WO-120, WO-052 and WO-054 hosts are bound to this resident";

function actorResult(
  observation: PortfolioObservation | undefined,
  reason: string,
): ActorResult {
  const wire = JSON.stringify(observation ?? null);
  return {
    ...(observation ? { portfolio: observation } : {}),
    exitCode: null,
    signal: null,
    stdoutSha256: sha256Text(wire),
    firstLine: wire.slice(0, 160),
    verified: observation ? portfolioObservationVerified(observation) : false,
    reason,
  };
}
const tokens = (...reported: (number | undefined)[]) =>
  reported.some((value) => value !== undefined)
    ? { tokens: reported.reduce<number>((sum, value) => sum + (value ?? 0), 0) }
    : {};

export function portfolioAdapter(ports?: PortfolioPorts): ActorAdapter {
  return {
    kind: "portfolio",
    available: () => (ports ? null : PORTFOLIO_UNBOUND),
    run(spec, context) {
      assertActorSpec(spec);
      const activation = context?.portfolio;
      if (!ports || spec.kind !== "portfolio" || !activation)
        throw new Error(
          "portfolio episode needs bound hosts and an activation",
        );
      let killed = false;
      const completed = (async (): Promise<ActorResult> => {
        const identity = await ports.materialize(activation);
        const base = {
          workOrderId: identity.workOrderId,
          workOrderPath: identity.workOrderPath,
        };
        if (killed)
          return actorResult(
            {
              ...base,
              change: {
                status: "refused",
                reason:
                  "killed before the source change; nothing was attempted",
              },
              verification: {
                verdict: "not-run",
                reason: "killed before the source change",
              },
            },
            "portfolio episode killed before the source change",
          );
        const { tokens: changeTokens, ...change } = await ports.change(
          activation,
          identity,
        );
        if (change.status !== "observed") {
          const refused: PortfolioObservation = {
            ...base,
            change,
            verification: {
              verdict: "not-run",
              reason: "no observed change to verify",
            },
            ...tokens(changeTokens),
          };
          assertPortfolioObservation(refused);
          return actorResult(
            refused,
            `source change refused: ${change.reason}`,
          );
        }
        // WO-052 cannot be cancelled: a kill during the change still records
        // the commit it observed, and only verification is skipped.
        if (killed) {
          const unverified: PortfolioObservation = {
            ...base,
            change,
            verification: {
              verdict: "not-run",
              reason: "killed before verification",
            },
            ...tokens(changeTokens),
          };
          assertPortfolioObservation(unverified);
          return actorResult(
            unverified,
            "portfolio episode killed before verification",
          );
        }
        const { tokens: verifyTokens, ...verdict } = await ports.verify(
          activation,
          identity,
          change,
        );
        const observation: PortfolioObservation = {
          ...base,
          change,
          verification: verdict,
          ...tokens(changeTokens, verifyTokens),
        };
        assertPortfolioObservation(observation);
        return actorResult(
          observation,
          portfolioObservationVerified(observation)
            ? "verified"
            : `verification ${verdict.verdict}: ${verdict.passed} of ${verdict.criteria} criteria passed`,
        );
      })().catch((error: unknown) =>
        // A host refusal is a failed episode, never a thrown resident tick.
        actorResult(
          undefined,
          `portfolio episode failed: ${(error instanceof Error ? error.message : String(error)).split("\n")[0]!.slice(0, 200) || "unknown"}`,
        ),
      );
      return {
        completed,
        kill: () => {
          killed = true;
        },
      };
    },
  };
}
