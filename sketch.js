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
 * Rules are seperated out into StoryRules.js and GameRules.js. I want to eventually make room rules
 * to only be a template that loads rooms from a database. Currently there needs to be a rule for
 * every room. Text and systems are being used as a placeholder until I finalize systems that will be
 * used along with my other project Labyrinthine Flight and how to make a module that will be easily
 * customizable for any project.
 *****************/

const RuleEngine = require("node-rules");
const storyRules = require("./StoryRules.js");
const gameRules = require("./GameRules.js");
const c = require("./Character.js");

/* Creating Rule Engine instance */
var R = new RuleEngine();

/* Register Rules */
R.register(gameRules.rules);
R.register(storyRules.LFrules);
var player = new c.Character()

/* Add a Fact with the player's information */
var fact = {
    "player": player,
    "location": 1,
    "end": false,
    "routes": {},
    "TestYourLuck": {},
    "day": 0,
    "time": 0,
    "output": '',
    "action": 'sleep'
};

/* Check if the engine blocks it! */
R.execute(fact, function (data) {
    console.log(data.output)
    if (data.end) {
        console.log("The end!");
    }
});