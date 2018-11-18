"use strict";
const utility = require('./utility.js')
const Constants = require("./constants.js").Constants;

class Character {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;

        this.townsVisited = ["Wellington"];

        this.strength = Constants.Character.InitialStrength;
        this.dexterity = Constants.Character.InitialDexterity;
        this.constitution = Constants.Character.InitialConstitution;
        this.intelligence = Constants.Character.InitialIntelligence;
        this.wisdom = Constants.Character.InitialWisdom;
        this.charisma = Constants.Character.InitialCharisma;
        this.provisions = Constants.Provisions.Initial;

        this.goals = [Constants.Goals.BecomeAFighter];

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
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

module.exports = { Character, SupportingCharacter };
