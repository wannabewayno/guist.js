const wordlist = require('./wordlist.en');
const randomNumber = require('../../../lib/randomNumber');

module.exports = phraseLength => {
    // generate three randomNumbers from 0 to wordlist.length
    const randomIndexes = [];
    const length = wordlist.length
    for (let iterator = 0; iterator < phraseLength; iterator++) {
        randomIndexes.push(
            randomNumber([0,length])
        )
    }
    // map randomIndexes to words, join them with '-' and return it
    return randomIndexes.map(randomIndex => wordlist[randomIndex]).join(' ');
}
