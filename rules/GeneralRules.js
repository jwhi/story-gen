/******************
 * General Rules
 * by Jeremy White
 * 
 * These rules are generic story components that can happen regardless of the protagonist's
 * location or class.
 * 
 * Found in these rules will be the system to do a town change, general time passing story segments,
 * and anything to keep the story going to ensure the protagonist eventually finds themselves
 * in the dungeon.
 * 
 * Priority of rules is something that acts a little strange. In most cases, 0 is the highest priority,
 * followed by 1 being the lowest and then the higher the number, the higher the priority.
 * However, when I try ending the story with a rule priority 0, the rule engine prioritizes other rules
 * causing an infinite loop.
 * 
 * To help keep priorities organized, values are stored in the constants value to make reorganizing priorities
 * a bit less painful.
 *****************/

const utility = require('../utility.js');
const Constants = require('../constants.js').Constants;
const fighterClassRules = require('./classes/fighterRules.js');
const w = require('../World.js');
const c = require('../Character.js')

var rules = [{
    /************* Start of checks that pass time but don't provide any story *************/
    // This rule is for when there are no other rules that match.
    // It has the lowest priority, always enabled, and will cause
    // an infinite loop if there are no other rules to stop the
    // rule engine.
    "name": "PassDay",
    "priority": Constants.Priorities.PassDay,
    "on" : true,
    "condition": function (R) {
        R.when(this.world.Day >= 0);
    },
    "consequence": function (R) {
        this.passDay();
        this.debug["passedDayCount"] = (this.debug["passedDayCount"] ? this.debug["passedDayCount"] += 1 : this.debug["passedDayCount"] = 1);
        R.restart();
    }
},{
    // This rule forces a story to end after 30 days pass.
    // This will not how stories should end, but it is great
    // for testing.
    "name": "EndStory",
    "priority": Constants.Priorities.EndStory,
    "on" : true,
    "condition": function (R) {
        R.when(this.world.Day > 30);
    },
    "consequence": function (R) {
        this.output.push("Thirty days have passed.");
        this.end = true;
        R.restart();
    }
},{
    /************* Start of checks that don't pass time but add flags to the fact. *************/

    // When the protagonist does not have enough provisions for the day,
    // need to add a flag that they should focus on rules that feed them.
    // If the protagonist already has the flag set to find food, rule is ignored.
    "name": "NeedProvisionsImmediately",
    "priority": Constants.Priorities.NeedProvisionsImmediately,
    "on" : true,
    "condition": function (R) {
        R.when(!this.flags['provisionsNeeded'] && (this.protagonist.provisions <= Constants.Provisions.UsedPerDay));
    },
    "consequence": function (R) {
        this.flags['provisionsNeeded'] = true;
        R.restart();
    }
},{
    // If the protagonist does not have enough provisions stored for the next season,
    // they get a flag to search for work. They will prioritize jobs that fit their goals,
    // within their skills, and give the best rewards.
    "name": "NeedJob",
    "priority": Constants.Priorities.NeedJob,
    "on" : true,
    "condition": function (R) {
        R.when(!this.flags['searchForJob'] && !this.flags['hasJob'] && (this.protagonist.provisions <= this.world.getProvisionsNeeded()));
    },
    "consequence": function (R) {
        this.flags['searchForJob'] = true;
        this.output.push(`${this.protagonist.firstName} needs to find work before ${this.world.getNextSeason()} comes in ${this.world.getDaysUntilNextSeason()} days.`)
        R.restart();
    }
},{
    /************* Start of checks that relate to food *************/
    // This is how the protagonist finds provisions no matter 
    // the personality, class, or any other details. Other rules
    // will add a more personalized way to find food, but this is
    // to make sure the main character can get some food.
    // Using debug object to keep track of how often this rule happens.
    // This allows us to modify the story text based on how often it has been called.
    "name": "FindProvisionsBasic",
    "priority": Constants.Priorities.FindProvisionsBasic,
    "on" : true,
    "condition": function (R) {
        R.when(this.flags['provisionsNeeded']);
    },
    "consequence": function (R) {
        this.debug["findProvisionsBasic"] = (this.debug["findProvisionsBasic"] ? this.debug["findProvisionsBasic"] += 1 : this.debug["findProvisionsBasic"] = 1);
        
        if (this.debug["findProvisionsBasic"] < 3) {
            this.output.push(`Searching for food in the woods near ${this.protagonist.getCurrentTown()}.`);
            this.output.push(`${this.protagonist.firstName} grabbed some of their favorite berries.`)
        } else {
            this.output.push(`${this.protagonist.firstName} had to settle for some bland but edible plants.`);
        }
        this.protagonist.provisions += Constants.Provisions.CanBeFoundInBasicSearch;
        // Can set the flag to false instead of deleting because this flag will most likely occur a lot
        this.flags['provisionsNeeded'] = false;
        //delete this.flags['provisionsNeeded'];
        this.passDay();
        R.restart();
    }
},{
    /************* Start of checks that relate to jobs *************/
    "name": "FindBasicJob",
    "priority": Constants.Priorities.FindBasicJob,
    "on" : true,
    "condition": function (R) {
        R.when(this.flags['searchForJob']);
    },
    "consequence": function (R) {
        /*
         * Jobs available should be related to what town they are in.
         * Towns have economies centered around different forms of
         * agriculture and labor.
         * 
         * The number of jobs will also be affected by the size of the town.
         * 
         * This will eventually be another set of rules that generate jobs,
         * but right now the jobs use a template.
         *
         */

        // Create/find a character to give the protagonist a job
        // Right now I always create a new person, but would be
        // nice to see reoccurring characters in longer stories
        var characterOptions = {
            //firstName:
            //lastName:
            //relationship:
            opinion: Constants.CharacterOpinions.Neighbor,
            location: this.protagonist.getCurrentTown()
        }
        var jobGiver = new c.SupportingCharacter(characterOptions);

        // Story segment about how the protagonist heard about this job
        this.queueOutput(`${this.protagonist.firstName} hear a rumor that ${jobGiver.firstName} was looking for help.`);

        // Story segment about getting to meet with the job giver.
        // Can use the job giver's opinion about the protagonist and their relationship to create different story segments.
        switch(jobGiver.opinion) {
            case Constants.CharacterOpinions.Neighbor:
                this.queueOutput(`${jobGiver.firstName} has lived in ${jobGiver.location} their whole life.`);
                if (jobGiver.interactions == 0) {
                    this.queueOutput(`This is the first time ${this.protagonist.firstName} has actually talked to them though.`)
                }
                break;
        }

        this.flags['searchForJob'] = false;
        this.flags['hasJob'] = true;
        R.restart();
    }
}];

module.exports = {rules}
