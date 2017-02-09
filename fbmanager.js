const config = require("./config.json");

const firebase = require("firebase").initializeApp(config);

module.exports = firebase;
