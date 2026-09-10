"""Apply the frozen v2.1 PASS set plus v2.2 staged corrections to the derived dataset only."""
import copy, json, os, sys, tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent.parent.parent
HR=ROOT/'enrichment/high-risk'
sys.path[:0]=[str(ROOT),str(HR)]
from scripts.high_risk_helpers import load_baseline_dataset, validate_master_dataset_schema, compute_file_sha256
from scripts.make_correction_queue_v2_2 import find_entity

def atomic(path,payload):
    fd,tmp=tempfile.mkstemp(dir=path.parent,prefix='.tmp_')
    with os.fdopen(fd,'w',encoding='utf-8') as f: json.dump(payload,f,ensure_ascii=False,indent=2)
    os.replace(tmp,path)

def main():
    summary=json.load(open(HR/'reports/FULL_QUEUE_VALIDATION_SUMMARY.json'))
    correction=json.load(open(HR/'reports/corrections-v2.2/CORRECTION_QUEUE_VALIDATION_SUMMARY.json'))
    if summary['pass_count']!=723 or correction['ready_for_policy_review'] is not True: raise ValueError('Validation gates are not complete')
    data,h=load_baseline_dataset(); staged=copy.deepcopy(data); applied=[]
    for bid,result in summary['results'].items():
      if result['status']!='PASS': continue
      p=HR/'validated'/f'{bid}_VALIDATED.json'
      v=json.load(open(p))
      for patch in v['patches']:
        e=find_entity(staged,v['collection'],patch['entity_key'])
        if e[v['field']] not in (None,'',[],{}): raise ValueError(f'stale v2.1 precondition {bid} {patch["entity_key"]}')
        e[v['field']]=patch['value']; applied.append(bid)
    manifest=json.load(open(HR/'batches/corrections-v2.2/CORRECTION_MANIFEST.json'))
    for bid,entry in manifest['batches'].items():
      r=json.load(open(HR/'responses/corrections-v2.2'/f'{bid}_RESPONSE.json'))
      for patch in r['proposals']:
        e=find_entity(staged,entry['collection'],patch['entity_key']); e[entry['field']]=patch['value']
      applied.append(bid)
    errors=validate_master_dataset_schema(staged)
    if errors: raise ValueError(errors[:5])
    output=ROOT/'enrichment/HIGH_RISK_DATA_ENRICHED.json'; atomic(output,staged)
    audit={'applied_at':datetime.now(timezone.utc).isoformat(),'baseline_hash':h,'v2_1_pass_batches':723,'v2_2_batches':25,'reviewers':{'linguistic':'Sukhjot','compliance':'Sukh'},'ai_fallback':'AI_GENERATED_UNVERIFIED','output_hash':compute_file_sha256(output)}
    atomic(HR/'audits/COMBINED_V2_2_APPLY_AUDIT.json',audit)
    print(json.dumps(audit,ensure_ascii=False))
if __name__=='__main__': main()
