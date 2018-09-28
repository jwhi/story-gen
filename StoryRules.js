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

module.exports = {rules}