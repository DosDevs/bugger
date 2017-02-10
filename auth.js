const prompt = require("prompt");
const firebase = require("./fbmanager");
const auth = firebase.auth();
var session = {};

prompt.message = "";

function askForCredentials (callback) {
  prompt.start();
  prompt.get([{
    name: "email",
    required: true
  }, {
    name: "password",
    hidden: true,
    required: true
  }], (err, res) => {
    callback(err, res);
  });
}

function login (callback) {
  var usr = auth.currentUser;
  if (usr) {
    session.user = usr;
    callback();
  } else {
    askForCredentials((err, info) => { 
      firebase.auth().signInWithEmailAndPassword(info.email, info.password).then((usr) => {
        session.user = usr;
        callback();
      })
      .catch(err => {
          console.log("Try again!");
          askForCredentials(callback);
      });

    });
  }
}

module.exports = {
  login: login,
  session: session
}
