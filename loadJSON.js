var fs = require("fs");

var constantsJSON = fs.readFileSync('./constants.json')
const Constants = JSON.parse(constantsJSON);

var storyJSON = fs.readFileSync('./storySegments.json');
const StorySegments = JSON.parse(storyJSON);

module.exports = {Constants, StorySegments}