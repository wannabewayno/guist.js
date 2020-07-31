const fs = require('fs');

//  define our db object
const db = {}

// get's all models that's not our index.js file
// we will assume this file only contains .js extension
const schemas = fs.readdirSync(__dirname).filter(schema => schema !== 'index.js')

// loads the empty db object with all our models
schemas.forEach(schema => {
    const SchemaName = schema.replace('.js','');
    db[SchemaName] = require(`./${schema}`)
});

// Exports our database for use within the app
console.log(db);
module.exports = db;