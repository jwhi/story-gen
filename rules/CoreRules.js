/******************
 * Core Rules
 * by Jeremy White
 * 
 * These are rules that dealing with the system. Output and input are all handled in these
 * rules to make sure async functions don't interfere with the rules engine.
 * 
 * An assumption is being made that all output is being buffered to the output variable in the
 * fact and will be displayed once the RuleEngine makes the check that output != null. This
 * will allow changing output from console.log to another system in the future easier (hopefully).
 *****************/

const readline = require('readline-sync');
const utility = require("../utility.js");
const Constants = require('../loadJSON.js').Constants;

var rules = [{
    "name": "Output",
	"priority": Constants.Priorities.Output,
	"on" : true,
    "condition": function (R) {
        R.when(this.output.length > 0);
    },
    "consequence": function (R) {
        // Right now all the lines in the story are stored in the rule files.
        // Plan for future will be to take all the text and place it in a JSON
        // file to allow easy editing. This will require a change to how we
        // add variables from the fact into the story. We have to create a
        // custom string template system so when the story from a separate file
        // contains the string #protagonistFirstName, the output knows to replace
        // that with the value stored in the fact.
        for (var i = 0; i < this.output.length; i++) {
            console.log(this.output[i]);
        }
        this.output = [];

        // Debug output just to see how different rules are behaving behind
        // the scenes. passedDayCount is used to count the number of days
        // that passed where no rules trigged story text to be written.
        if (this.debug["passedDayCount"]) {
            //console.log(`DEBUG: Passed ${this.debug["passedDayCount"]} days since last output.`)
            delete this.debug["passedDayCount"];
        }
        R.restart();
    }
},{
    "name": "ExitStory",
	"priority": Constants.Priorities.ExitStory,
	"on" : true,
    "condition": function (R) {
        R.when(this.end);
    },
    "consequence": function (R) {
        R.stop();
    }   
},{
    "name": "UpdateRules",
    "priority": Constants.Priorities.UpdateRules,
    "on": true,
    "condition": function (R) {
        R.when(this.addRuleFile.length > 0 || this.disableRules.length > 0);
    },
    "consequence": function (R) {
        // End the rule engine to update rules
        R.stop();
    }
}];

module.exports = {rules}