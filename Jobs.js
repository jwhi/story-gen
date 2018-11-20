/******************
 * Job Information
 * by Jeremy White
 * 
 * This file will handle the different jobs that are available to the protagonist.
 * Jobs will eventually be created using rules also, but right now are handled by a
 * template.
 * 
 * Jobs cover whenever the protagonist needs to go somewhere else, even within town, in order to talk to someone.
 * This person will then give them a job and the fact gets a job flag so the rule engine knows to start checking
 * if a job's success requirement has been met.
 * 
 * Jobs are different than events, which will be when something happens to the player that is out of the norm.
 * An event would be your friend coming over and wanting you to help them train or bringing you a fresh loaf of bread.
 * 
 * 
 * 
 *****************/
const utility = require('./utility.js');
const Constants = require('./constants.js').Constants;
const c = require('./Character.js');
const Items = require('./Items.js');

class Job {
    // Everything is going into an options file right now because
    // once I start creating a system to create jobs from a file to
    // be loaded in, I want to be able to automatically create the
    // all the information for a job given any information.
    constructor(options) {
        if (options.giver) {
            this.giver = options.giver;
        } else {
            // TODO: handle when a quest does not provide the character
            // that gives the protagonist the job.
        }

        // Used in rule when conditional statement to determine what
        // information from the protagonist within the fact which will
        // then be passed immediately to the jobs success function.
        if (options.protagonistField) {
            this.protagonistField = options.protagonistField;
        } else {
            // This protagonist check is directly related to the
            // success check. If this is not included in the options,
            // need to determine from the success function.
        }

        if (options.successFunction) {
            this.successFunction = options.successFunction;
        } else {
            // Design a way of creating the success test that reflects
            // the text used for a job.
        }

        if (options.reward) {
            this.reward = options.reward;
        }

        if (options.rewardText) {
            this.rewardText = options.rewardText;
        }
    }
}

class Reward {
    // rewardType lets the engine know if the protagonist has a skill
    // that needs updating or if the reward was an item that is going
    // into the protagonist's inventory.
    constructor(rewardType, rewardObject) {
        this.rewardType = rewardType;
        // Reward object for skill rewards is skillName and then the modifier
        // Item reward objects will contain all the information needed to create an item.
        this.rewardObject = rewardObject;
    }
}

module.exports = {Job, Reward}