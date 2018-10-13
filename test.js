/*

This file is for testing ways to delete the rules in the rule engine
and replate it with rules from an earily fact execution.

I want to keep the rules in the engine limited to only story arcs
the protagonist can reach to. So when the character moves towns, delete
all the rules from the previous town, or when choosing which rules to include
at the beginning, have a rules to choose the town and then once a town is chosen,
delete those rules and move onto adding story rules.


*/
const RuleEngine = require("node-rules");
const storyRules = require("./StoryRules.js");
const gameRules = require("./GameRules.js");
const c = require("./Character.js");

var halt = true;

/* Creating Rule Engine instance */
var R = new RuleEngine();

var rule = [{
    "name": "RegisterStoryRules",
    "condition": function(R) {
        R.when(this.load == "Story");
    },
    "consequence": function(R) {
        this.rules = [gameRules.rules, storyRules.rules];
        R.stop();
    }
}, {
    "name": "RegisterGameRules",
    "condition": function(R) {
        R.when(this.load = "Game");
    },
    "consequence": function(R) {
        this.rules = [gameRules.rules];
        R.stop();
    }
}];

R.register(rule);
/* Register Rules */
//R.register(gameRules.rules);
//R.register(storyRules.rules);

var townFact = {
    "rules": [],
    "load": "Story"
}

var newRules;;

/* Check if the engine blocks it! */
R.execute(townFact, function (data) {
    newRules = data.rules;
    console.log(R);
    console.log("\n\n\n\n\n\n");
    // Don't feel like this should be done, but don't know a better solution yet
    R.init();
    console.log(R);
    for (var i = 0; i < newRules.length; i++) {    
        R.register(newRules[i]);
    }

    var protagonist = new c.Character();

    /* Add a Fact with the protagonist's information */
    var characterFact = {
        "protagonist": protagonist,
        "location": 1,
        "end": false,
        "routes": {},
        "TestYourLuck": {},
        "day": 0,
        "time": 0,
        "output": '',
        "action": 3 // Sleep
    };

    R.execute(characterFact, function(data) {
        console.log(data.output)
    });
});