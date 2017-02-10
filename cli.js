const vorpal = require("vorpal")();
const prompt = require("prompt");
const db = require("./database");
var current_project = null;

function init() {
  vorpal
    .command("list projects", "Lists available projects")
    .alias("ls")
    .action((args, callback) => {
      db.getAllProjects((err, prjs) => {
        if (!prjs) {
          console.log("There are no projects available!");
        } else {
          var id = 0;
          for (var key in prjs) {
            var p = prjs[key];
            id++;
            console.log(`${p.shortname} - ${p.name}`);
          }
        }
        callback();
      });
    });

  vorpal.command("add project <shortname>", "Create a new project").action((
    args,
    callback
  ) => {
    prompt.start();
    prompt.get(
      [
        {
          name: "name",
          required: true
        },
        {
          name: "description",
          required: false
        }
      ],
      (err, res) => {
        res.shortname = args.shortname;
        db.addProject(res, () => {
          console.log("Project created!");
          callback();
        });
      }
    );
  });

  vorpal
    .command("open project <shortname>", "Open the specified project")
    .action((args, callback) => {
      db.getProjectByShortName(args.shortname, (err, prj) => {
        if (prj) {
          vorpal.delimiter(`${prj.shortname}>`);
          current_project = prj;
        } else {
          console.log(`Project ${args.shortname} not found!`);
        }
        callback();
      });
    });

  vorpal.command("list bugs", "List open bugs for current project").action((
    args,
    callback
  ) => {
    if (!current_project) {
      console.log("Current project not selected");
      callback();
    } else {
      db.getAllBugsForProject(current_project.id, (err, bugs) => {
        if (!bugs || bugs.length == 0) {
          console.log("No bugs registered!");
          callback();
        } else {
          bugs.forEach((bg,idx) => {
            console.log(`${idx} - ${bg.description}`);
          });
          callback();
        }
      });
    }
  });

  vorpal.command("add bug", "Report a new bug").action((args, callback) => {
    if (!current_project) {
      console.log("Current project not selected!");
      callback();
    } else {
      prompt.start();
      prompt.get(
        [
          {
            name: "description",
            required: true
          }
        ],
        (err, res) => {
          db.addBugToProject(current_project.id, res, () => {
            callback();
          });
        }
      );
    }
  });

  vorpal.delimiter("bugger$").show();
}

module.exports = {
  start: init
};
