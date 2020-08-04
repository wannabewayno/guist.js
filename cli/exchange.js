const inquirer = require('inquirer');
const prompts = require('./prompts');
const Queue = require('./Queue');
const screenshot = require('./screenshot');

const newPromptModule = inquirer.createPromptModule();

const queue = new Queue(prompts.home);

module.exports = {
    next() {
        return queue.next()
    },
    newSession(){
        queue.add(prompts.home);
        console.log('creating new session!');
    },
    continueSession(){
        return 'exit';
    },
    newPrompt() {
        return newPromptModule([{
            name:'question1',
            message:'hello world',
            type:'confirm'
        }])
        .then(()=>console.log('finished'))
    },
    async addGame(answer){
        if(!answer) { // if NO
            queue.add(prompts.home) // queue up the home menu
            return                  // return from the function
        };
        // take a screenshot
        await screenshot()

        // this will trigger a change in node fs, we need to read this file....

    },
}

