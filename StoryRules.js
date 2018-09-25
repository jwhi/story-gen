var rules = [{
    "condition": function (R) {
        R.when(this.location == 1);
    },
    "consequence": function (R) {
        this.output = "You peer into the gloom to see dark, slimy walls with pools of water on the stone floor in front of you. The air is cold and dank. You light your lantern and step warily into the blackness. Cobwebs brush your face and you hear the scurrying of tiny feet: rats, most likely. You set off into the cave. After a few yards you arrive at a junction.";
        this.output += "\nWill you turn west or east?";
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

var ioExitRules = [{
    "condition": function (R) {
        R.when(this.output);
    },
    "consequence": function (R) {
        console.log(this.output)
        this.output = '';
        R.restart();
    }
},{
    "condition": function (R) {
        R.when(Object.keys(this.TestYourLuck).length);
    },
    "consequence": function (R) {
        this.output += "\x1b[33mTest Your Luck\x1b[0m";
        this.output += "\nCurrent luck: " + this.luck;
        // Have to output here in order to get the pause.
        console.log(this.output);
        this.output = '';
        readline.keyInPause();
        var luckRoll = utility.rollDice(1);
        this.output += "Result: " + luckRoll;
        
        if (luckRoll <= this.luck) {
            this.output += "\n" + this.TestYourLuck["Lucky"][1];
            this.location = this.TestYourLuck["Lucky"][0];
        } else {
            this.output += "\n" + this.TestYourLuck["Unlucky"][1];
            this.location = this.TestYourLuck["Unlucky"][0];
        }
        if (this.luck > 0) {
            this.output += "\nSubtract one from luck.";
            this.luck -= 1;
        }
        this.TestYourLuck = {};
        this.routes = {};
        R.restart();
    }
},{
    "condition": function (R) {
        R.when(Object.keys(this.routes).length);
    },
    "consequence": function (R) {
        var answer = readline.question("Which direction (" + Object.keys(this.routes).toString() + ")? ");
        this.location = this.routes[answer];
        this.routes = {};
        R.restart();
    }
    
},{
    "condition": function (R) {
        R.when(this.end);
    },
    "consequence": function (R) {
        this.location = 0;
        R.stop();
    }
}];

module.exports = {rules}