/******************
 * Example Rules
 * by Jeremy White
 * 
 * These rules are to provide a space for testing rules and to provide
 * an example of different fact checks.
 *****************/

const utility = require("../utility.js");
const Constants = require("../loadJSON").Constants;
const fighterClassRules = require("./classes/fighterRules.js");

var rules = [{
    "name": "Test",
    "priority": 1,
    "on" : true,
    "condition": function (R) {
        R.when(this.protagonist.alignment == Constants.Alignment.Neutral);
    },
    "consequence": function (R) {
        this.queueOutput("You are neutral!");
        this.disableRules.push("Test");
        R.restart();
    }
},{
    "name": "Example",
    "priority": 1,
    "on" : true,
    "condition": function (R) {
        R.when(this.world.Day == 0);
    },
    "consequence": function (R) {
        this.queueOutput("Happy Spring!");
        this.world.Day += 1;
        R.restart();
    }
},{
    "name": "HasFighterGoal",
    "priority": 1,
    "on" : true,
    "condition": function (R) {
        R.when(this.protagonist.goals.indexOf(Constants.Goals.BecomeAFighter) >= 0);
    },
    "consequence": function (R) {
        this.queueOutput("I want to be a fighter! and I became one.");
        this.protagonist.goals = this.protagonist.goals.filter(function(goal) { return goal != Constants.Goals.BecomeAFighter });
        R.restart();
    }
}];

module.exports = {rules}