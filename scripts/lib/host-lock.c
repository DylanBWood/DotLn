#define _GNU_SOURCE
// Kernel releases this advisory lock when the owner pipe closes or we die.
// Never unlink the lock inode: waiters must rendezvous on that same inode.
#include <sys/file.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <signal.h>
#include <sys/wait.h>

int main(int argc, char **argv) {
  if (argc > 2 && strcmp(argv[1], "--supervise") == 0) {
    // Remain the source writer's group leader after its host dies. The actual
    // writer never inherits the release/result channel and starts only on go.
    signal(SIGINT, SIG_IGN); signal(SIGTERM, SIG_IGN); signal(SIGHUP, SIG_IGN);
    signal(SIGPIPE, SIG_IGN);
    char go;
    if (read(3, &go, 1) != 1) return 5;
    pid_t writer = fork();
    if (writer < 0) return 5;
    if (writer == 0) {
      close(3);
      signal(SIGINT, SIG_DFL); signal(SIGTERM, SIG_DFL); signal(SIGHUP, SIG_DFL);
      signal(SIGPIPE, SIG_DFL);
      execvp(argv[2], argv + 2);
      perror("DotLn writer launch"); _exit(127);
    }
    // Only the writer holds its input; the supervisor owns no output beyond
    // its private result channel. A vanished host cannot make SIGPIPE kill it.
    close(STDIN_FILENO); close(STDOUT_FILENO); close(STDERR_FILENO);
    int result;
    while (waitpid(writer, &result, 0) < 0) if (errno != EINTR) return 5;
    char response[64];
    int length = WIFEXITED(result)
      ? snprintf(response, sizeof(response), "worker-exit %d\n", WEXITSTATUS(result))
      : snprintf(response, sizeof(response), "worker-signal %d\n", WTERMSIG(result));
    if (length > 0) write(3, response, length);
    // Stop every remaining group member even without the original host. The
    // authenticated channel preserves the writer's exit result for that host.
    kill(-getpid(), SIGKILL);
    return 5;
  }
  if (argc > 2 && strcmp(argv[1], "--launch") == 0) {
    char go;
    if (read(3, &go, 1) != 1) return 5;
    // Exec closes the control descriptor; a failed exec reports through it.
    // The runner must distinguish launch errors from a program's exit code.
    if (fcntl(3, F_SETFD, FD_CLOEXEC) < 0) return 5;
    execvp(argv[2], argv + 2);
    int launch_errno = errno;
    char response[64];
    int length = snprintf(response, sizeof(response), "exec-error %d\n", launch_errno);
    if (length > 0) write(3, response, length);
    errno = launch_errno;
    perror("DotLn launch"); return 127;
  }
  if (argc != 2) return 2;
  int fd = open(argv[1], O_CREAT | O_RDWR | O_NOFOLLOW, 0600);
  if (fd < 0) return 3;
  while (flock(fd, LOCK_EX) < 0) if (errno != EINTR) return 4;
  puts("LOCKED"); fflush(stdout);
  char byte;
  while (read(STDIN_FILENO, &byte, 1) > 0) {}
  close(fd);
  return 0;
}
