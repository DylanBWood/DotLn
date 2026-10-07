#!/usr/bin/env node
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
const [, , ...args] = process.argv;
const cfg = JSON.parse(
  readFileSync(process.env.DOTLN_VERTICAL_FIXTURE, "utf8"),
);
appendFileSync(cfg.calls, JSON.stringify({ actor: "forge", args }) + "\n");
const connection = (nodes = []) => ({
  nodes,
  pageInfo: { hasNextPage: false, endCursor: null },
});
const send = (v) => process.stdout.write(JSON.stringify(v));
if (args[0] === "--version") console.log("gh version fixture");
else if (args[0] === "auth") console.log("authenticated fixture");
else if (args[0] === "pr" && args[1] === "create") {
  const branch = args[args.indexOf("--head") + 1];
  const head = execFileSync(
    cfg.git,
    ["-C", cfg.remote, "rev-parse", `refs/heads/${branch}`],
    { encoding: "utf8" },
  ).trim();
  writeFileSync(
    cfg.published,
    JSON.stringify({
      head,
      body: readFileSync(args[args.indexOf("--body-file") + 1], "utf8"),
    }),
  );
  console.log("https://github.com/dotln-fixture/target/pull/7");
} else if (args[0] === "api") {
  const operation = /query ([A-Za-z]+)\(/u.exec(
    args.find((a) => a.startsWith("query=")),
  )?.[1];
  if (operation === "IssueSource") {
    const number = Number(
      args.find((arg) => arg.startsWith("number="))?.slice(7) ?? 1,
    );
    send({
      data: {
        repository: {
          nameWithOwner: "dotln-fixture/target",
          issue: {
            id: `ISSUE_${number}`,
            number,
            title: "Repair `fixture.txt`.",
            body: cfg.body,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: cfg.updatedAt ?? "2026-01-01T00:00:01Z",
            author: { __typename: "User", login: "fixture" },
            comments: connection(cfg.issueComments ?? []),
            userContentEdits: connection(),
          },
        },
      },
    });
  } else {
    const { head } = JSON.parse(readFileSync(cfg.published, "utf8"));
    // A declared check-state sequence advances once per checks query, so a
    // test can watch an automated reviewer run and finish between observations.
    let check = { status: "COMPLETED", conclusion: "SUCCESS" };
    if (cfg.checkStates && operation === "DotlnChecks") {
      const seen = Number(
        existsSync(cfg.checkCounter)
          ? readFileSync(cfg.checkCounter, "utf8")
          : 0,
      );
      writeFileSync(cfg.checkCounter, String(seen + 1));
      const state = cfg.checkStates[Math.min(seen, cfg.checkStates.length - 1)];
      check =
        state === "IN_PROGRESS"
          ? { status: "IN_PROGRESS", conclusion: null }
          : { status: "COMPLETED", conclusion: state };
    }
    const pr = {
      number: 7,
      headRefOid: head,
      author: { __typename: "User", login: "fixture" },
      comments: connection(cfg.reviewComments ?? []),
      reviews: connection(
        (cfg.reviews ?? []).map((review) => ({
          id: review.id,
          body: review.text,
          author: { __typename: "Bot", login: "fixture-bot" },
          state: "COMMENTED",
        })),
      ),
      reviewThreads: connection(),
    };
    send({
      data: {
        repository: {
          nameWithOwner: "dotln-fixture/target",
          pullRequest: pr,
          object: {
            oid: head,
            statusCheckRollup: {
              contexts: connection([
                {
                  __typename: "CheckRun",
                  id: "CR_1",
                  name: "unit",
                  ...check,
                },
              ]),
            },
          },
        },
      },
    });
  }
} else throw new Error("unexpected fake forge invocation");
