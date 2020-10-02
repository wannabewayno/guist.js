const inquirer = require('inquirer');
const home = require('./home');
const addGame = inquirer.createPromptModule()
const { Game } = require('../../models');
const screenshot = require('../screenshot');
const chokidar = require('chokidar');
const path = require('path');
const processImage = require('../../lib/processImage');

module.exports = addGameFn = function(currentSession) {
    return addGame([
        {
            type:'confirm',
            message:`Session Phrase: ${currentSession.sessionPhrase} |  ADD GAME?`,
            name:'addGame',
        }
    ])
    .then(async ({addGame}) => {
        if (addGame){
            const watcher = chokidar.watch('raw',{
                persistent:true, // dunno
                awaitWriteFinish:true, // makes sure large files finish writing before caling
                ignored: /(^|[\/\\])\../,
                ignoreInitial:true //ignores initial add event
            });

            // resolves when files are added
            const addScreenShot = new Promise((resolve,reject) => {
                watcher.on('add', path => {
                    resolve(path);
                }) // path of newly added file
            })
           
            screenshot() // takes screenshot
            const imgPath = await addScreenShot.then(imgPath => imgPath);
            console.log('screenshot lives here:',imgPath);

            // process the image and get the player scores;
            const scores = await processImage(imgPath);
            console.log(scores);

            // create a new game with sessionID
            const sessionID = currentSession._id;
            const { _id } = await Game.create({scores,sessionID});

            // addGame to session
            await currentSession.games.push(_id);

            // save session
            await currentSession.save()
            
            // ask the user to add more games?
            return addGameFn(currentSession)
        } else {
            return home;
        }
    })
    .catch(error => console.log('chokidar error:',error))
}





// I also have an async/callback issue guys if any of you are free

// here's the code
//  watcher.on('add', path => callback) // triggers a callback when files are added 
//  screenshot() // trigger screenshot returns a promise

// When screenshot() is called, it triggers a set of hot keys that screenshots the game session,
// This is async as it calls upon an npm package to run a java file to the OS, returns a promise when is successfully sends the keys to the OS

// watcher listens for images being added to a directory and fires every-time a new one get's added.
// the issue is I want to check for watcher firing only after screenshot resolves, but watcher only takes a callback.. 