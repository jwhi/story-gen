var fs = require("fs");
var constantsJSON = fs.readFileSync('./constants.json')
const Constants = JSON.parse(constantsJSON);

module.exports = {Constants}