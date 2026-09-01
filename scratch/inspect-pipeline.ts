import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data/reconciliation/master-id-map.json', 'utf8'));
const types = new Set(data.map(x => x.entity_type));
console.log(types);
