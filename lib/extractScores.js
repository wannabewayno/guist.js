const gameConfig = require('../config/blackOps');


module.exports = function({textArray, imageArray}) {
    // merge text array and imageArray together.
    const players = textArray.map((results,index) => {

        // grab the team info that we carried into this function
        const team = imageArray[index].team;

        // sorts scores into an object listed from the stats
        const { scoreColumns } = gameConfig;
        const numberOfScores = scoreColumns.length

        results = results.split(' ').map(item => item.trim()).filter(item => item!=='');
        const rawScores = (results.slice(- numberOfScores)).join(' ')
        
        // gets raw scores from results
        const scores = rawScores.match(/\d+(\.\d+)?(?![\w\s]*(\]|\)))/g);
            
        stats = {}
        if(scores){ // if this part of the image has scores
            scores.forEach((score,index) => {
                columnName = scoreColumns[index]
                if (columnName !== ''){
                    stats[columnName] = Number(score.trim());
                }
            })
        }

       
        const sliceLength = results.length - numberOfScores; 
        if(process.env.NODE_ENV==='development') console.log('BEFORE GAMERTAG:',results);

        if(results.length > 0 && sliceLength > 0){
             // gamertag is the inverse of scores;
            results = results.slice(0,sliceLength);

            const gamertag = results.join(' ').match(/\b[\w\s]+\b(?![\w\s]*(\]|\)))/)[0];

            return {
                team,
                gamertag,
                stats
            }
        }
    })
    .filter(player => player);

    return players;
}