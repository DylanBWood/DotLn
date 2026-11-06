import subprocess,json,re
from pathlib import Path
root=Path.cwd()
base=subprocess.check_output(['git','merge-base','main','HEAD'],text=True).strip()
paths=['package.json']+subprocess.check_output(['git','ls-files','packages/*/package.json'],text=True).splitlines()
fields=['dependencies','devDependencies','peerDependencies','optionalDependencies']
for p in paths:
 before=json.loads(subprocess.check_output(['git','show',f'{base}:{p}'],text=True)); after=json.loads(Path(p).read_text())
 for k in fields: assert set(before.get(k,{}))==set(after.get(k,{})),(p,k)
before=json.loads(subprocess.check_output(['git','show',f'{base}:package-lock.json'],text=True)); after=json.loads(Path('package-lock.json').read_text())
assert set(before['packages'])==set(after['packages'])
diff=subprocess.check_output(['git','diff','--unified=0','--','scripts','packages'],text=True)
added=[x for x in diff.splitlines() if x.startswith('+') and not x.startswith('+++')]
patterns=r'(?://|/\*|#).*?(?:@ts-ignore|@ts-nocheck|eslint-disable|prettier-ignore|type:\s*ignore)'
suppressions=[x for x in added if re.search(patterns,x)]
assert not suppressions,suppressions
subprocess.run(['git','diff','--check'],check=True)
print(json.dumps({'base':base,'manifests':len(paths),'dependencyNamesUnchanged':True,'lockEntriesUnchanged':True,'newSuppressionDirectives':suppressions,'diffCheck':'pass'},indent=2))
