const tesseract = require('./tesseractHelpers.js');
const { Session, Game } = require('../models');
const { performance } = require("perf_hooks"); // performance hooks
const gameConfig = require('../config/blackOps'); 


// text to match against for testing 
const array = ['[3arc]TJKeegan','[3arc]ABhura','[3arc]TEWells','PinkSine9','[3arc]JBojorquez','[3arc]AKrauss','[3arc]DAA Anthony','[3arc]GJNg','[3arc]MDonlon','[3arc]EFRich','Black Ops','Kills','Deaths','Ratio','Assists','Spetsnaz','2080 18 19 0.95 4','1900 18 17 1.06 2','1780 16 16 1.00 4','900 9 23 0.39 0','2200 22 7 3.14 0','1640 16 6 2.67 1','1420 13 12 1.08 2','1300 13 11 1.18 0','640 6 11 0.55 1','640 5 15 0.33 3'];
const nukeTown = ['[3arc]PTasker','PinkSine9','[3arc]AEady','[3arc]IJKowalski','[3arc]JMattis','[3arc]LAJohansen','[3arc]CCowell','[3arc]SNouriani','[3arc]SRoud','[3arc]PBabar','Black Ops','Kills','Deaths','Ratio','Assists','Spetsnaz','2570 23 17 1.35 5','2420 23 18 1.28 2','1900 17 19 0.89 4','1320 12 20 0.60 2','1960 19 12 1.58 1','1860 16 11 1.45 5','1440 12 10 1.20 4','1390 11 14 0.79 5','980 7 13 0.54 4','970 8 16 0.5 3']
const firingRange = [
'PinkSine9','2360 22 4 5.50 2',
'[3arc]ABhura', '1780 16 13 1.23 3',
'[3arc]Larry', '1780 17 13 1.31 1',
'[3arc]DVonderhaar', '1520 14 12 1.17 2',
'[3arc]BLMercado','900 6 10 0.60 5',
'[3arc]TJKeegan', '1720 16 15 1.07 2',
'[3arc]AKrauss', '1220 9 13 0.69 5',
'[3arc]TEWells','1180 11 14 0.79 1',
'[3arc]GJNg','940 7 15 0.47 3',
'[3arc]EFRich', '720 6 18 0.33 2'];

module.exports = async function(imageArray) {
    //timestamp, start of processing
    const t0 = performance.now();

    //Create a scheduler that contains one worker per image;
    const numberOfWorkers = imageArray.length;
    const scheduler = await tesseract.buildScheduler(numberOfWorkers); 
    
    //Add the data to be processed to all workers in the scheduler (1 image/job per worker);
    //TODO build a spinner so we know it's doin things, will require inquirer
    //TODO maybe a progress bar? for the whole operation, will require inquirer
    const results = await Promise.all(imageArray.map(({imagePath}) => (
        scheduler.addJob('recognize',imagePath)
    )));
    
    // wait for the scheduler to finish.
    await scheduler.terminate(); 
    
    //Extract the rendered text data from the results, we should now have text for each image processed per index.
    const textArray = results.map(result => {
       const { data: { text } } = result;
       return text;
    });

    //Creates timestamp, end of processing
    const t1 = performance.now();
    // Calculates start and end time stamp difference and displays it in Seconds.
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);
    
    console.log(textArray);

    const [ scorePercentage,itemsNotFound ] = tesseract.comparison(firingRange,textArray);

    console.log(`SCORE: ${scorePercentage}%`);
    if(itemsNotFound.length > 0) console.log(itemsNotFound);

    // merge text array and imageArray together.
    const players = textArray.map((results,index) => {

        // grab the team info that we carried into this function
        const team = imageArray[index].team;

        // sorts scores into an object listed from the stats
        const { scoreColumns } = gameConfig;

        results = results.split(' ').map(item => item.trim()).filter(item => item!=='');
        const rawScores = (results.slice(-scoreColumns.length)).join(' ')

        // gets raw scores from results
        const scores = rawScores.match(/\d+(\.\d+)?(?![\w\s]*(\]|\)))/g);
         
        stats = {}
        scores.forEach((score,index) => {
            columnName = scoreColumns[index]
            if (columnName !== ''){
                stats[columnName] = Number(score.trim());

                // remove the score from the result string so that we're only left with the gamertag
                scoreIndex = results.indexOf(score);
                results[scoreIndex] = undefined;
            }
        })

        // removes all undefined entries
        results.filter(item => item);

        // Find gamertag, first results minus the brackets (if any);
        const gamertag = results.shift().match(/\b[\w\s]+\b(?![\w\s]*(\]|\)))/)[0];

        return {
            team,
            gamertag,
            stats
        }
    });   

    Session.create({name:'test name'})
    .then(newSession => {
        const { _id, } = newSession
        
        return Promise.all([Game.create({sessionID:_id, scores:players}),newSession])
    })
    .then(([ newGame , newSession ]) => {
        const gameID = newGame._id;
        console.log('gameID',gameID);
        const { sessionPhrase } = newSession;
        newSession.games.push(gameID);
        return newSession.save()
    })
    .then(session => {
        const { sessionPhrase } = session;
        console.log('GAME SAVED, the unique session phrase is :', sessionPhrase);
    })  
}