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
var current_project = null;

vorpal
  .command("list", "Lists available projects")
  .alias("ls")
  .action((args, callback) => {
    db.ref("projects").once("value", snp => {
      var projs = snp.val();
      if (!projs) {
        console.log("There are no projects available!");
      } else {
        for (var key in projs) {
          console.log(key);
        }
      }
      callback();
    });
  });

vorpal
  .command("add <name>", "Create a new project")
  .action((args, callback) => {
    var ref = db.ref("projects");
    ref.child(args.name).once("value", snp => {
      if (snp.val()) {
        console.log("Project already exists!");
        callback();
      } else {
        ref.child(args.name).set({ description: args.name }, () => {
          console.log("Project created!");
          callback();
        });
      }
    });
  });

vorpal
  .command("open <project>", "Open the specified project")
  .action((args, callback) => {
    db.ref("projects").child(args.project).once("value", snp => {
      if (snp.val()) {
        vorpal.delimiter(`${args.project}>`);
        current_project = args.project;
      } else {
        console.log(`Project ${args.project} not found!`);
      }
      callback();
    });
  });

vorpal
  .command("bugs", "List open bugs for current project")
  .action((args, callback) => {
    if (!current_project) {
      console.log("Current project not selected");
      callback();
    } else {
      db
        .ref("projects")
        .child(current_project)
        .child("bugs/open")
        .once("value", snp => {
          var bugs = snp.val();
          if (!bugs) {
            console.log("No bugs registered!");
            callback();
          } else {
            bugs.forEach(bg => {
              console.log(bg.description);
            });
            callback();
          }
        });
    }
  });

vorpal
  .command("report [description...]", "Report a new bug")
  .action((args, callback) => {
    if(!current_project) {
      console.log("Current project not selected!");
      callback();
    } else {
      var ref = db.ref("projects").child(current_project).child("bugs/open");
      ref.once("value", snp => {
        var list = snp.val() || [];
        list.push({description:args.description.join(" ")});
        ref.set(list, () => {
          callback();
        });
      });
    }
  });

vorpal.delimiter("bugger$").show();

