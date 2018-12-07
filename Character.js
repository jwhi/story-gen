"use strict";
const utility = require('./utility.js');
const jsonData = require('./loadJSON.js');
const Constants = jsonData.Constants;
const StorySegments = jsonData.StorySegments;
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

        this.items = [];

        this.alignment = Constants.Alignment.Neutral;
        
        this.initialLuck = utility.rollDice(1,6);
        
    }

    getCurrentTown() {
        // Will return undefined when no town is set
        return this.townsVisited[this.townsVisited.length-1];
    }

    getValueFromField(fieldName) {
        if (fieldName == Constants.ProtagonistField.Item) {
            return this.items;
        }
        if (fieldName == Constants.ProtagonistField.FighterSkill) {
            return this.skills["fighter"];
        }
    }

    modifySkillFromName(skillName, modifier) {
        if (this.skills[skillName]) {
            this.skills[skillName] += modifier;
        } else {
            this.skills[skillName] = modifier;
        }
    }

    addItemToInventory(item, day) {
        if (day) {
            item.dayReceived = day;
        }
        this.items.push(item);
    }

    removeItemFromInventory(itemName) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].name == itemName) {
                this.items = this.items.slice(0, i).concat(this.items.slice(i+1));
                return;
            }
        }
    }

    hasGoal(goalToCheck) {
        return (this.goals.indexOf(goalToCheck) >= 0)
    }

    addGoal(goalToAdd) {
        // Don't add the goal if the character already has it
        if (!this.hasGoal(goalToAdd)) {
            this.goals.push(goalToAdd);
        }
        
    }

    removeGoal(goalToRemove) {
        this.goals = this.goals.filter(function(goal) { return goal != goalToRemove });
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
        if (!options) {
            options = {};
        }

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

        if (options.area) {
            this.area = options.area;
        } else {
            this.area = "home";
        }

        if (options.description) {
            this.description = options.description;
        }

        // Count the number of times the protagonist has talked with this character
        this.interactions = 0;
    }

    getFullDescription() {
        if (this.description) {
            return this.description;
        }

        var desc = '';
        
        switch(this.opinion) {
            case Constants.CharacterOpinions.Neighbor:
                desc += StorySegments.CharacterDescriptions.BornInTown;
                if (this.interactions == 0) {
                    desc += `\n${StorySegments.CharacterDescriptions.FirstEncounterWithNeighbor}`;
                }
                break;
            case Constants.CharacterOpinions.Friend:
                desc += `${StorySegments.CharacterDescriptions.FriendsRoughTimes}`;
                break;
            case Constants.CharacterOpinions.TownHero:
                desc += `${this.firstName} is known for protecting ${this.location}.`
                break;
            default:
                desc += `Not much is known about ${this.firstName}`;
                break;
        }

        return desc;
    }
}

module.exports = { Character, SupportingCharacter };
