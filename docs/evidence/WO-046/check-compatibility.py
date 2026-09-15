from pathlib import Path
import json, subprocess, re, sys

def git(*args):return subprocess.check_output(['git',*args])
def prior(path):return git('show','v0.20.0:'+path)
unchanged=[]
for old,new,names in [
 ('docs/evidence/WO-045/artifact-identity/001','docs/evidence/WO-046/artifact-identity',['audit.json','negative-transcripts.json','scenario.jsonl','semantic-hash-inventory.json']),
 ('docs/evidence/WO-045/verification/001','docs/evidence/WO-046/verification',['events.jsonl','matrix.json','stale-status.json','stale-status.txt'])]:
 for name in names:
  path=f'{new}/{name}'
  assert Path(path).read_bytes()==Path(f'{old}/{name}').read_bytes(),path
  unchanged.append(path)
fixtures=git('ls-files','packages/skeleton/fixtures','corpus/fixtures','corpus/manifest.json').decode().splitlines()
for path in fixtures:assert Path(path).read_bytes()==prior(path),path
paths=git('diff','--name-only','v0.20.0','--','.claude','.agents','.codex','CLAUDE.md').decode().splitlines()
hooks=[p for p in paths if p.startswith('.claude/hooks/')]
def normalize(s):
 s=re.sub(r'fnv1a64:[0-9a-f]{16}','fnv1a64:<pin>',s)
 return re.sub(r'\.runtime/harness/[0-9a-f]{16}','.runtime/harness/<snapshot>',s)
for path in hooks:assert normalize(Path(path).read_text())==normalize(prior(path).decode()),path
changes=[]
def compare(a,b,path='$'):
 if a==b:return
 if isinstance(a,dict) and isinstance(b,dict):
  assert a.keys()==b.keys(),path
  for key in a:compare(a[key],b[key],path+'.'+key)
 elif isinstance(a,list) and isinstance(b,list):
  assert len(a)==len(b),path
  for i,(x,y) in enumerate(zip(a,b)):compare(x,y,path+'.'+str(i))
 else:
  assert path.endswith(('.hash','.snapshot')),path
  changes.append(path)
compare(json.loads(prior('.claude/harness-manifest.json')),json.loads(Path('.claude/harness-manifest.json').read_text()))
assert sorted(paths)==sorted(['.claude/harness-manifest.json',*hooks])
result={'baseline':'v0.20.0','fixtureFilesByteIdentical':len(fixtures),'evidenceFilesByteIdentical':unchanged,'bundleChangedFiles':paths,'bundleManifestChangedFields':changes,'bundleChanges':'runtime snapshots and content pins only','semanticHashes':'unchanged','artifactIdentities':'unchanged','frozenOracle':'unchanged'}
if sys.argv[1:] == ['--write']:
 Path('docs/evidence/WO-046/compatibility.json').write_text(json.dumps(result,indent=2)+'\n')
else:
 assert not sys.argv[1:]
 assert json.loads(Path('docs/evidence/WO-046/compatibility.json').read_text()) == result
print(f'PASS: {len(fixtures)} unchanged fixtures, {len(unchanged)} byte-identical evidence files, {len(hooks)} hooks with runtime pin changes only')
