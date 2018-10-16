const readline = require('readline-sync');
const utility = require("./utility.js");


/******************
 * Assumptions being made:
 * - All output is buffered to an output variable in the
 *     fact and will be displayed once the RuleEngine makes the check that output != null. This
 *     will allow changing output from console.log to another system in the future easier (hopefully).
 * 
 *****************/

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
        R.when(this.updateRules == true);
    },
    "consequence": function (R) {
        // End the rule engine to update rules
        R.stop();
    }
}];

module.exports = {rules}