const { Game, Session } = require('../models');

module.exports = {
    createGame(sessionID){
        console.log(sessionID);

        Game.create({sessionID, scores}),
        
        Session.findById(sessionID)
        console.log('GameID',_id);
        console.log('Current Session:',session);
        session.games.push(_id);
        return session.save()
        .then(response => {
            console.log('Success:',response);
            res.json(response)
        })
        .catch(error => {
            console.log('ERROR:',error);
            res.status(422).json(error)
        })
    }
}