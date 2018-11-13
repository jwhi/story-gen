"use strict";
const utility = require('./utility.js')
const Constants = require("./constants.js").Constants;

class World {
    constructor() {
        this.Year = Constants.World.InitialYear;
        this.Day = Constants.World.InitialDay;

        this.FirstDayOfSpring = Constants.World.TheDaySpringStarts;
        this.FirstDayOfSummer = Constants.World.TheDaySummerStarts;
        this.FirstDayOfAutumn = Constants.World.TheDayAutumnStarts;
        this.FirstDayOfWinter = Constants.World.TheDayWinterStarts;
        
        this.LengthOfYear = Constants.World.LengthOfYear;
        
        this.Status = Constants.WorldStatus.Peace;
    }
}

module.exports = { World };
