const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
// ==============================================================================

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email:{ type: String, unique: true},
    gamerTag:{ type: String, unique: true, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;