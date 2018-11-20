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
const n = require('./Names.js');
const namePicker = n.Names();

class Job {
    
    constructor(startingLocation, goal) {
        /*
         * Not really sure how to handle this. Will create a sample job of a friend coming over and asking you to help them train.
         * Ideas:
         * 1. Gather (get item and keep it)
         * 2. Delivery (take item to specific person or location. Would also include going to go talk to a character at the request of another character)
         * 3. Fetch (get item and bring it back)
         * 4. Defend
         * 5. Protect a farmer's sheep from kids she things is messing with them.
         * 6. Chance it's something else
         * 7. Doesn't require any skill, but just need to stay up
         * 8. Attack
         * 9. Build
         */
        
         //var jobTypeSelect = utility.getRandomInt(9);
        // Only gather jobs for the time being.
        this.type = 1;

        var person = new c.SupportingCharacter(((utility.getRandomInt(2) == 2) ? namePicker.getMaleName() : namePicker.getFemaleName()), {location: startingLocation, opinion: Constants.CharacterOpinions.BestFriend});
        person.skill = 0;
        
        this.questGiver = person;

        this.success = function() { return this.questGiver.skill > 2 }

        var rewardItem = 
            new Items(Constants.ItemTypes.Food, "bread", "freshly baked and best they have made.",
            {
                consumedText: function(currentDay) { if (currentDay <= (this.dayReceived + this.shelfLife)) { return "Wow! Fine loaf of bread." } else { return "Wow! Stale bread." }},
                actionWhenUsed: function(currentDay) { if (currentDay <= (this.dayReceived + this.shelfLife)) { return 4 } else { return 1 } }
            });
        this.reward = ['Item', rewardItem];
        this.failureReward = ['String', `${this.questGiver.firstName} is disappointed that they weren't able too much in practice.`]
    }
}
