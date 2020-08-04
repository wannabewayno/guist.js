const { Session } = require('../models');

module.exports = {
    getSessionByPhrase(req,res) {
        console.log('Should be Phrase:', req.params);
        Session.find(req.params)
        .then(response => {
            console.log(response);
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(422).json(error);
        })
    },
    getSessionById(req,res) {
        console.log('Should be ID:', req.params);
        Session.find(req.params)
        .then(response => {
            console.log(response);
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(422).json(error);
        })
    },
    getAllSessions(req,res){

    },
    createSession(req,res){
        console.log('this is being hit');
        console.log(req.body);
        Session.create(req.body)
        .then(response => res.json(response))
        .catch(error => res.status(422).json(error.response))
    }
}