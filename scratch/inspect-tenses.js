const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/extracted/chapters/chapter-01.json'));
console.log((d.tenses || []).length);
