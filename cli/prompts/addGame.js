const inquirer = require('inquirer');
const home = require('./home');
const addGame = inquirer.createPromptModule()
const { Game } = require('../../models');
const screenshot = require('../screenshot');

module.exports = addGameFn = function(currentSession) {
    return addGame([
        {
            type:'confirm',
            message:`Session Phrase:${currentSession.sessionPhrase} |  ADD GAME?`,
            name:'addGame',
        }
    ])
    .then(async ({addGame}) => {
        if (addGame){
            // trigger screenshot
            await screenshot()
            .then(()=>console.log('finished screenShot'))
            // promise.all for file change and screenshot
            // when both come back as true

            // process the image

            // create a new game
            // const sessionID = currentSession._id;
            // const { _id } = await Game.create({scores,sessionID});
            // addGame to session
            // const await currentSession.games.push(_id);
            // save session
            // await currentSession.save()
            // ask the user to add more games?
            return addGameFn(currentSession)
        } else {
            return home;
        }
    })
}