const mongoose = require('mongoose');

const connection = mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost/guist",
        { 
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        }
    );

module.exports = connection;