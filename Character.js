"use strict";
const utility = require('./utility.js')
const Constants = require("./constants.js").Constants;

class Character {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;

        this.strength = Constants.Character.InitialStrength;
        this.dexterity = Constants.Character.InitialDexterity;
        this.constitution = Constants.Character.InitialConstitution;
        this.intelligence = Constants.Character.InitialIntelligence;
        this.wisdom = Constants.Character.InitialWisdom;
        this.charisma = Constants.Character.InitialCharisma;
        this.provisions = Constants.Provisions.Initial;

        this.goals = [Constants.Goals.BecomeAFighter];

        this.alignment = Constants.Character.Neutral;
        
        this.initialLuck = utility.rollDice(1,6);
        
    }
}

module.exports = { Character };
