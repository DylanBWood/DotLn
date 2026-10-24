"""Replay one paired repair control in an already isolated checkout.

Usage: python3 control-replay.py <isolated-checkout> <controls-json> <id> <logs-dir>
The executor alone prepares the copy. This never resets the working tree.
"""
import datetime,hashlib,json,subprocess,sys,time
from pathlib import Path
root=Path(sys.argv[1]).resolve(); manifest=Path(sys.argv[2]).resolve(); control_id=sys.argv[3]; logs=Path(sys.argv[4]).resolve()
row=next(r for r in json.loads(manifest.read_text())['results'] if r['id']==control_id)
assert root != Path.cwd().resolve(), 'controls require an isolated copy'
logs.mkdir(parents=True,exist_ok=True)
original={r['path']:(root/r['path']).read_bytes() for r in row['reversion']}
def run(args,label):
 start=time.monotonic(); file=logs/(control_id+'-'+label+'.log')
 with file.open('w') as out:
  p=subprocess.run(['node','scripts/harness.mjs','bounded','--',*args],cwd=root,stdout=out,stderr=subprocess.STDOUT)
 data=file.read_bytes(); text=data.decode(errors='replace')
 return {'exitCode':p.returncode,'seconds':round(time.monotonic()-start,3),'logSha256':hashlib.sha256(data).hexdigest(),'caseReports':[s for s in text.splitlines() if s.startswith(('✔','✖','ℹ tests','ℹ pass','ℹ fail'))], 'failureTail':text[-7000:] if p.returncode else ''}
build=any(r['path'].endswith('.ts') for r in row['reversion'])
result={'id':control_id,'startedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
try:
 result['positive']=run(row['command'],'positive')
 if result['positive']['exitCode'] != 0: raise RuntimeError('positive arm failed')
 for rev in row['reversion']:
  file=root/rev['path']
  if 'baseFile' in rev:
   content=subprocess.check_output(['git','show',rev['baseFile']],cwd=root)
  else:
   text=file.read_text(); assert text.count(rev['old'])==rev.get('count',1),rev['path']+' reversion needle changed'
   content=text.replace(rev['old'],rev['new']).encode()
  file.write_bytes(content)
 if build:
  result['negativeBuild']=run(['npm','run','build'],'negative-build')
  if result['negativeBuild']['exitCode'] != 0: raise RuntimeError('negative build failed; not behavioral evidence')
 result['negative']=run(row['command'],'negative')
 result['verdict']='demonstrated' if result['negative']['exitCode']==1 and result['negative']['caseReports'] else 'unproved'
finally:
 for name,data in original.items(): (root/name).write_bytes(data)
 if build: result['restoredBuild']=run(['npm','run','build'],'restored-build')
 result['finishedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
 (logs/(control_id+'.json')).write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps({key:result.get(key) for key in ['id','verdict','startedAt','finishedAt']}),flush=True)
 if result.get('verdict') != 'demonstrated': print(json.dumps(result,indent=2)[-10000:])
if result.get('verdict') != 'demonstrated': sys.exit(1)
