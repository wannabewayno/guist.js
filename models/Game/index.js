const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const scoreSubDoc = require('./score.subdoc');

// Schema
// ==============================================================================

const gameSchema = new Schema({

    sessionID: { type: mongoose.Schema.Types.ObjectId, ref:'Session' }, // Belongs to a session
    scores:[ scoreSubDoc ] // scores from the game

},{
    timestamps:true
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;