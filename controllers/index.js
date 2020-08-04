const fs = require('fs');

//  define our controller object
const controllers = {}

// get's all controllers that's not in our index.js file
// we will assume this file only contains .js extensions

const controllerFiles = fs.readdirSync(__dirname).filter(fileName => fileName !== 'index.js' )

// loads the empty controller object with all our models
controllerFiles.forEach(controller => {
    const ControllerName = controller.replace('.js','');
    controllers[ControllerName] = require(`./${controller}`)
});

// Exports our controllers for use within the app
console.log(controllers);
module.exports = controllers;