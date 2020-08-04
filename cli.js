console.log(require('./lib/asciiBanner'));

//Dependencies
const rxjs = require('rxjs');
const inquirer = require('inquirer');
const exchange = require('./lib/prompts/exchange');

//creates our promptQueue Subject to push prompts into at anytime
const promptQueue = new rxjs.Subject();

console.log('First Question:',exchange.next());

//Inquirer prompt module loading in the promptQueue
inquirer.prompt(promptQueue).ui.process.subscribe(async response => {

        console.log('response:', response);
        const { answer } = response;
        await exchange[answer.function](answer.variable);

        //calls the next prompt in the promptQueue
        promptQueue.next(exchange.next());
    },
    error => {throw new Error(error)},
    complete => console.log("all done")
)

// kicks off the prompts by calling the first prompt
promptQueue.next(exchange.next());
