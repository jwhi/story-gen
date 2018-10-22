"use strict";
const utility = require('./rules/utility.js')
const Constants = require("./constants.js").Constants;

class Character {
    constructor(name, strength, dexterity, constitution, intelligence, wisdom, charisma, skill, stamina, luck) {
        this.name = name;
        this.strength = strength;
        this.dexterity = dexterity;
        this.constitution = constitution;
        this.intelligence = intelligence;
        this.wisdom = wisdom;
        this.charisma = charisma;
        this.provisions = 0;
        this.hunger = Constants.Hunger.Initial;
        this.xp = 0;
        this.class = new Class("Fighter")
        this.skills = {}
        this.maxHealth = this.class.hitDie + this.constitutionModifier;
        
        if (!skill) {
            this.initialSkill = utility.rollDice(1,6);
        } else {
            this.initialSkill = skill;
        }
        this.skill = this.initialSkill;

        if (!stamina) {
            this.initialStamina = utility.rollDice(2,12);
        } else {
            this.initialStamina = stamina;
        }
        this.stamina = this.initialStamina;

        if (!luck) {
            this.initialLuck = utility.rollDice(1,6);
        } else {
            this.initialLuck = luck;
        }
        this.luck = this.initialLuck;
    
    }

    // Skill modifier method
    skillMod(skill) {
        return Math.floor(skill-10)/2;
    }

    secondarySkillMod(name) {
        // Return the skill bonus from player selected skills and class skills.
        return ((this.skills[name]) ? this.skills[name] : 0) + this.class.secondarySkillMod(name);
    }

    get strengthModifier() {
        return this.skillMod(this.strength);
    }

    get dexterityModifier() {
        return this.skillMod(this.dexterity);
    }

    get constitutionModifier() {
        return this.skillMod(this.constitution);
    }

    get intelligenceModifier() {
        return this.skillMod(this.intelligence);
    }

    get wisdomModifier() {
        return this.skillMod(this.wisdom);
    }

    get charismaModifier() {
        return this.skillMod(this.charisma);
    }

}

class Class {
    constructor(name) {
        this.hitDie = 8;
        this.proficiencyBonus = 2;
        this.skills = {};

        switch(name) {
            case 'Barbarian':
                this.hitDie = 12;
                this.skills["Athletics"] = 1;
                this.skills["Perception"] = 1;
        }
    }

    secondarySkillMod(name) {
        if (this.skills[name]) {
            return this.proficiencyBonus;
        } else {
            return 0;
        }
    }

}

module.exports = { Character };
