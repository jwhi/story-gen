/******************
  * COPYRIGHT NOTICE:
  * Current background system and text is from 'Dungeons & Dragons: 5th Edition'
  * Copyright Wizards of the Coast
  *****************/
 const utility = require("../utility.js");

var Hermit = {
    reason: [{
                text: "I was searching for spiritual enlightenment.",
                goal: "religion"
            },{
                text: "I was partaking of communal living in accordance with the dictates of a religious order.",
                goal: "religion"
            },{
                text: "I was exiled for a crime I didn't commit.",
                goal: "justice",
            }, {
                text: "I retreated from society after a life-altering event.",
                goal: "new life",
            },{
                text: "I needed a quiet place to work on my art, literature, music, or manifesto.",
                goal: "create great work",
            },{
                text: "I needed to commune with nature, far from civilization.",
                goal: "study nature",
            },{
                text: "I was a caretaker of an ancient ruin or relic.",
                goal: "preserve past",
            },{
                text: "I was a pilgrim in search of a person, place, or relic of spiritual significance.",
                goal: "pilgrimage"
            }],
    personality:
            [{
                text: "I've been isolated for so long that I rarely speak, preferring gestures and the occasional grunt.",
                trait: "mute"
            },{
                text: "I am utterly serene, even in the face of disaster.",
                trait: "peaceful"
            },{
                text: "The leader of my community had something wise to say on every topic, and I am eager to share that wisdom.",
                trait: "talkative"
            },{
                text: "I feel tremendous empathy for all who suffer.",
                trait: "empathetic"
            },{
                text: "I'm oblivious to etiquette and social expectations.",
                trait: "socially awkward"
            },{
                text: "I connect everything that happens to me to a grand, cosmic plan.",
                trait: "astrology"
            },{
                text: "I often get lost in my own thoughts and contemplation, becoming oblivious to my surroundings.",
                trait: "daydreamer"
            },{
                text: "I am working on a grand philosophical theory and love sharing my ideas.",
                trait: "opinionated"
            }]
}

var Outlander = {
    origin: ["Forester", "Trapper", "Homesteader", "Guide", "Exile or outcast", "Bounty hunter", "Pilgrim", "Tribal nomad", "Hunter-gatherer", "Tribal marauder"]
}

var Soldier = {
    specialty:
        [{
            title: "Officer"
        },{
            title: "Scout"
        },{
            title: "Infantry"
        },{
            title: "Cavalry"
        },{
            title: "Healer"
        },{
            title: "Quartermaster"
        },{
            title: "Standard bearer"
        }, {
            // Support includes cook, blacksmith, etc.
            title: "Support"
        }],
    personality:
        [{
            text: "I'm always polite and respectful.",
            trait: "polite"
        },{
            text: "I'm haunted by memories of war. I can't get the images of violence out of my mind.",
            trait: "haunted"
        },{
            text: "I've lost too many friends, and I'm slow to make new ones.",
            trait: "grieving"
        },{
            text: "I'm full of inspiring and cautionary tales from my military experience relevant to almost every combat situation.",
            trait: "strategic"
        },{
            text: "I can stare down a hell hound without flinching.",
            trait: "brave"
        },{
            text: "I enjoy being strong and like breaking things.",
            trait: "ogre"
        },{
            text: "I face problems head-on. A simple, direct solution is the best path to success.",
            trait: "focused"
        }],
    ideals:
        [{
            text: "Our lot is to lay down our lives in defense of others.",
            alignment: "good"
        },{
            text: "I do what I must and obey just authority.",
            alignment: "lawful"
        },{
            text: "When people follow orders blindly, they embrace a kind of tyranny.",
            alignment: "chaotic"
        },{
            text: "In life as in war, the stronger force wins.",
            alignment: "evil"
        }, {
            text: "Ideals aren't worth killing over or going to war for.",
            alignment: "neutral"
        },{
            text: "My city, nation, or people are all that matter.",
            alignment: "any"
        }],
    bond:
        [{
            text: "I would still lay down my life for the people I served with.",
            trait: "loyal"
        },{
            text: "Someone saved my life on the battlefield. To this day, I will never leave a friend behind.",
            trait: "loyal"
        },{
            text: "My honor is my life.",
            trait: "honorable"
        },{
            text: "I'll never forget the crushing defeat my company suffered or the enemies who dealt it.",
            trait: "regret"
        },{
            text: "Those who fight beside me are those worth dying for.",
            trait: "loyal"
        },{
            text: "I fight for those who cannot fight for themselves.",
            trait: "protector"
        }]
}

function getBackgroundInfo() {
    // For soldier
    var storyObject = {}
    storyObject.characteristics = [];

    var specialty = Soldier.specialty[utility.rollNSidedDice(Soldier.specialty.length-1)];
    storyObject.specialty = specialty;
    

    var personality = Soldier.personality[utility.rollNSidedDice(Soldier.personality.length-1)];
    storyObject.personality = personality;
    storyObject.characteristics.push(personality.trait)

    var ideals = Soldier.ideals[utility.rollNSidedDice(Soldier.ideals.length-1)];
    storyObject.ideals = ideals;
    storyObject.characteristics.push(ideals.alignment)

    var bond = Soldier.bond[utility.rollNSidedDice(Soldier.bond.length-1)];
    storyObject.bond = bond;
    storyObject.characteristics.push(bond.trait);

    return storyObject;
}

module.exports = {getBackgroundInfo};