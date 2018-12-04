var fs = require("fs");

var constantsJSON = fs.readFileSync('./constants.json')
const Constants = JSON.parse(constantsJSON);

var storyJSON = fs.readFileSync('./storySegments.json');
const StorySegments = JSON.parse(storyJSON);

var itemsJSON = fs.readFileSync('./items.json');
const Items = JSON.parse(itemsJSON);

module.exports = {Constants, StorySegments, Items}