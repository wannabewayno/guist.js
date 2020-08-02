const tesseract = require('./lib/tesseractHelpers.js');
const { Session, Game } = require('./models');

module.exports = async function(imageArray) {

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

    //Creates timestamp, end of computation
    t1 = performance.now();
    // Calculates start and end time stamp difference and displays it in Seconds.
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);
    
    console.log(textArray);

    const [ scorePercentage,itemsNotFound ] = tesseract.comparison(nukeTown,textArray);

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
        console.log('Scores:', scores);
         
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