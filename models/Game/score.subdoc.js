const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    gamertag: String,
    team: String,
    stats:{
        kills: Number,
        deaths: Number,
        score: Number,
        assists: Number,
    }
})

scoreSchema.virtual('KDRatio').get(function(){
    const { stats:{ kills, deaths } } = this
    return kills/deaths;
})


