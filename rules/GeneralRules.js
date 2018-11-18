/******************
 * General Rules
 * by Jeremy White
 * 
 * These rules are generic story components that can happen regardless of the protagonist's
 * location or class.
 * 
 * Found in these rules will be the system to do a town change, general time passing story segments,
 * and anything to keep the story going to ensure the protagonist eventually finds themselves
 * in the dungeon.
 *****************/

const utility = require("../utility.js");
const Constants = require("../constants.js").Constants;
const fighterClassRules = require("./classes/fighterRules.js");

var rules = [{
    "name": "Test",
    "priority": 1,
    "on" : true,
    "condition": function (R) {
        R.when(this.protagonist.alignment == Constants.Alignment.Neutral);
    },
    "consequence": function (R) {
        this.output += "You are neutral!\n";
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
        this.output += "Happy Spring!\n";
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
        this.output += "I want to be a fighter! and I became one\n";
        this.protagonist.goals = this.protagonist.goals.filter(function(goal) { return goal != Constants.Goals.BecomeAFighter });
        R.restart();
    }
}];

module.exports = {rules}
