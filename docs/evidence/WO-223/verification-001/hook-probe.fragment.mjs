// VER-001 hook probe fragment for WO-223. `probes.mjs add-probes <snapshot>`
// appends it to <snapshot>/scripts/test-harness.mjs, whose fixture, invoke,
// input, journalRows and helpers it uses; it is not a standalone module.
// It prints one PROBE-ROW line per helper spelling and one PROBE-SAMPLE line.
test("VERIFIER PROBE close helper advisory variations", () => {
  const root = fixture();
  try {
    runGit(root, ["switch", "-c", "main"], fixtureGitOptions);
    const status = {
      ...control,
      phase: "closed",
      legalNextActions: ["release-close"],
    };
    write(root, "docs/control/fixture-status.json", json(status));
    const helper = `${shellQuote(process.execPath)} ${shellQuote(join(root, "scripts/release.mjs"))} close WO-999`;
    const scope = {
      sessionKey: sha256("synthetic-session"),
      workOrder: "WO-999",
      phase: "closed",
    };
    const run = (command) =>
      invoke(
        root,
        "permissions",
        input(root, "PreToolUse", {
          tool_name: "Bash",
          tool_input: { command },
        }),
      );
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: release close" }),
    );
    const report = [];
    for (const suffix of [
      "--publish",
      "--dry-run",
      "--publish --material 'docs/control/local/fixture=preserve'",
      `--publish --material ${shellQuote("docs/control/local/fixture's=preserve")} --material 'docs/control/local/second=disposable'`,
    ]) {
      const before = journalRows(root, scope).length;
      const response = run(`${helper} ${suffix}`);
      report.push({
        kind: "base-admitted",
        suffix,
        decision: response.hookSpecificOutput?.permissionDecision ?? null,
        newRows: journalRows(root, scope).length - before,
      });
      assert.equal(
        response.hookSpecificOutput?.permissionDecision,
        "allow",
        suffix,
      );
    }
    for (const [suffix, expected] of [
      ["--publish > close.log", "shell operator or redirect"],
      ["--publish 2>&1 | tee close.log", "shell operator or redirect"],
      ["--publish | cat", "shell operator or redirect"],
      ["--publish; echo done", "shell operator or redirect"],
      ["--publish && true", "shell operator or redirect"],
      ["--publish\necho hi", "shell operator or redirect"],
      ["--publish >/dev/null 2>&1", "shell operator or redirect"],
      ["--dry-run | head", "shell operator or redirect"],
      [
        "--publish --material 'docs/a>b=preserve' > log",
        "shell operator or redirect",
      ],
      [
        '--publish --material "docs/x=preserve"',
        "non-canonical material flag quoting or value",
      ],
      [
        "--publish --material docs/x=preserve",
        "non-canonical material flag quoting or value",
      ],
      [
        "--publish --material 'docs/x=keep'",
        "non-canonical material flag quoting or value",
      ],
      [
        "--publish --material $(echo fixture)=preserve",
        "non-canonical material flag quoting or value",
      ],
      ["--dry-run --material 'docs/x=preserve'", null],
      ["--publish --material 'docs/x=preserve' --force", null],
      [
        "--publish --force",
        "extra or non-canonical words or whitespace after the helper",
      ],
      [
        "--publish ",
        "extra or non-canonical words or whitespace after the helper",
      ],
      [
        " --publish",
        "extra or non-canonical words or whitespace after the helper",
      ],
      [
        "--Publish",
        "extra or non-canonical words or whitespace after the helper",
      ],
      ["--publish $(true)", null],
      ["--publish\t", null],
    ]) {
      const before = journalRows(root, scope).length;
      const response = run(`${helper} ${suffix}`);
      const rows = journalRows(root, scope);
      const advisory = rows.at(-1)?.advisory ?? "";
      const mismatch =
        /spelling missing \(([^)]*)\)/u.exec(advisory)?.[1] ?? null;
      report.push({
        kind: "withheld",
        suffix,
        decision: response.hookSpecificOutput?.permissionDecision ?? null,
        newRows: rows.length - before,
        mismatch,
        namesPublish: advisory.includes(`${helper} --publish`),
        namesDryRun: advisory.includes(`${helper} --dry-run`),
        displayed:
          typeof response.systemMessage === "string" &&
          response.systemMessage.includes("spelling missing"),
      });
      assert.notEqual(
        response.hookSpecificOutput?.permissionDecision,
        "allow",
        suffix,
      );
      if (expected) assert.equal(mismatch, expected, suffix);
    }
    const sample = journalRows(root, scope).at(-1).advisory;
    console.log(
      "PROBE-SAMPLE " +
        sample
          .replaceAll(root, "<fixture>")
          .replaceAll(process.execPath, "<node>"),
    );
    for (const row of report) console.log("PROBE-ROW " + JSON.stringify(row));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
