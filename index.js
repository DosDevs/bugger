const cli = require("./cli"); 
const auth = require("./auth");

console.log("Bugger!");
console.log("Please enter your credentials");
auth.login(()=> {
  console.log("Welcome!");
  cli.start();
});
