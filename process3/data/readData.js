const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname,'thresholdAndTopHat.json')));

const perfectMatches = data.data.filter(([score,,]) => score === 100 ).map(score => `${score}\n`);

fs.writeFileSync(path.join(__dirname,'perfectMatches.txt'),perfectMatches);