import json

with open('/Users/sukhjot/codes/book/data/final/french_grammar.json', 'r') as f:
    data = json.load(f)

print("Keys in dataset:", list(data.keys()))

for k in data.keys():
    if isinstance(data[k], list):
        print(f"{k}: {len(data[k])}")
    elif isinstance(data[k], dict):
        print(f"{k}: {len(data[k].keys())}")
    else:
        print(f"{k}: {type(data[k])}")

expr_chapter_14 = [e for e in data.get('expressions', []) if '14' in str(e.get('attestations', []))]
print(f"\nExpressions in Chapter 14: {len(expr_chapter_14)}")
for e in expr_chapter_14[:10]:
    print("  -", e.get('french'), "->", e.get('english'))

examples = data.get('examples', [])
print(f"\nTotal examples: {len(examples)}")

verb_a = [e.get('french') for e in data.get('expressions', []) if ' à' in e.get('french', '')]
print(f"Expressions with 'à': {len(verb_a)}")
print("Sample:", verb_a[:10])

verb_de = [e.get('french') for e in data.get('expressions', []) if ' de' in e.get('french', '') or " d'" in e.get('french', '')]
print(f"Expressions with 'de': {len(verb_de)}")
print("Sample:", verb_de[:10])

conjugations = data.get('conjugations', [])
print(f"\nTotal conjugations: {len(conjugations)}")

exercises = data.get('exercises', [])
print(f"Total exercises: {len(exercises)}")
