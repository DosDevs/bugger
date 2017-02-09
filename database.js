var firebase = require("./fbmanager")
var db = firebase.database();

function getAllProjects(code, callback) {
  db.ref(user.id).child("projects").once("value", snp => {
    callback(null, snp.val());
  });
}

module.exports = {
  getProject: getProject
}
