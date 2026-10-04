// WO-185: unprivileged macOS physical footprint, including compressed memory.
// No process arguments, executable paths or account identifiers are emitted.
#include <libproc.h>
#include <sys/proc_info.h>
#include <sys/resource.h>
#include <sys/sysctl.h>
#include <unistd.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// XNU's publicly published proc_info_private.h ABI. The original parent
// unique ID survives reparenting, unlike ppid. Treat an unavailable ABI as
// missing ownership evidence, never as a PID-only match.
struct dotln_unique_info {
  uint8_t uuid[16];
  uint64_t uniqueid, parent_uniqueid;
  int32_t idversion;
  uint32_t reserve2;
  uint64_t reserve3, reserve4;
};


// Compare only anonymous Unix socket identities. Never emit addresses, paths,
// arguments or environments. The kernel recycles a freed socket's identity
// and descriptor number, so a watch is sound only while its supervisor holds
// the named endpoint open; supervisors withdraw a watch before releasing it.
struct watch { char key[65]; int pid, fd; uint64_t sec, usec, handle, peer, since_sec, since_usec; };
static int unix_socket(int pid, int fd, struct socket_fdinfo *out) {
  return proc_pidfdinfo(pid, fd, PROC_PIDFDSOCKETINFO, out, sizeof(*out)) == sizeof(*out)
    && out->psi.soi_kind == SOCKINFO_UN;
}
static struct proc_fdinfo *fds_for(int pid, int *count) {
  int bytes = proc_pidinfo(pid, PROC_PIDLISTFDS, 0, NULL, 0);
  if (bytes <= 0 || bytes > 16 * 1024 * 1024) { *count = 0; return NULL; }
  int capacity = bytes + 4096;
  struct proc_fdinfo *fds = calloc(1, capacity);
  if (!fds) { *count = 0; return NULL; }
  bytes = proc_pidinfo(pid, PROC_PIDLISTFDS, 0, fds, capacity);
  if (bytes < 0 || bytes >= capacity) { free(fds); *count = 0; return NULL; }
  *count = bytes / sizeof(*fds);
  return fds;
}
static int capture(int child, int supervisor) {
  struct proc_bsdinfo info = {0};
  if (proc_pidinfo(supervisor, PROC_PIDTBSDINFO, 0, &info, sizeof(info)) != sizeof(info)) return 2;
  int count = 0, captured = 0;
  struct proc_fdinfo *fds = fds_for(supervisor, &count);
  for (int output = 1; output <= 2; output++) {
    struct socket_fdinfo child_socket = {0};
    if (!unix_socket(child, output, &child_socket)) continue;
    for (int i = 0; i < count; i++) {
      if (fds[i].proc_fdtype != PROX_FDTYPE_SOCKET) continue;
      struct socket_fdinfo parent = {0};
      if (unix_socket(supervisor, fds[i].proc_fd, &parent)
          && parent.psi.soi_proto.pri_un.unsi_conn_so == child_socket.psi.soi_so
          && child_socket.psi.soi_proto.pri_un.unsi_conn_so == parent.psi.soi_so) {
        printf("D %d %llu.%06llu %d %llu\n", supervisor,
          (unsigned long long)info.pbi_start_tvsec, (unsigned long long)info.pbi_start_tvusec,
          fds[i].proc_fd, (unsigned long long)parent.psi.soi_so);
        captured++; break;
      }
    }
  }
  free(fds);
  return captured == 2 ? 0 : 3;
}
static uint64_t live_peer(struct watch *w) {
  struct proc_bsdinfo info = {0}; struct socket_fdinfo socket = {0};
  if (proc_pidinfo(w->pid, PROC_PIDTBSDINFO, 0, &info, sizeof(info)) != sizeof(info)
      || info.pbi_start_tvsec != w->sec || info.pbi_start_tvusec != w->usec
      || !unix_socket(w->pid, w->fd, &socket) || socket.psi.soi_so != w->handle) return 0;
  return socket.psi.soi_proto.pri_un.unsi_conn_so;
}

int main(int argc, char **argv) {
  if (argc == 4 && strcmp(argv[1], "--capture") == 0) return capture(atoi(argv[2]), atoi(argv[3]));
  int light = 0, watch_count = 0;
  struct watch *watches = calloc(argc, sizeof(*watches));
  if (!watches) return 1;
  for (int arg = 1; arg < argc; arg++) {
    if (strcmp(argv[arg], "--light") == 0) { light = 1; continue; }
    struct watch *w = &watches[watch_count];
    unsigned long long sec, usec, handle, since_sec, since_usec;
    if (sscanf(argv[arg], "%64[^:]:%d:%llu.%llu:%d:%llu:%llu.%llu", w->key, &w->pid, &sec, &usec, &w->fd, &handle, &since_sec, &since_usec) != 8) return 2;
    w->since_sec = since_sec; w->since_usec = since_usec; w->sec = sec; w->usec = usec; w->handle = handle; w->peer = live_peer(w);
    if (w->peer) watch_count++;
  }
  uint64_t physical = 0;
  int pressure = -1;
  struct xsw_usage swap = {0};
  size_t size = sizeof(physical);
  sysctlbyname("hw.memsize", &physical, &size, NULL, 0);
  size = sizeof(pressure);
  sysctlbyname("kern.memorystatus_vm_pressure_level", &pressure, &size, NULL, 0);
  size = sizeof(swap);
  int swap_ok = sysctlbyname("vm.swapusage", &swap, &size, NULL, 0) == 0;
  printf("H %llu %d %lld\n", (unsigned long long)physical, pressure,
         swap_ok ? (long long)swap.xsu_used : -1LL);
  int capacity = proc_listpids(PROC_UID_ONLY, getuid(), NULL, 0) + 4096;
  if (capacity <= 4096) return 1;
  pid_t *pids = calloc(1, capacity);
  if (!pids) return 1;
  int bytes = proc_listpids(PROC_UID_ONLY, getuid(), pids, capacity);
  if (bytes <= 0 || bytes >= capacity) { free(pids); return 1; }
  int count = bytes / sizeof(pid_t);
  for (int i = 0; i < count; i++) {
    struct proc_bsdinfo info = {0};
    if (pids[i] <= 1 || proc_pidinfo(pids[i], PROC_PIDTBSDINFO, 0, &info,
                                    sizeof(info)) != sizeof(info)) continue;
    if (info.pbi_status == 5) continue; // SZOMB: no live memory or survivor.
    struct dotln_unique_info identity = {0};
    int identity_ok = proc_pidinfo(pids[i], 17, 0, &identity, sizeof(identity)) == sizeof(identity);
    struct rusage_info_v0 usage = {0};
    int ok = !light && proc_pid_rusage(pids[i], RUSAGE_INFO_V0,
                                     (rusage_info_t *)&usage) == 0;
    // Kernel process names have no whitespace; sanitize before a text record.
    for (size_t j = 0; j < sizeof(info.pbi_comm) && info.pbi_comm[j]; j++)
      if ((unsigned char)info.pbi_comm[j] <= 32) info.pbi_comm[j] = '_';
    info.pbi_comm[sizeof(info.pbi_comm) - 1] = '\0';
    printf("P %d %u %u %llu.%06llu %lld %lld %s %llu %llu", pids[i],
           info.pbi_ppid, info.pbi_pgid,
           (unsigned long long)info.pbi_start_tvsec,
           (unsigned long long)info.pbi_start_tvusec,
           ok ? (long long)usage.ri_phys_footprint : -1LL,
           ok ? (long long)usage.ri_resident_size : -1LL, info.pbi_comm,
           identity_ok ? (unsigned long long)identity.uniqueid : 0,
           identity_ok ? (unsigned long long)identity.parent_uniqueid : 0);
    int recent = 0;
    for (int k = 0; k < watch_count; k++)
      if (info.pbi_start_tvsec > watches[k].since_sec ||
          (info.pbi_start_tvsec == watches[k].since_sec && info.pbi_start_tvusec >= watches[k].since_usec)) recent = 1;
    if (recent) {
      int fdcount = 0;
      struct proc_fdinfo *fds = fds_for(pids[i], &fdcount);
      for (int j = 0; j < fdcount; j++) {
        if (fds[j].proc_fdtype != PROX_FDTYPE_SOCKET) continue;
        struct socket_fdinfo socket = {0};
        if (!unix_socket(pids[i], fds[j].proc_fd, &socket)) continue;
        for (int k = 0; k < watch_count; k++) {
          struct watch *w = &watches[k];
          if (socket.psi.soi_so == w->peer
              && socket.psi.soi_proto.pri_un.unsi_conn_so == w->handle
              && live_peer(w) == w->peer) printf(" %s", w->key);
        }
      }
      free(fds);
    }
    printf("\n");
  }
  free(pids);
  free(watches);
  return 0;
}
