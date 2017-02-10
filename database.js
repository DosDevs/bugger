var firebase = require("./fbmanager");
var db = firebase.database();
const auth = require("./auth");

function getAllProjects(callback) {
  db.ref("projects").orderByKey().once("value", snp => {
    callback(null, snp.val());
  });
}

function addProject(info, callback) {
  info.user = auth.session.user.uid;
  db.ref("projects").push(info, () => {
    callback();
  });
}

function getProjectByCardinal(pos, callback) {
  db.ref("projects").orderByKey().limitToFirst(pos).once("value", snp => {
    var data = snp.val();
    if (!data) {
      callback();
    } else {
      var id = 0;
      for (var k in data) {
        id++;
        if (id == pos) {
          var p = data[k];
          p.id = k;
          callback(null, p);
          break;
        }
      }
    }
  });
}

function getProjectByShortName(shortname, callback) {
  db.ref("projects").orderByChild("shortname").equalTo(shortname).once("value", snp => {
    var data = snp.val();
    if (!data) {
      callback();
    } else {
      for(var k in data) {
        var p = data[k];
        p.id = k;
        callback(null, p);
        break;
      }
    }
  });
}

function getAllBugsForProject(project, callback) {
  db.ref("bugs").child(project).once("value", snp => {
    var data = snp.val();
    if (!data) {
      callback();
    } else {
      var arr = [];
      for(var k in data) {
        var b = data[k];
        b.id = k;
        b.project = project;
        arr.push(b);
      }
      callback(null, arr);
    }
  });
}

function addBugToProject(project, info, callback) {
  info.user = auth.session.user.uid;
  info.status = "open"
  db.ref("bugs").child(project).push(info, () => {
    callback();
  });
}

module.exports = {
  getAllProjects,
  addProject,
  getProjectByCardinal,
  getAllBugsForProject,
  addBugToProject,
  getProjectByShortName
};
