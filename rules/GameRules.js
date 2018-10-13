const readline = require('readline-sync');
const utility = require("./utility.js");


/******************
 * Assumptions being made:
 * - Test Your Luck will always be an empty object until the player needs to make a luck check.
 *     This check will only have the options "Lucky" and "Unlucky"
 * - All (with 1 exception in Test Your Luck) output is buffered to an output variable in the
 *     fact and will be displayed once the RuleEngine makes the check that output != null. This
 *     will allow changing output from console.log to another system in the future easier (hopefully).
 * - Any story rule setting end to true will end the story and prevent any furthur checks. Need a
 *     different system in the future but this works for the time being.
 *     Current story end points: 301, 248, 278
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
    "condition": function (R) {
        R.when(Object.keys(this.TestYourLuck).length);
    },
    "consequence": function (R) {
        this.output += "\x1b[33mTest Your Luck\x1b[0m";
        this.output += "\nCurrent luck: " + this.player.luck;
        // Have to output here in order to get the pause.
        console.log(this.output);
        this.output = '';
        readline.keyInPause();
        var luckRoll = utility.rollDice(1);
        this.output += "Result: " + luckRoll;
        
        if (luckRoll <= this.player.luck) {
            this.output += "\n" + this.TestYourLuck["Lucky"][1];
            this.location = this.TestYourLuck["Lucky"][0];
        } else {
            this.output += "\n" + this.TestYourLuck["Unlucky"][1];
            this.location = this.TestYourLuck["Unlucky"][0];
        }
        if (this.player.luck > 0) {
            this.output += "\nSubtract one from luck.";
            this.player.luck -= 1;
        }
        this.TestYourLuck = {};
        this.routes = {};
        R.restart();
    }
},{
    "condition": function (R) {
        R.when(Object.keys(this.routes).length);
    },
    "consequence": function (R) {
        var answer = readline.question("Which direction (" + Object.keys(this.routes).toString() + ")? ");
        this.location = this.routes[answer];
        this.routes = {};
        R.restart();
    }
    
}];

module.exports = {rules}