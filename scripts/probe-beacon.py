"""Bounded WO-020 metadata probe; synthetic files only, on this checkout's volume."""
import errno
import json
import os
import platform
import plistlib
from pathlib import Path
import subprocess
import tempfile

report = {"scope": "synthetic temporary directory on checkout volume; inside Codex sandbox",
          "versions": {"macOS": platform.mac_ver()[0], "python": platform.python_version()},
          "observations": {}}
for tool in ("node", "npm", "codex"):
    report["versions"][tool] = subprocess.check_output([tool, "--version"], text=True, stderr=subprocess.PIPE).strip()

def attempt(action):
    try:
        return {"result": action()}
    except subprocess.CalledProcessError as error:
        return {"command_exit": error.returncode}
    except OSError as error:
        return {"error": errno.errorcode.get(error.errno, str(error.errno))}

with tempfile.TemporaryDirectory(prefix=".beacon-probe-", dir=Path(__file__).resolve().parent.parent) as tmp:
    root = Path(tmp)
    def filesystem():
        data = plistlib.loads(subprocess.check_output(["diskutil", "info", "-plist", str(root)], stderr=subprocess.PIPE))
        return {key: data[key] for key in ("FilesystemType", "FileSystemPersonality") if key in data}
    report["observations"]["filesystem"] = attempt(filesystem)
    sample = root / "sample"
    sample.write_bytes(b"original synthetic data")
    wanted_ns = 1_234_567_000
    os.utime(sample, ns=(wanted_ns, wanted_ns))
    before = sample.stat()
    target = root / "renamed"
    sample.rename(target)
    after = target.stat()
    report["observations"]["rename_and_utimes"] = {
        "size_before": before.st_size, "size_after": after.st_size,
        "mtime_ns_requested": wanted_ns, "mtime_ns_before": before.st_mtime_ns,
        "mtime_ns_after": after.st_mtime_ns,
    }
    sparse = root / "sparse"
    with sparse.open("wb") as stream:
        stream.truncate(65536)
    report["observations"]["sparse"] = {"size": sparse.stat().st_size, "blocks": sparse.stat().st_blocks}
    target.chmod(0)
    try:
        report["observations"]["read_denied"] = {
            "read": attempt(lambda: len(target.read_bytes())), "stat_size": target.stat().st_size}
    finally:
        target.chmod(0o600)
    search = root / "search"
    search.mkdir()
    known = search / "known"
    known.write_bytes(b"x")
    search.chmod(0o111)
    try:
        report["observations"]["search_only"] = {
            "listing": attempt(lambda: len(os.listdir(search))), "known_stat": attempt(lambda: known.stat().st_size)}
    finally:
        search.chmod(0o700)
    report["observations"]["names"] = {
        "bytes_255": attempt(lambda: (root / ("a" * 255)).write_bytes(b"x")),
        "bytes_256": attempt(lambda: (root / ("b" * 256)).write_bytes(b"x")),
    }
    (root / "MiXeD").write_bytes(b"case")
    report["observations"]["case_insensitive"] = (root / "mixed").exists()
    for length in (1023, 1024):
        link = root / ("link" + str(length))
        def make_link():
            link.symlink_to("x" * length)
            return {"readlink_bytes": len(os.readlink(link).encode()), "lstat_size": link.lstat().st_size}
        report["observations"]["symlink_" + str(length)] = attempt(make_link)
    def xattr():
        subprocess.run(["xattr", "-w", "org.dotln.beacon-probe", "x" * 65536, str(target)], check=True, capture_output=True)
        listing = subprocess.check_output(["ls", "-l@", str(target)], text=True)
        return {"read_bytes": len(subprocess.check_output(["xattr", "-p", "org.dotln.beacon-probe", str(target)]).rstrip(b"\n")),
                "ls_exposes_name_and_size": "org.dotln.beacon-probe" in listing and "65536" in listing}
    report["observations"]["xattr"] = attempt(xattr)
    node_probe = r'''
import { writeFileSync, utimesSync, statSync } from "node:fs";
const path = process.argv[1] + "/node-time";
writeFileSync(path, "synthetic");
const results = [];
for (const ms of [0, 1, 1234, 1200000, 1200001, 1200002, 1200003, 1200005]) {
  utimesSync(path, ms / 1000, ms / 1000);
  const directNs = String(statSync(path, { bigint: true }).mtimeNs);
  utimesSync(path, ms / 1000 + 0.0000005, ms / 1000 + 0.0000005);
  results.push({ ms, directNs, centeredNs: String(statSync(path, { bigint: true }).mtimeNs) });
}
console.log(JSON.stringify(results));
'''
    report["observations"]["node_utimes"] = json.loads(subprocess.check_output(
        ["node", "--input-type=module", "-e", node_probe, str(root)], text=True))

print(json.dumps(report, indent=2))
