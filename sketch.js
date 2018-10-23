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
var protagonist = new c.Character()

/* Add a Fact with the protagonist's information */
var fact = {
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

/* Create a story! */
R.execute(fact, function (data) {
    //console.log(data.matchPath);
});