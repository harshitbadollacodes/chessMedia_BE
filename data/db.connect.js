const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function initializeDbConnection() {

    const dbURI = process.env.DB_URI;

    try {
        const mongooseConnection = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        if (mongooseConnection) {
            console.log('mongoose connected');
        }

    } catch (err) {
        console.log("mongoose connection failed", err);
    }
}

module.exports = { initializeDbConnection };