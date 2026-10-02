import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import {
  canonicalStringify,
  decodeSourceBundle,
  resolveSourceSpan,
  SOURCE_SECRET_SHAPES,
  SOURCE_URL_FORMS,
} from "@dotln/compiler";
import {
  fetchIssueBundle,
  IssueSourceRefusal,
  requireCompleteIssueBundle,
} from "../src/github-issue-source.js";

const record = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo062-issue.json", import.meta.url),
    "utf8",
  ),
);
const corpus = JSON.parse(
  readFileSync(
    new URL(
      "../../../compiler/fixtures/wo060-source-bundles.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const REPO = "https://github.com/dotln-fixture/target";
const ROOT = "$.data.repository.issue";
const fakeGh = `#!/usr/bin/env node
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
const root = process.env.DOTLN_ISSUE_REPLAY;
const config = JSON.parse(readFileSync(root + '/reply.json', 'utf8'));
const args = process.argv.slice(2);
appendFileSync(root + '/calls.jsonl', JSON.stringify(args) + '\\n');
if (process.env.GH_REPO || process.env.GH_HOST) { process.stderr.write('ambient target leaked'); process.exit(65); }
if (args[0] === '--version') { process.exit(config.fail === 'version' ? 127 : 0); }
if (args[0] === 'auth' && args[1] === 'status') { process.exit(config.fail === 'auth' ? 1 : 0); }
if (args[0] !== 'api' || args[1] !== 'graphql') process.exit(64);
const vars = {};
for (let i = 0; i < args.length; i++) if (args[i] === '-f' || args[i] === '-F') {
  const value = args[++i], eq = value.indexOf('='); vars[value.slice(0, eq)] = value.slice(eq + 1);
}
if (!vars.query.startsWith('query ') || vars.query.includes('mutation')) process.exit(64);
const operation = vars.query.match(/^query (\\w+)/)[1];
if (config.fail === operation) { process.stderr.write(config.diagnostic ?? 'synthetic CLI failure'); process.exit(1); }
if (config.invalidJson) { process.stdout.write(config.invalidJson); process.exit(0); }
if (config.graphqlError) { process.stdout.write(JSON.stringify({data: null, errors: [{message: config.graphqlError}]})); process.exit(0); }
const stateFile = root + '/state.json';
const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf8')) : {issueCalls: 0};
if (operation === 'IssueSource') {
  if (vars.owner !== 'dotln-fixture' || vars.name !== 'target' || vars.number !== '7') process.exit(64);
  const page = config.sourcePages.find(p => p.cursor === (vars.cursor ?? null));
  if (!page) process.exit(64);
  const data = structuredClone(page.data);
  if (config.changeAfter !== undefined && state.issueCalls >= config.changeAfter) data.repository.issue.updatedAt = '2026-09-28T10:06:00Z';
  if (config.commentChangeAfter !== undefined && state.issueCalls >= config.commentChangeAfter) data.repository.issue.comments.nodes[0].body += ' changed';
  state.issueCalls++;
  writeFileSync(stateFile, JSON.stringify(state));
  process.stdout.write(JSON.stringify({data}));
} else if (operation === 'IssueEdits') {
  const page = config.editPages[vars.id]?.find(p => p.cursor === (vars.cursor ?? null));
  if (!page) process.exit(64);
  process.stdout.write(JSON.stringify({data: {node: page.node}}));
} else process.exit(64);
`;

function replay(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "dotln-issue-source-"));
  const bin = join(root, "bin");
  mkdirSync(bin);
  writeFileSync(join(bin, "gh"), fakeGh);
  chmodSync(join(bin, "gh"), 0o755);
  const prior = {
    PATH: process.env["PATH"],
    GH_REPO: process.env["GH_REPO"],
    GH_HOST: process.env["GH_HOST"],
    DOTLN_ISSUE_REPLAY: process.env["DOTLN_ISSUE_REPLAY"],
  };
  process.env["PATH"] = `${bin}:${prior.PATH}`;
  process.env["GH_REPO"] = "ambient/incorrect";
  process.env["GH_HOST"] = "ambient.invalid";
  process.env["DOTLN_ISSUE_REPLAY"] = root;
  t.after(() => {
    for (const [key, value] of Object.entries(prior))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    rmSync(root, { recursive: true, force: true });
  });
  let config = structuredClone(record);
  const save = () => {
    writeFileSync(join(root, "reply.json"), JSON.stringify(config));
    rmSync(join(root, "state.json"), { force: true });
  };
  save();
  return {
    root,
    bin,
    get config() {
      return config;
    },
    issue: () => config.sourcePages[0].data.repository.issue,
    reset: () => {
      config = structuredClone(record);
      save();
    },
    save,
    fetch: (directory = join(root, "store"), repo = REPO) =>
      fetchIssueBundle(repo, 7, { directory, cwd: root }),
    calls: (): string[][] =>
      readFileSync(join(root, "calls.jsonl"), "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line)),
  };
}
function stored(directory: string): string {
  return readdirSync(directory)
    .map((name) => readFileSync(join(directory, name), "utf8"))
    .join("\n");
}

test("WO-062 criterion 1: recorded JSON produces canonical stable rich input, resolving spans and role labels through the fake CLI", async (t) => {
  const h = replay(t);
  const one = await h.fetch();
  const mtime = statSync(one.paths.bundle).mtimeMs;
  const two = await h.fetch();
  assert.equal(one.status, "ready");
  assert.equal(one.hash, two.hash);
  assert.deepEqual(one, two);
  assert.equal(statSync(two.paths.bundle).mtimeMs, mtime);
  assert.equal(
    readFileSync(one.paths.bundle, "utf8"),
    canonicalStringify(one.bundle),
  );
  assert.equal(
    readFileSync(one.paths.receipt, "utf8"),
    canonicalStringify(one.receipt),
  );
  assert.equal(
    decodeSourceBundle(JSON.parse(readFileSync(one.paths.bundle, "utf8")), {
      allowedHosts: ["github.com"],
    }).ok,
    true,
  );
  assert.equal(one.bundle.revisionId, h.issue().updatedAt);
  assert.deepEqual(
    one.bundle.discussion.map((entry) => entry.author),
    ["reporter", "reviewer", "automation"],
  );
  assert.equal(
    one.bundle.sections.find((s) => s.id === "body")!.text,
    h.issue().body,
  );
  for (const item of [...one.bundle.sections, ...one.bundle.discussion])
    assert.equal(resolveSourceSpan(one.bundle, item.span), item.text);
  for (const revision of one.bundle.revisions)
    for (const span of revision.changedSpans)
      assert.doesNotThrow(() => resolveSourceSpan(one.bundle, span));
  assert.equal(one.receipt.history.length, 4);
  assert.deepEqual(
    one.bundle.sections.map((item) => item.id),
    ["title", "body"],
  );
  assert.deepEqual(
    one.bundle.discussion.map((item) => item.text),
    h.issue().comments.nodes.map((item: { body: string }) => item.body),
  );
  assert.deepEqual(one.receipt.omitted, []);
  for (const item of one.receipt.history)
    assert.deepEqual(Object.keys(item).sort(), ["editedAt", "id", "subjectId"]);
  assert.equal(one.receipt.imageReferences.length, 1);
  assert.equal(
    resolveSourceSpan(one.bundle, one.receipt.imageReferences[0]!.referencedBy),
    "![source image](https://github.com/dotln-fixture/target/image.png)",
  );
  assert.equal(one.receipt.imageReferences[0]!.contentHash, "unavailable");
  assert.deepEqual(
    one.bundle.images,
    [],
    "the API supplies no image byte hash",
  );
  assert.equal(requireCompleteIssueBundle(one), one.bundle);
  const bytes = stored(join(h.root, "store"));
  for (const subject of [h.issue(), h.issue().comments.nodes[1]])
    assert.ok(!bytes.includes(subject.userContentEdits.nodes[1].diff));
  for (const account of [
    "fixture-reporter",
    "fixture-reviewer",
    "fixture-check[bot]",
    "dotln-fixture/target",
  ].slice(0, 3))
    assert.ok(!bytes.includes(account));
  const queries = h.calls().filter((args) => args[0] === "api");
  assert.equal(
    queries.length,
    4,
    "first edit pages share the issue/comment query",
  );
  for (const args of queries) {
    assert.deepEqual(args.slice(0, 4), [
      "api",
      "graphql",
      "--hostname",
      "github.com",
    ]);
    assert.ok(args.some((arg) => arg.startsWith("query=query IssueSource(")));
    assert.ok(!args.some((arg) => arg.includes("mutation")));
  }
});

test("WO-062 criterion 2: every declared shape/form is omitted from current text and full historical versions, without persisted text", async (t) => {
  const h = replay(t);
  assert.deepEqual(
    corpus.screened.map((s: { case: string }) => s.case).sort(),
    [
      ...SOURCE_SECRET_SHAPES.map((s) => s.shapeId),
      ...SOURCE_URL_FORMS.map((f) => f.formId),
    ].sort(),
  );
  for (const sample of corpus.screened)
    for (const location of ["body", "comment", "history"]) {
      h.reset();
      const content = `Before 🙂 ${sample.matched} after`;
      if (location === "body") {
        h.issue().body = content;
        h.issue().userContentEdits.nodes[0].diff = content;
      }
      if (location === "comment") {
        h.issue().comments.nodes[1].body = content;
        h.issue().comments.nodes[1].userContentEdits.nodes[0].diff = content;
      }
      if (location === "history")
        h.issue().userContentEdits.nodes[1].diff = content;
      h.save();
      const directory = join(h.root, `${sample.case}-${location}`);
      const result = await h.fetch(directory);
      assert.equal(result.status, "stopped", `${sample.case} ${location}`);
      assert.equal(
        result.receipt.refused.length,
        location === "history" ? 1 : 2,
      );
      const refusal = result.receipt.refused[0]!;
      assert.equal(refusal.shape, sample.case);
      assert.equal(
        Buffer.from(content)
          .subarray(refusal.span.start, refusal.span.end)
          .toString("utf8"),
        sample.matched,
      );
      assert.ok(
        !stored(directory).includes(sample.matched),
        `${sample.case}: no match bytes anywhere in store`,
      );
      assert.ok(
        ![...result.bundle.sections, ...result.bundle.discussion].some(
          (item) => item.id === refusal.id,
        ),
      );
      assert.ok(result.bundle.sections.some((item) => item.id === "title"));
      assert.equal(
        decodeSourceBundle(result.bundle, { allowedHosts: ["github.com"] }).ok,
        true,
      );
      assert.throws(
        () => requireCompleteIssueBundle(result),
        (error) =>
          error instanceof IssueSourceRefusal &&
          error.code === "incomplete" &&
          error.message.includes(refusal.id),
      );
    }
});

test("WO-062 repair: full history cannot restore refused or unavailable current bodies", async (t) => {
  const h = replay(t);
  for (const mode of ["refused", "missing", "unavailable"]) {
    h.reset();
    const prior = h
      .issue()
      .userContentEdits.nodes.map((item: { diff: string }) => item.diff);
    if (mode === "refused") {
      h.issue().body = `Withheld current body ${corpus.screened[0].matched}`;
      h.issue().userContentEdits.nodes[0].diff = h.issue().body;
    } else if (mode === "missing") delete h.issue().body;
    else h.issue().body = null;
    h.save();
    const directory = join(h.root, `body-${mode}`);
    const result = await h.fetch(directory);
    assert.deepEqual(
      result.bundle.sections.map((item) => item.id),
      ["title"],
    );
    const bytes = stored(directory);
    for (const content of prior)
      assert.ok(!bytes.includes(JSON.stringify(content).slice(1, -1)));
    const issueEdits = result.receipt.history.filter(
      (item) => item.subjectId === result.bundle.bundleId,
    );
    for (const edit of issueEdits)
      assert.deepEqual(
        result.bundle.revisions.find((item) => item.revisionId === edit.id)!
          .changedSpans,
        [result.bundle.sections[0]!.span],
      );
    assert.throws(() => requireCompleteIssueBundle(result), IssueSourceRefusal);
  }
});

test("WO-062 repair: each unknown-role comment is named and none of its versions is stored", async (t) => {
  const h = replay(t);
  for (const mode of [
    "issue-null",
    "issue-missing",
    "comment-null",
    "comment-missing",
  ]) {
    h.reset();
    if (mode === "issue-null") h.issue().author = null;
    if (mode === "issue-missing") delete h.issue().author;
    if (mode === "comment-null") h.issue().comments.nodes[1].author = null;
    if (mode === "comment-missing") delete h.issue().comments.nodes[1].author;
    const indexes = mode.startsWith("issue") ? [0, 1] : [1];
    h.save();
    const directory = join(h.root, mode);
    const result = await h.fetch(directory);
    assert.equal(result.status, "stopped");
    assert.deepEqual(
      result.receipt.omitted.map(({ path, reason }) => ({ path, reason })),
      indexes.map((index) => ({
        path: `${ROOT}.comments.nodes[${index}]`,
        reason: "undetermined-role",
      })),
    );
    const bytes = stored(directory);
    for (const index of indexes) {
      const comment = h.issue().comments.nodes[index];
      for (const content of [
        comment.body,
        ...comment.userContentEdits.nodes.map(
          (item: { diff: string }) => item.diff,
        ),
      ])
        assert.ok(!bytes.includes(JSON.stringify(content).slice(1, -1)));
    }
    for (const omitted of result.receipt.omitted) {
      assert.match(omitted.id, /^node:[a-f0-9]{64}$/u);
      assert.ok(
        !result.bundle.discussion.some((item) => item.id === omitted.id),
      );
      for (const edit of result.receipt.history.filter(
        (item) => item.subjectId === omitted.id,
      ))
        assert.deepEqual(
          result.bundle.revisions.find((item) => item.revisionId === edit.id)!
            .changedSpans,
          [],
        );
    }
    assert.throws(
      () => requireCompleteIssueBundle(result),
      (error) =>
        error instanceof IssueSourceRefusal &&
        error.code === "incomplete" &&
        error.message.includes(result.receipt.omitted[0]!.id) &&
        error.message.includes("undetermined-role"),
    );
  }
});

test("WO-062 repair: historical-only text and images do not change current content or add spans", async (t) => {
  const h = replay(t);
  const before = await h.fetch();
  h.issue().userContentEdits.nodes[1].diff =
    "Different full prior body ![old](https://github.com/fixture/old.png)";
  h.issue().comments.nodes[1].userContentEdits.nodes[1].diff =
    "Different full prior comment";
  h.save();
  const after = await h.fetch();
  assert.deepEqual(
    after,
    before,
    "history text is never part of the stored current artifact or receipt",
  );
  assert.equal(after.receipt.imageReferences.length, 1);
  for (const edit of after.receipt.history) {
    const expected =
      edit.subjectId === after.bundle.bundleId
        ? after.bundle.sections.map((item) => item.span)
        : after.bundle.discussion
            .filter((item) => item.id === edit.subjectId)
            .map((item) => item.span);
    const actual = after.bundle.revisions.find(
      (item) => item.revisionId === edit.id,
    )!.changedSpans;
    assert.deepEqual(
      actual.map((span) => canonicalStringify(span)).sort(),
      expected.map((span) => canonicalStringify(span)).sort(),
    );
  }
  // Beyond VER-001's examples: even a non-retained prior version must decode.
  for (const invalid of [42, "bad\u0001version"]) {
    h.issue().userContentEdits.nodes[1].diff = invalid;
    h.save();
    const directory = join(h.root, `invalid-${typeof invalid}`);
    await assert.rejects(
      h.fetch(directory),
      /userContentEdits.nodes\[1\].diff/u,
    );
    assert.equal(existsSync(directory), false);
  }
});

test("WO-062 the parsed forge is the whole allowlist and automation also recognizes the Bot actor type", async (t) => {
  const h = replay(t);
  h.issue().body = "See https://forge.example/dotln-fixture/target/issues/7.";
  h.issue().userContentEdits.nodes = [
    {
      ...h.issue().userContentEdits.nodes[0],
      diff: h.issue().body,
    },
  ];
  h.issue().comments.nodes[2].author = {
    __typename: "Bot",
    login: "fixture-robot",
  };
  h.save();
  const result = await h.fetch(
    undefined,
    "https://forge.example/dotln-fixture/target.git",
  );
  assert.equal(result.status, "ready");
  assert.equal(result.bundle.discussion[2]!.author, "automation");
  assert.ok(
    h
      .calls()
      .filter((args) => args[0] === "api")
      .every((args) => args[3] === "forge.example"),
  );
  h.issue().body += " https://github.com/other/target";
  h.save();
  assert.equal(
    (
      await h.fetch(
        join(h.root, "other"),
        "https://forge.example/dotln-fixture/target",
      )
    ).status,
    "stopped",
  );
});

test("WO-062 criterion 3: absent CLI, authentication, failing CLI and unreadable JSON refuse without stores or echoed diagnostics", async (t) => {
  const h = replay(t);
  const diagnostic = `private diagnostic ghp_${"SyntheticOnly1".repeat(4)}`;
  const cases = [
    { fail: "version", reason: /gh is required/u },
    { fail: "auth", reason: /authentication is required/u },
    { fail: "IssueSource", reason: /gh IssueSource failed/u },
    {
      invalidJson: diagnostic,
      reason: /\$: gh IssueSource returned invalid JSON/u,
    },
    { graphqlError: diagnostic, reason: /\$\.errors: GraphQL errors/u },
  ];
  for (const [index, entry] of cases.entries()) {
    h.reset();
    Object.assign(h.config, entry, { diagnostic });
    h.save();
    const directory = join(h.root, `failure-${index}`);
    await assert.rejects(
      h.fetch(directory),
      (error) =>
        error instanceof IssueSourceRefusal &&
        entry.reason.test(error.message) &&
        !error.message.includes(diagnostic),
    );
    assert.equal(existsSync(directory), false);
  }
  h.reset();
  process.env["PATH"] = join(h.root, "missing-bin");
  await assert.rejects(
    h.fetch(),
    /gh is required for the read-only issue fetch/u,
  );
  assert.equal(existsSync(join(h.root, "store")), false);
});

test("WO-062 malformed fields report their API paths and write nothing, including failure after a paginated edit read", async (t) => {
  const h = replay(t);
  const cases = [
    {
      edit: () => {
        h.issue().body = {};
      },
      path: `${ROOT}.body`,
    },
    {
      edit: () => {
        h.issue().comments.nodes[0].createdAt = "2026-02-30T00:00:00Z";
      },
      path: `${ROOT}.comments.nodes[0].createdAt`,
    },
    {
      edit: () => {
        h.issue().comments.nodes[0].author.login = 42;
      },
      path: `${ROOT}.comments.nodes[0].author.login`,
    },
    {
      edit: () => {
        h.issue().comments.nodes[1].id = h.issue().comments.nodes[0].id;
      },
      path: `${ROOT}.comments.nodes[1].id`,
    },
    {
      edit: () => {
        h.issue().comments.pageInfo.hasNextPage = "yes";
      },
      path: `${ROOT}.comments.pageInfo.hasNextPage`,
    },
    {
      edit: () => {
        h.issue().updatedAt = "not-a-timestamp";
      },
      path: `${ROOT}.updatedAt`,
    },
    {
      edit: () => {
        delete h.issue().id;
      },
      path: `${ROOT}.id`,
    },
  ];
  for (const [index, entry] of cases.entries()) {
    h.reset();
    entry.edit();
    h.save();
    const directory = join(h.root, `malformed-${index}`);
    await assert.rejects(
      h.fetch(directory),
      (error) =>
        error instanceof IssueSourceRefusal &&
        error.message.includes(entry.path),
    );
    assert.equal(existsSync(directory), false);
  }
  h.reset();
  h.issue().userContentEdits.pageInfo = {
    hasNextPage: true,
    endCursor: "edit-next",
  };
  h.config.fail = "IssueEdits";
  h.save();
  await assert.rejects(h.fetch(), /gh IssueEdits failed/u);
  assert.equal(existsSync(join(h.root, "store")), false);
});

test("WO-062 criterion 3: missing declared fields are absent receipts, with no invented body, author or history", async (t) => {
  const h = replay(t);
  delete h.issue().body;
  delete h.issue().comments.nodes[0].author;
  h.issue().comments.nodes[1].userContentEdits = null;
  h.issue().userContentEdits.nodes[0].diff = null;
  h.save();
  const result = await h.fetch();
  assert.equal(result.status, "stopped");
  assert.deepEqual(result.receipt.absent, [
    { path: `${ROOT}.body`, reason: "missing" },
    { path: `${ROOT}.userContentEdits.nodes[0].diff`, reason: "unavailable" },
    { path: `${ROOT}.comments.nodes[0].author`, reason: "missing" },
    {
      path: `${ROOT}.comments.nodes[1].userContentEdits`,
      reason: "unavailable",
    },
  ]);
  assert.ok(!result.bundle.sections.some((s) => s.id === "body"));
  assert.deepEqual(
    result.bundle.discussion.map((d) => d.author),
    ["reviewer", "automation"],
  );
  assert.equal(result.receipt.history.length, 2);
  assert.ok(
    result.receipt.history.every((item) => !Object.hasOwn(item, "summarySpan")),
  );
  assert.throws(() => requireCompleteIssueBundle(result), /undetermined-role/u);
  h.reset();
  delete h.issue().author;
  h.save();
  const unknownReporter = await h.fetch(join(h.root, "unknown-reporter"));
  assert.equal(unknownReporter.status, "stopped");
  assert.deepEqual(
    unknownReporter.bundle.discussion.map((d) => d.author),
    ["automation"],
    "missing issue author cannot default a human's role to reviewer",
  );
  assert.deepEqual(unknownReporter.receipt.absent, [
    { path: `${ROOT}.author`, reason: "missing" },
  ]);
  assert.deepEqual(
    unknownReporter.receipt.omitted.map(({ path, reason }) => ({
      path,
      reason,
    })),
    [0, 1].map((index) => ({
      path: `${ROOT}.comments.nodes[${index}]`,
      reason: "undetermined-role",
    })),
  );
});

test("WO-062 pagination consumes every independent connection, rejects non-advancing cursors and never stores a partial read", async (t) => {
  const h = replay(t);
  const first = h.config.sourcePages[0];
  const originalIssueEdit = h.issue().userContentEdits.nodes[1];
  const originalCommentEdit =
    h.issue().comments.nodes[1].userContentEdits.nodes[1];
  h.issue().updatedAt = "2026-09-28T10:06:00Z";
  h.issue().userContentEdits.nodes = [
    {
      ...h.issue().userContentEdits.nodes[0],
      editedAt: "2026-09-28T10:06:00Z",
    },
  ];
  h.issue().comments.nodes[1].updatedAt = "2026-09-28T10:05:00Z";
  h.issue().comments.nodes[1].userContentEdits.nodes = [
    {
      ...h.issue().comments.nodes[1].userContentEdits.nodes[0],
      editedAt: "2026-09-28T10:05:00Z",
    },
  ];
  const second = structuredClone(first);
  first.data.repository.issue.comments.nodes =
    first.data.repository.issue.comments.nodes.slice(0, 2);
  first.data.repository.issue.comments.pageInfo = {
    hasNextPage: true,
    endCursor: "comments-next",
  };
  second.cursor = "comments-next";
  second.data.repository.issue.comments.nodes =
    second.data.repository.issue.comments.nodes.slice(2);
  h.config.sourcePages.push(second);
  for (const page of h.config.sourcePages)
    page.data.repository.issue.userContentEdits.pageInfo = {
      hasNextPage: true,
      endCursor: "edit-next",
    };
  h.config.editPages.I_fixture_issue = [
    {
      cursor: "edit-next",
      node: {
        __typename: "Issue",
        id: "I_fixture_issue",
        userContentEdits: {
          nodes: [
            {
              ...originalIssueEdit,
              editedAt: "2026-09-28T10:01:00Z",
            },
          ],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    },
  ];
  // A separate comment-history connection has its own cursor and node type.
  first.data.repository.issue.comments.nodes[1].userContentEdits.pageInfo = {
    hasNextPage: true,
    endCursor: "comment-edit-next",
  };
  h.config.editPages.IC_fixture_reviewer = [
    {
      cursor: "comment-edit-next",
      node: {
        __typename: "IssueComment",
        id: "IC_fixture_reviewer",
        userContentEdits: {
          nodes: [
            {
              ...originalCommentEdit,
              editedAt: "2026-09-28T10:04:00Z",
            },
          ],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    },
  ];
  h.save();
  const result = await h.fetch();
  assert.equal(result.bundle.discussion.length, 3);
  assert.equal(result.bundle.revisions.length, 4);
  assert.equal(result.receipt.history.length, 4);
  assert.deepEqual(
    result.receipt.history.map((item) => item.editedAt),
    [
      "2026-09-28T10:01:00Z",
      "2026-09-28T10:04:00Z",
      "2026-09-28T10:05:00Z",
      "2026-09-28T10:06:00Z",
    ],
  );
  assert.deepEqual(
    result.bundle.revisions.map((item) => item.revisionId),
    result.receipt.history.map((item) => item.id),
  );
  assert.equal(
    h
      .calls()
      .filter((args) =>
        args.some((a) => a.startsWith("query=query IssueEdits(")),
      ).length,
    2,
  );
  h.reset();
  const loop = structuredClone(h.config.sourcePages[0]);
  loop.cursor = "loop";
  h.config.sourcePages[0].data.repository.issue.comments.pageInfo = {
    hasNextPage: true,
    endCursor: "loop",
  };
  loop.data.repository.issue.comments.pageInfo = {
    hasNextPage: true,
    endCursor: "loop",
  };
  h.config.sourcePages.push(loop);
  h.save();
  const directory = join(h.root, "loop-store");
  await assert.rejects(
    h.fetch(directory),
    /comments.pageInfo.endCursor: non-advancing cursor/u,
  );
  assert.equal(existsSync(directory), false);
});

test("WO-062 changed issue or discussion during fetch refuses and stores nothing", async (t) => {
  const h = replay(t);
  for (const key of ["changeAfter", "commentChangeAfter"]) {
    h.reset();
    h.config[key] = 1;
    h.save();
    const directory = join(h.root, key);
    await assert.rejects(
      h.fetch(directory),
      (error) =>
        error instanceof IssueSourceRefusal && error.code === "changed",
    );
    assert.equal(existsSync(directory), false);
  }
});

test("WO-062 the existing screen's declared limits pass unchanged", async (t) => {
  const h = replay(t);
  h.issue().body = corpus.limits.bundle.sections[0].text;
  h.save();
  const result = await h.fetch();
  assert.equal(result.status, "ready");
  for (const value of corpus.limits.strings)
    assert.ok(stored(join(h.root, "store")).includes(value));
});

test("WO-062 immutable hash storage refuses a collision or symlink without replacing bytes", async (t) => {
  const h = replay(t);
  const one = await h.fetch();
  writeFileSync(one.paths.bundle, "collision");
  await assert.rejects(
    h.fetch(),
    (error) => error instanceof IssueSourceRefusal && error.code === "storage",
  );
  assert.equal(readFileSync(one.paths.bundle, "utf8"), "collision");
  rmSync(one.paths.bundle);
  const sentinel = join(h.root, "sentinel");
  writeFileSync(sentinel, "retained sentinel");
  symlinkSync(sentinel, one.paths.bundle);
  await assert.rejects(h.fetch(), /not a regular file/u);
  assert.equal(readFileSync(sentinel, "utf8"), "retained sentinel");
});

test("WO-062 invalid caller arguments refuse before reading or writing", async (t) => {
  const h = replay(t);
  const directory = join(h.root, "store");
  await assert.rejects(
    fetchIssueBundle(REPO, 0, { directory }),
    /positive integer/u,
  );
  await assert.rejects(
    fetchIssueBundle("https://github.com/one", 7, { directory, cwd: h.root }),
    /repository URL/u,
  );
  await assert.rejects(
    fetchIssueBundle(REPO, 7, { directory: "" }),
    /caller-named store/u,
  );
  assert.equal(existsSync(directory), false);
  assert.equal(existsSync(join(h.root, "calls.jsonl")), false);
});
