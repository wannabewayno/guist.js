const { Game, Session } = require('../models');
// const generateScores = require('../seed/scores.seed');

//? Not currentyl being used

// module.exports = {
//     createGame(req,res){
//         console.log('req.body:',req.body);
//         console.log('CREATE GAME CONTROLLER');
//         const { sessionID } = req.body;
//         console.log(sessionID);
//         const scores = generateScores(18)
//         console.log(scores);

//         Promise.all([
//             Game.create({sessionID, scores}),
//             Session.findById(sessionID)
//         ])
//         .then(([{ _id }, session]) => {
//             console.log('GameID',_id);
//             console.log('Current Session:',session);
//             session.games.push(_id);
//             return session.save()
//         })
//         .then(response => {
//             console.log('Success:',response);
//             res.json(response)
//         })
//         .catch(error => {
//             console.log('ERROR:',error);
//             res.status(422).json(error)
//         })
//     }
// }