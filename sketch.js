/******************
  * COPYRIGHT NOTICE:
  * Current game systems and text is from 'Fighting Fantasy 1: The Warlock of Firetop Mountain'
  * Copyright Steve Jackson and Ian Livingstone
  *****************/

/******************
 * Production-Rule System Story Generator and Quest System
 * by Jeremy White
 * 
 * Project is being done for a senior project course for Kansas State University.
 * Drawing inspiration from my favorite games and books to create dynamic and memorable
 * narrative experiences for players.
 *****************/

/******************
 * All rules will eventually be seperated out into individual files/database tabes. Text and
 * systems are being used as a placeholder until I finalize systems that will be used along
 * with my other project Labyrinthine Flight and how to make a module that will be easily
 * customizable for any project.
 *****************/

const readline = require('readline-sync');
const RuleEngine = require("node-rules");
const utility = require("./utility.js");

/* Creating Rule Engine instance */
var R = new RuleEngine();


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

/* Add rules for rooms and functions. */
var storyRules = [{
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
        this.output = "There is a right-hand turn to the north in the passage. Cautiously you approach a sentry post on the corner and, as you look in, you can see a strange Goblin-like creature in leather armour sleep at his post. You try to tiptoe past him.";
        this.TestYourLuck["Lucky"] = [301, "You are Lucky, he does not wake up and remains snoring loudly."];
        this.TestYourLuck["Unlucky"] = [248, "You are Unlucky, you step with a crunch on some loose ground and his eyes flick open."];
        R.restart()
    }
}, {
    "condition": function (R) {
        R.when(this.location == 301)
    },
    "consequence": function (R) {
        // Not yet implemented
        this.output = "There is a right-hand turn to the north in the passage...."
        this.end = true;
        R.restart()
    }
}, {
    "condition": function (R) {
        R.when(this.location == 248)
    },
    "consequence": function (R) {
        // Not yet implemented
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

var ioExitRules = [{
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
        this.output += "\nCurrent luck: " + this.luck;
        // Have to output here in order to get the pause.
        console.log(this.output);
        this.output = '';
        readline.keyInPause();
        var luckRoll = utility.rollDice(1);
        this.output += "Result: " + luckRoll;
        
        if (luckRoll <= this.luck) {
            this.output += "\n" + this.TestYourLuck["Lucky"][1];
            this.location = this.TestYourLuck["Lucky"][0];
        } else {
            this.output += "\n" + this.TestYourLuck["Unlucky"][1];
            this.location = this.TestYourLuck["Unlucky"][0];
        }
        if (this.luck > 0) {
            this.output += "\nSubtract one from luck.";
            this.luck -= 1;
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
    
},{
    "condition": function (R) {
        R.when(this.end);
    },
    "consequence": function (R) {
        this.location = 0;
        R.stop();
    }
}];


/* Register Rules */
R.register(ioExitRules);
R.register(storyRules);

/* Add a Fact with the player's information */
var fact = {
    "name": "Urist",
    "location": 1,
    "end": false,
    "routes": {},
    "TestYourLuck": {},
    "skill": 10,
    "stamina": 10,
    "luck": 10,
    "initialSkill": 10,
    "initialStamina": 10,
    "initialLuck": 10
};

/* Check if the engine blocks it! */
R.execute(fact, function (data) {
    if (data.end) {
        console.log("The end!");
    }
});
