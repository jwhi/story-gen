"use strict";

/******************
 * Production-Rule System Story Generator and Quest System
 * by Jeremy White
 * 
 * Project is being done for a senior project course for Kansas State University.
 * Drawing inspiration from my favorite games and books to create dynamic and memorable
 * narrative experiences for users.
 *****************/

/******************
 * Rules are separated out into StoryRules.js and GameRules.js. I want to eventually make story rules
 * to only be a template that loads stories from a database. Currently there needs to be a rule for
 * every story segment. Text and systems are being used as a placeholder until I finalize systems that will be
 * used along with my other project Labyrinthine Flight and how to make a module that will be easily
 * customizable for any project.
 *****************/

const RuleEngine = require("node-rules");
const generalRules = require("./rules/GeneralRules.js");
const coreRules = require("./rules/CoreRules.js");
const c = require("./Character.js");

/* Creating Rule Engine instance */
var R = new RuleEngine();

/* Register Rules */
R.register(coreRules.rules);
R.register(generalRules.rules);

var protagonist = new c.Character("Urist", 10, 10, 10, 10, 10, 10)

/* Add a Fact with the protagonist's information */
var initialFact = {
    "protagonist": protagonist,
    "end": false,
    "currentRuleFiles": [],
    "disableRules": [],
    "addRuleFile": [],
    "day": 0,
    "time": 0,
    "output": '',
    "action": 3, // Sleep
    "runTwice": 0
};

/* Create a story! */
function StoryEngine(RE, fact) {
    RE.execute(fact, function (data) {
        //console.log(data.matchPath)
        if (data.end) {
            // If this is the end of the story, exit the function
            console.log("The End.");
            return;
        } else {
            var rulesUpdated = false;

            if (data.addRuleFile.length > 0) {
                var newRules = data.addRuleFile;
                RE.init();
                RE.register(coreRules.rules);
                RE.register(generalRules.rules);
                for (var i = 0; i < data.currentRuleFiles.length; i++) {
                    RE.register(data.currentRuleFiles[i]);
                }
                for (var i = 0; i < newRules.length; i++) {    
                    RE.register(newRules[i]);
                }
                data.currentRuleFiles.concat(newRules);
                rulesUpdated = true;
            }
            if (data.disableRules.length > 0) {
                for (var i = 0; i < data.disableRules.length; i++) {
                    RE.turn("OFF", {
                        "name": data.disableRules[i]
                    });
                }
                rulesUpdated = true;
            }
            
            // If there were updates to the rules, run the rule engine again.
            // If there was not any updates, then we just end the story.
            if (rulesUpdated) {
                var newFact = {
                    "protagonist": data.protagonist,
                    "end": false,
                    "currentRuleFiles": data.currentRuleFiles,
                    "disableRules": [],
                    "addRuleFile": [],
                    "day": data.day,
                    "time": data.time,
                    "output": data.output,
                    "action": data.action,
                };

                StoryEngine(RE, newFact);
            }
        }
    });
}

StoryEngine(R, initialFact);