const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/reconciliation/master-input-counts.json', 'utf8'));
console.log(d);
