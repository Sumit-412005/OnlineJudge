const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    const url = process.env.MONGODB_URL;

    // Fail fast with a clear message if the connection string is missing or
    // still the placeholder from .env.example.
    if (!url || url.includes("<user>") || url.includes("<password>")) {
        console.error("\n[config] MONGODB_URL is not set correctly.");
        console.error("[config] Copy .env.example to .env and paste your MongoDB Atlas connection string into MONGODB_URL.\n");
        process.exit(1);
    }

    mongoose.connect(url, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.log(error);
        process.exit(1);
    })

};
