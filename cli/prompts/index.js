const fs = require('fs');

//  define our controller object
const prompts = {}

// get's all prompts that's not in our index.js file
// we will assume this file only contains .js extensions

const promptFiles = fs.readdirSync(__dirname).filter(fileName => fileName !== 'index.js' )

// loads the empty prompt object with all our models
promptFiles.forEach(prompt => {
    const promptName = prompt.replace('.js','');
    prompts[promptName] = require(`./${prompt}`);
});

// Exports all prompts
module.exports = prompts;