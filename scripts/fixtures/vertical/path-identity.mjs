import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  chmodSync,
  mkdirSync,
  realpathSync,
  readdirSync,
  statSync,
  statfsSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import { SourceChangeWorktree } from "../../../packages/skeleton/dist/src/source-change-worktree.js";
import { validateSourceChangeEnvironment } from "../../../packages/skeleton/dist/src/source-change-environment.js";
import { validateBeaconDirectory } from "../../../packages/beacons/src/beacon-io.mjs";
import {
  emitGroupBeacon,
  readGroupBeacon,
  sweepControlBeacons,
  prepareBeaconDisposal,
  renderControlConstellation,
} from "../../../packages/beacons/src/control-beacon-fs.mjs";
import { probeBeaconStorage } from "../../../packages/beacons/src/beacon-io.mjs";
import {
  sourceFixtureOptions,
  fixtureGit,
  launchpad,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";
export function checkPathIdentity(f) {
  const created = join(f.root, "Caf\u00e9");
  mkdirSync(created);
  const canonical = execFileSync("/bin/pwd", ["-P"], {
    cwd: created,
    encoding: "utf8",
  }).replace(/\n$/u, "");
  fixtureGit(canonical, "init", "--initial-branch=main");
  const mount = join(canonical, "mount");
  mkdirSync(mount);
  fixtureGit(mount, "init", "--initial-branch=main");
  const message = join(mount, "message.txt");
  writeFileSync(message, "fix: fixture\n");
  const profile = {
    profileId: "source-change-v1",
    mounts: [{ path: mount, access: "read-write" }],
    writableSurfaces: [mount],
    worktreeParent: canonical,
    launchpadCheckout: launchpad,
  };
  const unicode =
    canonical.normalize("NFC") === canonical
      ? canonical.normalize("NFD")
      : canonical.normalize("NFC");
  const variants = {
    case: canonical.replace("Caf", "caf"),
    volume: `/System/Volumes/Data${canonical}`,
    unicode,
  };
  const volume = execFileSync("df", ["-P", canonical], { encoding: "utf8" })
    .trim()
    .split("\n")
    .at(-1)
    .split(/\s+/u)[0];
  let type = `statfs:${statfsSync(canonical).type.toString(16)}`;
  if (process.platform === "darwin") {
    const plist = execFileSync("diskutil", ["info", "-plist", volume]);
    const info = JSON.parse(
      execFileSync("plutil", ["-convert", "json", "-o", "-", "-"], {
        input: plist,
        encoding: "utf8",
      }),
    );
    type = info.FilesystemType ?? info.FileSystemPersonality ?? type;
  }
  const filesystem = {
    type,
    volume,
    caseSensitive: !existsSync(variants.case),
  };
  const options = sourceFixtureOptions(f.root, f.now);
  const before = {
    refs: fixtureGit(f.target, "for-each-ref"),
    trees: fixtureGit(f.target, "worktree", "list", "--porcelain"),
    files: readdirSync(join(f.root, "trees")),
  };
  const observations = [];
  for (const [kind, spelling] of Object.entries(variants)) {
    const constructed =
      spelling !== canonical &&
      existsSync(spelling) &&
      statSync(spelling).ino === statSync(canonical).ino;
    observations.push({
      kind,
      constructed,
      platform: process.platform,
      filesystem,
    });
    if (!constructed) continue;
    assert.throws(
      () => new SourceChangeHost({ ...options, worktreeParent: spelling }),
      /canonical|identity/u,
      `parent ${kind}`,
    );
    assert.throws(
      () => new SourceChangeHost({ ...options, launchpadCheckout: spelling }),
      /canonical|identity/u,
      `launchpad ${kind}`,
    );
    assert.throws(
      () =>
        validateSourceChangeEnvironment(
          { ...profile, worktreeParent: spelling },
          mount,
          message,
        ),
      /canonical|identity/u,
      `environment parent ${kind}`,
    );
    assert.throws(
      () =>
        validateSourceChangeEnvironment(
          { ...profile, launchpadCheckout: spelling },
          mount,
          message,
        ),
      /canonical|identity/u,
      `environment launchpad ${kind}`,
    );
    assert.throws(
      () => validateBeaconDirectory(join(spelling, "beacons"), f.target),
      /canonical|identity/u,
      `beacon ${kind}`,
    );
  }
  assert.throws(
    () =>
      new SourceChangeHost({
        ...options,
        worktreeParent: join(canonical, "missing"),
      }),
  );
  assert.throws(() =>
    validateSourceChangeEnvironment(
      { ...profile, worktreeParent: join(canonical, "missing") },
      mount,
      message,
    ),
  );
  assert.throws(() => validateBeaconDirectory("/dev/null/child", f.target));
  const unreadable = join(canonical, "unreadable");
  mkdirSync(unreadable);
  chmodSync(unreadable, 0);
  try {
    assert.throws(
      () => new SourceChangeHost({ ...options, worktreeParent: unreadable }),
      /EACCES|permission|identity|canonical/u,
    );
    assert.throws(
      () =>
        validateSourceChangeEnvironment(
          { ...profile, worktreeParent: unreadable },
          mount,
          message,
        ),
      /EACCES|permission|identity|canonical/u,
    );
    assert.throws(
      () => validateBeaconDirectory(unreadable, f.target),
      /EACCES|permission|identity|canonical/u,
    );
  } finally {
    chmodSync(unreadable, 0o700);
  }
  for (const suffix of [" ", "\t"]) {
    const trailing = join(canonical, `trailing${suffix}`);
    mkdirSync(trailing);
    assert.doesNotThrow(
      () =>
        new SourceChangeWorktree({
          ...new SourceChangeHost(options).tree.options,
          parent: trailing,
        }),
    );
    const child = join(trailing, "mount");
    mkdirSync(child);
    fixtureGit(child, "init", "--initial-branch=main");
    const childMessage = join(child, "message.txt");
    writeFileSync(childMessage, "fix: fixture\n");
    assert.doesNotThrow(() =>
      validateSourceChangeEnvironment(
        {
          ...profile,
          worktreeParent: trailing,
          mounts: [{ path: child, access: "read-write" }],
          writableSurfaces: [child],
        },
        child,
        childMessage,
      ),
    );
    assert.equal(validateBeaconDirectory(trailing, f.target), trailing);
  }
  assert.deepEqual(
    {
      refs: fixtureGit(f.target, "for-each-ref"),
      trees: fixtureGit(f.target, "worktree", "list", "--porcelain"),
      files: readdirSync(join(f.root, "trees")),
    },
    before,
  );
  validateSourceChangeEnvironment(profile, mount, message);
  assert.equal(
    validateBeaconDirectory(join(f.root, "canonical-beacons"), f.target),
    join(f.root, "canonical-beacons"),
  );
  if (!filesystem.caseSensitive) {
    const parent = join(f.root, "RegisteredTrees");
    mkdirSync(parent);
    const spelling = join(f.root, "registeredtrees", "wo-999");
    fixtureGit(f.target, "worktree", "add", "-b", "wo-999", spelling);
    const worktrees = fixtureGit(f.target, "worktree", "list", "--porcelain")
      .split("\n\n")
      .map((row) =>
        Object.fromEntries(
          row
            .split("\n")
            .filter(Boolean)
            .map((line) => {
              const at = line.indexOf(" ");
              return [line.slice(0, at), line.slice(at + 1)];
            }),
        ),
      )
      .map(({ worktree, branch }) => ({ worktree, branch }));
    const rows = sweepControlBeacons(worktrees);
    assert.equal(rows.length, 2);
    assert.equal(rows.filter((r) => r.refusal).length, 1);
    assert.ok(rows.find((r) => r.refusal).refusal.path.startsWith(spelling));
    assert.ok(rows.some((r) => r.decoded.status === "absent" && !r.refusal));
    assert.match(
      renderControlConstellation(rows, f.now()),
      /registeredtrees\/wo-999/u,
    );
    emitGroupBeacon(
      f.target,
      worktrees,
      f.now(),
      probeBeaconStorage(join(f.root, "group-storage")),
    );
    assert.equal(readGroupBeacon(worktrees, rows).decoded.status, "decoded");
    assert.throws(
      () => prepareBeaconDisposal(spelling),
      /registeredtrees\/wo-999/u,
    );
    assert.doesNotThrow(() => prepareBeaconDisposal(join(parent, "wo-999"))());
    fixtureGit(f.target, "worktree", "remove", spelling);
    fixtureGit(f.target, "branch", "-d", "wo-999");
  }
  // One registered worktree's unreadable beacon directory is that row's named
  // refusal; the healthy row is still swept and single-root guards refuse.
  const sealedTree = join(f.root, "trees", "wo-998");
  fixtureGit(f.target, "worktree", "add", "-b", "wo-998", sealedTree);
  const set = [
    { worktree: f.target, branch: "refs/heads/main" },
    { worktree: sealedTree, branch: "refs/heads/wo-998" },
  ];
  const beacons = join(sealedTree, ".control-beacons");
  mkdirSync(join(beacons, "public"), { recursive: true });
  mkdirSync(join(beacons, "groups"));
  try {
    for (const [sealed, mode, reason] of [
      [join(beacons, "public"), 0, "directory identity cannot be read"],
      [join(beacons, "public"), 0o300, "directory cannot be read"],
      [beacons, 0, "directory cannot be read"],
    ]) {
      chmodSync(sealed, mode);
      try {
        const rows = sweepControlBeacons(set);
        assert.deepEqual(
          rows.filter((r) => r.refusal).map((r) => r.refusal),
          [{ path: join(beacons, "public"), reason }],
        );
        assert.ok(
          rows.some((r) => !r.refusal && r.decoded.status === "absent"),
        );
        assert.ok(
          renderControlConstellation(rows, f.now()).includes(
            `refused | ${reason}: ${join(beacons, "public")}`,
          ),
        );
        assert.doesNotThrow(() => readGroupBeacon(set, rows));
        if (mode === 0)
          assert.throws(
            () => validateBeaconDirectory(sealed, f.target),
            (error) => error.message.includes(sealed),
          );
      } finally {
        chmodSync(sealed, 0o700);
      }
    }
    chmodSync(join(beacons, "groups"), 0);
    try {
      assert.doesNotThrow(() => readGroupBeacon(set, sweepControlBeacons(set)));
      assert.throws(
        () =>
          emitGroupBeacon(
            sealedTree,
            set,
            f.now(),
            probeBeaconStorage(join(f.root, "sealed-group-storage")),
          ),
        /identity cannot be read: .*groups/u,
      );
    } finally {
      chmodSync(join(beacons, "groups"), 0o700);
    }
  } finally {
    fixtureGit(f.target, "worktree", "remove", "--force", sealedTree);
    fixtureGit(f.target, "branch", "-D", "wo-998");
  }
  return observations;
}
