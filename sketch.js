"use strict";
/******************
 * Production-Rule System Story Generator
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
 * 
 * All text for the story is currently only stored in the rules so modifying individual story segments is not
 * the most convenient. All the story segments will eventually moved to their own file and comments will be
 * included so the writer has all the information about how that story segment gets triggered.
 * This won't be the easiest change to make since text sometimes relies on variables stored in the fact of the
 * rule engine, but just using JS template strings won't work directly.
 * 
 *****************/

/******************
 * Starting story in Wellington as someone who wants to be a fighter.
 *
 *****************/

const RuleEngine = require('node-rules');
const generalRules = require('./rules/GeneralRules.js');
const coreRules = require('./rules/CoreRules.js');
const Constants = require('./loadJSON.js').Constants;
const utility = require('./utility.js');
const c = require('./Character.js');
const w = require('./World.js')

/* Creating Rule Engine instance */
var R = new RuleEngine();

/* Register Rules */
R.register(coreRules.rules);
R.register(generalRules.rules);

/* Add a Fact with the protagonist's information */
var initialFact = createFact();

// Story introduction
console.log('\n');
console.log(`Our story begins with ${initialFact.protagonist.firstName} ${initialFact.protagonist.lastName}.`);
console.log(`They have a dream of becoming a fighter after being gifted a sword by their late father.`);
console.log(`The story begins at the beginning of the medieval era in ${initialFact.protagonist.getCurrentTown()} on a beautiful spring day.`)
console.log('\n');
//console.log(`Total rules: ${R.rules.length}\tActive rules: ${R.activeRules.length}`);
StoryEngine(R, initialFact);

/* Create a story! */
function StoryEngine(RE, fact) {
    RE.execute(fact, function (data) {
        //console.log(data);
        //console.log("PROTAGONIST DATA");
        //console.log(data.protagonist);
        //console.log("WORLD DATA");
        //console.log(data.world);
        //console.log("FLAGS");
        //console.log(data.flags);
        //console.log("DEBUG DATA");
        //console.log(data.debug);
        //console.log("MATCH PATH");
        //console.log(data.matchPath);
        //console.log(data.characters);
        if (data.flags['end']) {
            // If this is the end of the story, exit the function
            //console.log(data)
            console.log("\n\nThe End.\n");
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
            // Need to add system for keeping track when rules get disabled so when
            // new rule files are added, rules that were disabled earlier stay disabled.
            if (data.disableRules.length > 0) {
                for (var i = 0; i < data.disableRules.length; i++) {
                    RE.turn("OFF", {
                        "name": data.disableRules[i]
                    });
                }
                rulesUpdated = true;
            }
            if (rulesUpdated) {
                StoryEngine(RE, createFact(data));
            }
        }
    });
}

 /*
  Node-Rules would probably allow us to pass the object from the callback function back into
  the rule engine, but I created this function to create a fact that only has the variables
  needed to create the story.

  createFact gets called once with no parameters and another with a single object parameter
  with additional variables that we do not need. Default values helps prevent the generator
  trying to create a story with missing information.  
 */
function createFact({
    protagonist = new c.Character("John", "FooBar"),
    world = new w.World(),
    flags = {},
    currentRuleFiles = [],
    characters = {},
    output = [],
    debug = {},
    events = [],
    currentJob = null,
    lastEvent = null
} = {}) {
    var fact = {};
    fact.protagonist = protagonist;
    fact.world = world;
    fact.flags = flags;
    fact.currentRuleFiles = currentRuleFiles;
    fact.characters = characters;
    fact.output =  output;
    fact.debug = debug;
    fact.events = events;
    fact.currentJob = currentJob;
    fact.lastEvent = lastEvent;

    fact.disableRules = [];
    fact.addRuleFile = [];
    fact.end = false;

    fact.passDay = function(daysToPass) {
        if (daysToPass) {
            this.world.passDay(daysToPass);
            this.protagonist.provisions -= (Constants.Provisions.UsedPerDay * daysToPass);
        } else {
            this.world.passDay();
            this.protagonist.provisions -= Constants.Provisions.UsedPerDay;
        }
    };
    
    /*
     * Adds a function to handle adding text to the output. This will
     * save the pain of calling this.output.push('text') every time 
     * a fact queues output to be written by the output rule.
     * This function will also allow us to do any input sanitation if needed,
     * update the output to another object if needed in the future without
     * needing to rewrite a majority of the rules.
     * This would open up more opportunities to include variables in story
     * segments. For example, right now job reward text can not use text
     * stored in the item description when the item is turned in on the
     * completion of a job.
     */
    fact.queueOutput = function(storyText) {
        if (storyText && storyText.length > 0) {
            if (storyText.indexOf('#') >= 0) {
                var variableMap = {
                    hero: this.protagonist.firstName,
                    heroLocation: this.protagonist.getCurrentTown(),
                    season: this.world.getSeason(),
                    nextSeason: this.world.getNextSeason(),
                    daysUntilNextSeason: this.world.getDaysUntilNextSeason()
                };

                if (this.currentJob) {
                    variableMap['jobGiver'] = this.currentJob.giver.firstName;
                    variableMap['jobGiverLocation'] = this.currentJob.giver.location;
                    variableMap['jobGiverArea'] = this.currentJob.giver.area;

                    if (this.currentJob.jobType == Constants.JobTypes.Fetch) {
                        variableMap['fetchItem'] = this.currentJob.fetchItem;
                    }
                }
                
                if (this.lastEvent) {
                    variableMap['eventGiver'] = this.lastEvent.giver.firstName;
                    variableMap['eventGiverLocation'] = this.lastEvent.giver.location;
                    variableMap['eventGiverArea'] = this.lastEvent.area;
                }

                if (this.protagonist.items.length > 0) {
                    var lastItemAddedToBag = this.protagonist.items[this.protagonist.items.length - 1];
                    variableMap['item'] = lastItemAddedToBag.name;
                    variableMap['itemDescription'] = lastItemAddedToBag.description;
                }

                storyText = storyText.replace(/(?:\#)(\w+)/gi, function(matched){
                    // matched returns the variable keyword and the '#' before it, substring
                    // will return just the variable name that we can pass into the variableMap
                    if (!variableMap[matched.substring(1)]) {
                        // Is not in the variableMap
                        console.log(`ERROR: ${matched} => ${matched.substring(1)} is not in the variableMap or variable is undefined`);
                    } 
                    return variableMap[matched.substring(1)];
                });
            }
            this.output.push(storyText);
        }
    };

    fact.checkEvents = function() {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i].worldField) {
                if (this.events[i].successFunction(this.world.getValueFromField(this.events[i].worldField))) {
                    return i;
                }
            }
            if (this.events[i].protagonistField) {
                if (this.events[i].successFunction(this.protagonist.getValueFromField(this.events[i].protagonistField))) {
                    return i;
                }
            }
        }
        return -1;
    };

    fact.addCharacter = function(character) {
        var characterKey = character.location;
        if (!this.characters[characterKey]) {
            this.characters[characterKey] = {};
        }
        if (character.skill) {
            if (!this.characters[characterKey].trainers) {
                this.characters[characterKey].trainers = [];
            }
            if (this.characters[characterKey].trainers.indexOf(character) == -1) {
                this.characters[characterKey].trainers.push(character);
                return true;
            }
        } else {
            if (!this.characters[characterKey].townPeople) {
                this.characters[characterKey].townPeople = [];
            }
            if (this.characters[characterKey].townPeople.indexOf(character) == -1) {
                this.characters[characterKey].townPeople.push(character);
                return true;
            }
        }
        return false;
    }

    fact.getTrainer = function(skillName) {
        var characterKey = this.protagonist.getCurrentTown();
        var trainersList;
        if (this.characters[characterKey] && this.characters[characterKey].trainers) {
            trainersList =  this.characters[characterKey].trainers;
        } else {
            return;
        }
        
        for (var i = 0; i , trainersList.length; i++) {
            if (trainersList[i].skill == skillName) {
                return trainersList[i];
            }
        }

        return;

    }

    fact.getRandomTownPerson = function() {
        var characterKey = this.protagonist.getCurrentTown();
        if (!this.characters[characterKey]) {
            return;
        }
        var townPeople = (this.characters[characterKey].townPeople) ? this.characters[characterKey].townPeople : [];
        if (townPeople.length > 0) {
            var index = utility.getRandomInt(townPeople.length -1);
            return townPeople[index];
        } 
        return;
    }
    return fact;
}