import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data/extracted/backmatter/glossary-en-fr.json', 'utf8'));
console.log(data[0]);
