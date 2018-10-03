const utility = require("./utility.js");

var rules = [{
    "condition": function (R) {
        R.when(this.location == 1);
    },
    "consequence": function (R) {
        this.output = "You peer into the gloom to see dark, slimy walls with pools of water on the stone floor in front of you. The air is cold and dank. You light your lantern and step warily into the blackness. Cobwebs brush your face and you hear the scurrying of tiny feet: rats, most likely. You set off into the cave. After a few yards you arrive at a junction.";
        this.routes["east"] = 71;
        this.routes["west"] = 278;
        R.restart();
    }
}, {
    "condition": function (R) {
        R.when(this.location == 71)
    },
    "consequence": function (R) {
        this.output = "There is a right-hand turn to the north in the passage. Cautiously you approach a sentry post on the corner and, as you look in, you can see a strange Goblin-like creature in leather armour sleep at his post. You try to tiptoe past him.";
        this.TestYourLuck["Lucky"] = [301, "You are Lucky, he does not wake up and remains snoring loudly."];
        this.TestYourLuck["Unlucky"] = [248, "You are Unlucky, you step with a crunch on some loose ground and his eyes flick open."];
        R.restart()
    }
}, {
    "condition": function (R) {
        R.when(this.location == 301)
    },
    "consequence": function (R) {
        // Not yet implemented
        this.output = "There is a right-hand turn to the north in the passage...."
        this.end = true;
        R.restart()
    }
}, {
    "condition": function (R) {
        R.when(this.location == 248)
    },
    "consequence": function (R) {
        // Not yet implemented
        this.output = "There is a right-hand turn to the north in the passage...."
        this.end = true;
        R.restart()
    }
}, {
    "condition": function (R) {
        R.when(this.location == 278)
    },
    "consequence": function (R) {
        this.output = "The passageway soon comes to an end at a locked woodeen door..."
        this.end = true;
        R.restart()
    }
}];

var LFrules = [{
    "condition": function (R) {
        R.when(this.day >= 3);
    },
    "consequence": function (R) {
        R.stop();
    }
},{
    "condition": function (R) {
        R.when(this.time == 12);
    },
    "consequence": function(R) {
        this.time += 1;
        if (this.player.provisions >= 1) {
            this.output += "Have some lunch!"
            this.player.provisions -= 1;
        } else {
            this.output += "You have to skip lunch because you have no food."
        }
        R.restart();
    }
},{
    "condition": function (R) {
        R.when(this.time == 8);
    },
    "consequence": function (R) {
        this.output += "You wake up. ";
        this.action = '';
        this.time += 1;
        R.restart();
    }
},{
    "condition": function(R) {
        R.when(this.action == "forage")
    },
    "consequence": function(R) {
        this.output += timeFormat(this.time) + ": You run to the fields next to your house. It is a " + ((this.time < 1200) ? "chilly morning." : ((this.time < 1700) ? "lovely afternoon." : "dark night."));
        this.action = '';
        this.time += 2;
        var provisions = utility.rollDice(1,4);
        this.output += " " + (provisions == 5 ? "You were barely able to find any food." : (provisions == 10 ? "You had a very successful forage!" : "You managed to find some food."));
        this.player.provisions += provisions;
        R.restart();
    }
},{
    "condition": function(R) {
        R.when(this.player.provisions < 3 && this.action == '');
    },
    "consequence": function(R) {
        this.output += "You are feeling hungry. You need to find food.";
        this.action = "forage"
        this.time += 0
        R.restart();
    }
},{
    "condition": function(R) {
        R.when(this.time >= 23)
    },
    "consequence": function(R) {
        this.time = 0;
        this.day += 1;
        console.log("Player stamina: " + this.player.stamina + '/' + this.player.initialStamina)
        this.player.stamina = this.player.initialStamina
        console.log("End of day " + this.day)
        R.restart();
    }
},{
    "condition": function (R) {
        R.when(this.time >= 0);
    },
    "consequence": function (R) {
        this.time += 1;
        this.player.provisions -= (this.time < 12 ? .3 : .5);
        this.player.stamina -= .9
        R.restart();
    }
}];

function timeFormat(time) {
    return (time > 12 ? time-12 + ':00PM' : time + ':00AM')
}

module.exports = {rules, LFrules}
