const inquirer = require('inquirer');
const prompts = require('./prompts');
const Queue = require('./Queue');
const Cache = require('./Cache');
const screenshot = require('./screenshot');
const guistLogo = require('./asciiBanner');
const { Session, Game } = require('../models');

const queue = new Queue(prompts.home); // create our prompt queue.
const cache = new Cache(); // create a new cache to store information.

module.exports = {
    queue,
    dispatch({ menu }) { return prompts[menu](cache) }
}


