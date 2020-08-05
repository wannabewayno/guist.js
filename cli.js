console.log(require('./cli/asciiBanner'));

// Dependencies
// ==============================================================================
const rxjs = require('rxjs');
const inquirer = require('inquirer');
const exchange = require('./cli/dispatch');
// const clearScreen = require('./cli/clearScreen'); takes a few seconds...

// creates our promptQueue Subject to push prompts into at anytime
// ===============================================================
const promptQueue = new rxjs.Subject();

// load the promptQueue into an inquirer prompt module
inquirer.prompt(promptQueue).ui.process.subscribe(async response => {
    
        const { answer } = response;
        const exchangeResponse = await exchange[answer.getAction()](answer.getAnswer());

        switch(exchangeResponse){
            case 'exit': promptQueue.complete() // end the cli
                break;
            default: // calls the next prompt in the promptQueue
                promptQueue.next(exchange.next());
        }
 
    },
    error => {throw new Error(error)},
    complete => console.log("exiting...")
)

// kicks off the prompts by calling the first prompt
promptQueue.next(exchange.next());
