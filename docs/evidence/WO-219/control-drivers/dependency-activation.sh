#!/usr/bin/env bash
set -euo pipefail
repository="${1:?isolated current control copy required}"
repository="$(cd -- "$repository" && pwd -P)"
source "$repository/scripts/test-temp-root.sh"
tmp_base="$(resolve_test_tmp_base "${TMPDIR:-/tmp}")"
test_root_prefix="dotln-wo219-history-control-test"
create_test_temp_root "$tmp_base" "$test_root_prefix"
test_root="$test_temp_root_result"
install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"
cd -- "$repository"
node "$repository/scripts/test-dependency-resume.mjs" "$test_root"
