require('dotenv').config(); // load env variables
process.env.NODE_ENV = 'production';

// load the logo whilst everything else initializes
const guistLogo = require('./cli/asciiBanner')
console.log(guistLogo);

// Dependencies
// ==============================================================================
const inquirer = require('inquirer');
const { queue:{ queue }, dispatch } = require('./cli/dispatch'); // grab our queue and cache from dispatch to initialise the prompt queue

// need a function that kicks off a prompt module... 
async function main(queue) {
   const answers = await inquirer.prompt(queue);

   const newQueue = await dispatch(answers);
  
   // if newQueue exists, run main again
   if(newQueue) {
      console.log(guistLogo);
      main(newQueue);
   }
} 

require('./config/mongoConnect')
.then(() => main(queue)) // connected, fire up the CLI
.catch(error => console.log('ERROR: unable to connect to Mongo Atlas',error)); // Error, tell the user
