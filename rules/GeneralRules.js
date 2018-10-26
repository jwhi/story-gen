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
 *****************/

const utility = require("./utility.js");
const Constants = require("../constants.js").Constants;
const fighterClassRules = require("./classes/fighterRules.js");

var rules = [{
    "name": "End_After_3_Day",
    "priority": 11,
    "on" : true,
    "condition": function (R) {
        R.when(this.day >= 3);
    },
    "consequence": function (R) {
        console.log(this.output);
        this.output = "";
        this.end = true;
        R.stop();
    }
},{
    "name": "Wake_Trigger",
    "priority": 9,
    "on" : true,
    "condition": function (R) {
        R.when(this.time == 7);
    },
    "consequence": function (R) {
        this.output += "You wake up. ";
        this.action = Constants.Actions.NotSet;
        this.output += "Your stamina is now " + this.protagonist.stamina;
        this.time += 1;
        R.restart();
    }
}, {
    "name": "Sleep",
	"priority": 8,
	"on" : true,
    "condition": function(R) {
        R.when(this.action == Constants.Actions.Sleep);
    },
    "consequence": function(R) {
        if (this.protagonist.stamina < this.protagonist.initialStamina) {
            this.protagonist.stamina += Constants.Stamina.GainedPerHourOfSleep;
        } else {
            this.protagonist.stamina = this.protagonist.initialStamina;
        }
        this.protagonist.hunger -= Constants.Hunger.PerHourSleeping;
        //this.output += timeFormat(this.time) + ": Sleep time.\t" + this.time;
        this.time += 1;
        R.restart();
    }
},{
    "name": "Hunger_Trigger",
    "priority": 4,
    "on" : true,
    "condition": function(R) {
        // When food is low or another rule set protagonist's action to FindFood
        // FindFood set if protagonist is starving.
        R.when((this.protagonist.provisions <= Constants.Provisions.StartSearch || this.action == Constants.Actions.FindFood) && this.action != Constants.Actions.Forage);
    },
    "consequence": function(R) {
        /*
         * Logic will go here to determine what the character needs to do
         * If near forest and can hunt, then will hunt for food.
         * Have money and market/barker in town? Can buy food.
         * If no skills or money, there's always foraging or begging.
         */
        this.output += "You are feeling hungry. You need to find food.";
        this.action = Constants.Actions.Forage;
        this.time += 0
        R.restart();
    }
},{
    "name": "Eat",
	"priority": 2,
	"on" : true,
    "condition": function(R) {
       // If the protagonist is starving and not doing anything, they need to do something to fix their hunger.
       R.when(this.protagonist.hunger <= Constants.Hunger.Starving && this.action == Constants.Actions.NotSet);
   },
   "consequence": function (R) {
        this.output += timeFormat(this.time) + ": You are hungry. ";
        if (this.protagonist.provisions >= Constants.Provisions.EatenPerSnack) {
            this.output += "You eat some of your food supplies.";
            this.protagonist.hunger += Constants.Provisions.EatenPerSnack * Constants.Hunger.GainedFromProvision;
            this.protagonist.provisions -= Constants.Provisions.EatenPerSnack;
        } else if (this.protagonist.provisions > 0) {
            this.output += "You don't have any food stored, but you find some crumbs in your bag.";
            this.protagonist.hunger += this.protagonist.provisions * Constants.Hunger.GainedFromProvision;
            this.protagonist.provisions = 0;
            this.action = Constants.Actions.FindFood;
        } else {
            this.output += "You have no food. You need to find a way to get some food.";
            // Set protagonist's provision to 0 in case there was a point where they somehow ate more than they had.
            this.protagonist.provisions = 0;
            this.action = Constants.Actions.FindFood;
        }
        this.protagonist.hunger = Math.round(this.protagonist.hunger);
        this.output += " Current hunger: " + this.protagonist.hunger;
        this.time += 1
        R.restart();
   }
}, {
    "name": "Lunch",
	"priority": 4,
	"on" : true,
    "condition": function (R) {
        R.when(this.time == 12);
    },
    "consequence": function (R) {
        if (this.protagonist.provisions >= Constants.Provisions.EatenPerMeal) {
            this.output += timeFormat(this.time) + ": Have some lunch!"
            this.protagonist.hunger += Constants.Provisions.EatenPerMeal;
            this.protagonist.provisions -= Constants.Provisions.EatenPerMeal;
        } else {
            this.output += timeFormat(this.time) + ": You have to skip lunch because you have no food."
        }
        this.time += 1;

        R.restart();
    }
},{
    "name": "Forage",
	"priority": 2,
	"on" : true,
    "condition": function(R) {
        R.when(this.action == Constants.Actions.Forage)
    },
    "consequence": function(R) {
        this.output += timeFormat(this.time) + ": You run to the fields next to your house. It is a " + ((this.time < 12) ? "chilly morning." : ((this.time < 17) ? "lovely afternoon." : "dark night."));
        this.action = Constants.Actions.NotSet;
        this.time += Constants.Duration.Forage;
        var provisions = utility.rollDice(Constants.Provisions.ForagingDiceCount, Constants.Provisions.ForagingModifier);
        
        switch (provisions) {
            case (Constants.Provisions.ForagingDiceCount + Constants.Provisions.ForagingModifier):
                // Rolled a 1 on foraging dice rolls.
                this.output += "You were barely able to find any food.";
                break;
            case (Constants.Provisions.ForagingDiceCount*6 + Constants.Provisions.ForagingModifier):
                // Rolled a 6 on foraging dice rolls.
                this.output += "You had a very successful forage!";
                break;
            default:
                this.output += "You managed to find some food.";
                break;
        }
        this.protagonist.provisions += provisions;
        R.restart();
    }
},{
    "name": "Fall_Asleep",
	"priority": 12,
	"on" : true,
    "condition": function(R) {
        R.when(this.time >= 23)
    },
    "consequence": function(R) {
        // End of the day. Reset timers.
        this.time = 0;
        this.day += 1;
        this.protagonist.stamina = Math.trunc(this.protagonist.stamina);
        this.protagonist.hunger = Math.trunc(this.protagonist.hunger);
        this.output += "You fall asleep. Protagonist's stamina: " + this.protagonist.stamina + '/' + this.protagonist.initialStamina;
        this.protagonist.stamina = this.protagonist.initialStamina
        this.output += "\nEnd of day " + this.day;
        this.action = Constants.Actions.Sleep;

        if (this.day > 2) {
            this.addRuleFile.push(fighterClassRules.rules);
        }
        R.restart();
    }
},{
    "name": "PassTime",
	"priority": 1,
	"on" : true,
    "condition": function (R) {
        R.when(this.time >= 0 || this.time == 24);
    },
    "consequence": function (R) {
        /*
         * Whenever a character couldn't find anything to do:
         * - increment the time by one (hour)
         * - Reduce stamina by certain amount.
         * - Reduce Hunger. Starving when <= 2.
         */
        this.time += 1;
        this.protagonist.hunger -= (this.time < 12 ? Constants.Hunger.PerHourMorning : Constants.Hunger.PerHourEvening);
        this.protagonist.stamina -= .9
        
        if (this.time >= 24) {
            this.day += 1;
            this.time = 0;
        }
        R.restart();
    }
}];

function timeFormat(time) {
    (time == 0 || time == 12 ? time += 12 : time)
    return (time > 12 ? time-12 + ':00PM' : time + ':00AM')
}

module.exports = {rules}
