const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname,'data.json')));

const perfectMatches = data.data.filter(([score,,]) => score >= 90).map(score => `${score}\n`);

fs.writeFileSync(path.join(__dirname,'ninties.txt'),perfectMatches);