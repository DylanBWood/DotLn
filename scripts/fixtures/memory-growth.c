// Self-limited live fixture; never requests more than 1/8 of physical memory.
#include <libproc.h>
#include <sys/resource.h>
#include <sys/sysctl.h>
#include <sys/mman.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <CoreFoundation/CoreFoundation.h>
#include <IOSurface/IOSurfaceRef.h>
#include <mach/mach.h>
#include <mach/mach_vm.h>

int main(int argc, char **argv) {
  uint64_t physical = 0;
  size_t length = sizeof(physical);
  if (sysctlbyname("hw.memsize", &physical, &length, NULL, 0) != 0) return 2;
  const size_t fixture_max = 240 * 1024 * 1024;
  const size_t ceiling = physical / 8 < fixture_max ? physical / 8 : fixture_max;
  const size_t chunk = 8 * 1024 * 1024;
  int nonresident = argc > 1 && strcmp(argv[1], "nonresident") == 0;
  size_t allocated = 0;
  IOSurfaceRef surfaces[30] = {0};
  printf("fixture pid=%d ceiling=%zu mode=%s\n", getpid(), ceiling, nonresident ? "nonresident" : "zero");
  fflush(stdout);
  // An independent 5-second deadline keeps a broken monitor's test harmless.
  for (int step = 0; step < 30 && allocated + chunk <= ceiling; step++) {
    if (nonresident) {
      int64_t dimensions[] = {1024, 2048, 4, 4096, chunk};
      const void *keys[] = {kIOSurfaceWidth, kIOSurfaceHeight, kIOSurfaceBytesPerElement,
                           kIOSurfaceBytesPerRow, kIOSurfaceAllocSize};
      CFNumberRef values[5];
      for (int i = 0; i < 5; i++) values[i] = CFNumberCreate(NULL, kCFNumberSInt64Type, &dimensions[i]);
      CFDictionaryRef properties = CFDictionaryCreate(NULL, keys, (const void **)values, 5,
                                  &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
      surfaces[step] = IOSurfaceCreate(properties);
      CFRelease(properties);
      for (int i = 0; i < 5; i++) CFRelease(values[i]);
      if (!surfaces[step]) return 4;
      task_id_token_t identity = MACH_PORT_NULL;
      if (task_create_identity_token(mach_task_self(), &identity) != KERN_SUCCESS) return 7;
      kern_return_t assigned = IOSurfaceSetOwnershipIdentity(surfaces[step], identity, kIOSurfaceMemoryLedgerTagDefault, 0);
      mach_port_deallocate(mach_task_self(), identity);
      if (assigned != KERN_SUCCESS) { fprintf(stderr, "surface ledger unavailable=%d\n", assigned); return 8; }
      volatile unsigned char *base = IOSurfaceGetBaseAddress(surfaces[step]);
      for (size_t index = 0; index < chunk; index += getpagesize()) base[index] = 0;
      if (mach_vm_deallocate(mach_task_self(), (mach_vm_address_t)base, chunk) != KERN_SUCCESS) return 9;
    } else {
      volatile unsigned char *block = mmap(NULL, chunk, PROT_READ | PROT_WRITE,
                                        MAP_PRIVATE | MAP_ANON, -1, 0);
      if (block == MAP_FAILED) return 3;
      for (size_t index = 0; index < chunk; index += getpagesize()) block[index] = 0;
    }
    allocated += chunk;
    struct rusage_info_v0 usage = {0};
    if (proc_pid_rusage(getpid(), RUSAGE_INFO_V0, (rusage_info_t *)&usage) != 0) return 5;
    printf("allocation bytes=%zu footprint=%llu rss=%llu\n", allocated,
           (unsigned long long)usage.ri_phys_footprint, (unsigned long long)usage.ri_resident_size);
    fflush(stdout);
    usleep(150000);
  }
  fprintf(stderr, "fixture self-ceiling/deadline reached\n");
  return 6;
}
