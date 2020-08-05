const inquirer = require('inquirer');
const home = require('./home');
const addGame = require('./addGame')
const newSession = inquirer.createPromptModule();
const { Session } = require('../../models');

module.exports = function(){
    return newSession([
        {
            type:'input',
            askAnswered:true,
            name:'name',
            message:'Enter a session name:',
        }
    ])
    .then(async ({ name })=> {
        // create a new Session
        const currentSession = await Session.create({name});
        
        // send the user to add games
        return addGame(currentSession);
    });
}