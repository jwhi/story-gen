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
const c = require('./Character.js');
const w = require('./World.js')

/* Creating Rule Engine instance */
var R = new RuleEngine();

/* Register Rules */
R.register(coreRules.rules);
R.register(generalRules.rules);

var protagonist = new c.Character("Jeremy", "White");
var world = new w.World();

/* Add a Fact with the protagonist's information */
var initialFact = {
    "protagonist": protagonist,
    "world": world,
    "flags": {},
    "end": false,
    "currentRuleFiles": [],
    "disableRules": [],
    "addRuleFile": [],
    "output": [],
    "debug": {},
    
    // All story rules that include actions or story events need to progress time.
    // This function handles the updates that happen every day no matter what.
    passDay(daysToPass) {
        if (daysToPass) {
            this.world.passDay(daysToPass);
            this.protagonist.provisions -= (Constants.Provisions.UsedPerDay * daysToPass);
        } else {
            this.world.passDay();
            this.protagonist.provisions -= Constants.Provisions.UsedPerDay;
        }
    },

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
    queueOutput(storyText) {
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
    }
};

/* Create a story! */
function StoryEngine(RE, fact) {
    RE.execute(fact, function (data) {
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
        if (data.end) {
            // If this is the end of the story, exit the function
            //console.log(data)
            //console.log("The End.");
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
            
            // If there were updates to the rules, run the rule engine again.
            // If there was not any updates, then we just end the story.
            if (rulesUpdated) {
                var newFact = {
                    "protagonist": data.protagonist,
                    "world": data.world,
                    "flags": data.flags,
                    "end": false,
                    "currentRuleFiles": data.currentRuleFiles,
                    "disableRules": [],
                    "addRuleFile": [],
                    "output": data.output,
                    "debug": data.debug,
                    passDay(daysToPass) {
                        if (daysToPass) {
                            this.world.passDay(daysToPass);
                            this.protagonist.provisions -= (Constants.Provisions.UsedPerDay * daysToPass);
                        } else {
                            this.world.passDay();
                            this.protagonist.provisions -= Constants.Provisions.UsedPerDay;
                        }
                    },
                    queueOutput(storyText) {
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
                    }
                };
                if (data.currentJob) {
                    newFact.currentJob = data.currentJob;
                }

                StoryEngine(RE, newFact);
            }
        }
    });
}
console.log(`Total rules: ${R.rules.length}\tActive rules: ${R.activeRules.length}`);
StoryEngine(R, initialFact);