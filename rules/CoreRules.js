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

var rules = [{
    "name": "Output",
	"priority": 10,
	"on" : true,
    "condition": function (R) {
        R.when(this.output);
    },
    "consequence": function (R) {
        console.log(this.output)
        this.output = '';
        R.restart();
    }
},{
    "name": "UpdateRules",
    "priority": 15,
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