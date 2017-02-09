const config = {
  apiKey: "AIzaSyBOO1qUgdm3tw95MIreR8_ZHayBa8Jx0LA",
  authDomain: "bugger-e6218.firebaseapp.com",
  databaseURL: "https://bugger-e6218.firebaseio.com",
  storageBucket: "bugger-e6218.appspot.com",
  messagingSenderId: "899597250589"
};
const firebase = require("firebase").initializeApp(config);
const vorpal = require("vorpal")();
var db = firebase.database();

vorpal.command("list", "Lists available projects").action((args, callback) => {
  console.log("Getting projects list");
  db.ref("projects").once("value", snp => {
    var projs = snp.val();
    if (!projs) {
      console.log("There are no projects available!");
    } else {
      for (var key in projs) {
        var p = projs[key];
        console.log(p.name);
      }
    }
    callback();
  });
});

vorpal
  .command("add <name>", "Create a new project")
  .action((args, callback) => {
    db.ref("projects").push({name:args.name}, () => {
      console.log("Project created!");
      callback();
    });
  });

vorpal.delimiter("bugger~$").show();

