const readline = require('readline-sync');

var RuleEngine = require("node-rules");

/* Creating Rule Engine instance */
var R = new RuleEngine();


/* Add rules for rooms and functions. */
var rules = [{
    "condition": function (R) {
        R.when(this.output);
    },
    "consequence": function (R) {
        console.log(this.output)
        this.output = '';
        R.restart();
    }
}, {
    "condition": function (R) {
        R.when(Object.keys(this.routes).length);
    },
    "consequence": function (R) {
        var answer = readline.question("Which direction (" + Object.keys(this.routes).toString() + ")? ");
        this.location = this.routes[answer];
        this.routes = {};
        R.restart();
    }
    
},{
    "condition": function (R) {
        R.when(this.end);
    },
    "consequence": function (R) {
        this.location = 0;
        R.stop();
    }
},{
    "condition": function (R) {
        R.when(this.location == 1);
    },
    "consequence": function (R) {
        this.output = "You peer into the gloom to see dark, slimy walls with pools of water on the stone floor in front of you. The air is cold and dank. You light your lantern and step warily into the blackness. Cobwebs brush your face and you hear the scurrying of tiny feet: rats, most likely. You set off into the cave. After a few yards you arrive at a junction.";
        this.output += "\nWill you turn west or east?";
        this.routes["east"] = 71;
        this.routes["west"] = 278;
        R.restart();
    }
}, {
    "condition": function (R) {
        R.when(this.location == 71)
    },
    "consequence": function (R) {
        this.output = "There is a right-hand turn to the north in the passage...."
        this.end = true;
        R.restart()
    }
}, {
    "condition": function (R) {
        R.when(this.location == 278)
    },
    "consequence": function (R) {
        this.output = "The passageway soon comes to an end at a locked woodeen door..."
        this.end = true;
        R.restart()
    }
}];


/* Register Rules */
R.register(rules);

/* Add a Fact with the player's information */
var fact = {
    "name": "Urist",
    "location": 1,
    "end": false,
    "routes": {}
};

/* Check if the engine blocks it! */
R.execute(fact, function (data) {
    if (data.end) {
        console.log("The end!");
    }
});
