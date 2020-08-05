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
        console.log('Session Name:',name);
        const currentSession = await Session.create({name});
        console.log('Continuing to addGame');
        return addGame(currentSession);
    });
}