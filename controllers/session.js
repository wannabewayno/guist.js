const { Session } = require('../models');
const { throwError } = require('rxjs');

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
    createSession(name){
        return Session.create(name)
    }
}