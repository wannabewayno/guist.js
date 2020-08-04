// const ks = require('node-key-sender');


// // try to open task manager
// ks.sendCombination(['control','shift','escape'])
const { Image } = require('image-js');
const cropToScoreboard = require('./lib/cropToScoreboard');


Image.load('./raw/liveTest2.png')
.then(image => {
    const images = cropToScoreboard(image);
})