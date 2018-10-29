var rules = [{
    "name": "Sample",
	"priority": 5,
	"on" : true,
    "condition": function (R) {
        R.when(this.protagonist);
    },
    "consequence": function (R) {
        // Add to the story and modify fact here.
        this.output += "YOU ARE A FIGHTER NOW!";
        this.disableRules.push("Sample");
        R.restart();
    }
}];

module.exports = {rules};