const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/extracted/chapters/chapter-01.json'));
console.log(data.vocabulary.length);
