"use strict";
const utility = require('./utility.js');
const Constants = require('./constants.js').Constants;
const n = require('./Names.js');
const namePicker = new n.Names();

class Character {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;

        this.townsVisited = ["Wellington"];

        this.area = "Home";

        this.personalityTraits = [];

        this.strength = Constants.Character.InitialStrength;
        this.dexterity = Constants.Character.InitialDexterity;
        this.constitution = Constants.Character.InitialConstitution;
        this.intelligence = Constants.Character.InitialIntelligence;
        this.wisdom = Constants.Character.InitialWisdom;
        this.charisma = Constants.Character.InitialCharisma;
        this.provisions = Constants.Provisions.Initial;

        this.goals = [Constants.Goals.BecomeAFighter];
        this.skills = {};
        this.skills["fighter"] = 0;

        this.alignment = Constants.Alignment.Neutral;
        
        this.initialLuck = utility.rollDice(1,6);
        
    }

    getCurrentTown() {
        // Will return undefined when no town is set
        return this.townsVisited[this.townsVisited.length-1];
    }
}

/******
 * Will store information about any side characters that appear in the story.
 * Will be an object in the fact as an object using the characters relationship
 * to the protagonist as the key.
 * 
 * Example:
 * supportingCharacters["mom"] = new SupportingCharacter('firstName', 'lastName');
 * 
 * Then this can be updated as needed when more characteristics are added.
 * 
 * supportingCharacters["mom"].homeTown = "Axbridge"
 * 
 *****/
class SupportingCharacter {
    constructor(options) {
        if (options.firstName) {
            this.firstName = firstName;
        } else {
            // Pick random male or female name
            // Gender doesn't really matter and names are only seperated because that is
            // how I found the data
            this.firstName = ((utility.getRandomInt(2) == 2) ? namePicker.getMaleName() : namePicker.getFemaleName())
        }

        // Not all characters have last names
        if (options.lastName) {
            this.lastName = options.lastName;
        }

        // How does the protagonist know this person
        if (options.relationship) {
            this.relationship = options.relationship;
        }

        // The character's opinion of the protagonist
        // All the possible values are in the constants file.
        if (options.opinion) {
            this.opinion = options.opinion;
        } else {
            this.opinion = Constants.CharacterOpinions.Stranger;
        }

        // The city where this character is located. If not set now,
        // the location will be set to the when the protagonist first
        // interacts with this character.
        if (options.location) {
            this.location = options.location;
        }

        // Count the number of times the protagonist has talked with this character
        this.interactions = 0;
    }
}

module.exports = { Character, SupportingCharacter };
