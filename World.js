"use strict";
const utility = require('./utility.js');
const Constants = require('./loadJSON.js').Constants;

class World {
    constructor() {
        this.Year = Constants.World.InitialYear;
        this.Day = Constants.World.InitialDay;

        this.FirstDayOfSpring = Constants.World.TheDaySpringStarts;
        this.FirstDayOfSummer = Constants.World.TheDaySummerStarts;
        this.FirstDayOfAutumn = Constants.World.TheDayAutumnStarts;
        this.FirstDayOfWinter = Constants.World.TheDayWinterStarts;
        
        this.LengthOfYear = Constants.World.LengthOfYear;
        
        this.ProvisionsNeededForSeason = [];
        this.ProvisionsNeededForSeason.push(Constants.Provisions.NeededForSpring);
        this.ProvisionsNeededForSeason.push(Constants.Provisions.NeededForSummer);
        this.ProvisionsNeededForSeason.push(Constants.Provisions.NeededForAutumn);
        this.ProvisionsNeededForSeason.push(Constants.Provisions.NeededForWinter);

        this.Status = Constants.WorldStatus.Peace;
    }

    passDay(daysToPass) {
        if (daysToPass >= 0) {
            this.Day += daysToPass;
        } else {
            this.Day += 1;
        }
        if (this.Day >= this.LengthOfYear) {
            this.Year += 1;
            this.Day = 0;
        }
    }

    // Returns a string that contains the name of the current season.
    // This is used to check how much provisions are needed for the next season.
    // Not the best behavior and will need to be cleaned up in the future.
    getSeason() {
        if (this.Day >= 0 && this.Day < this.FirstDayOfSummer) {
            return "Spring";
        } else if (this.Day >= this.FirstDayOfSummer && this.Day < this.FirstDayOfAutumn) {
            return "Summer";
        } else if (this.Day >= this.FirstDayOfAutumn && this.Day < this.FirstDayOfWinter) {
            return "Autumn";
        } else {
            return "Winter";
        }
    }

    getNextSeason() {
        if (this.Day >= 0 && this.Day < this.FirstDayOfSummer) {
            return "Summer";
        } else if (this.Day >= this.FirstDayOfSummer && this.Day < this.FirstDayOfAutumn) {
            return "Autumn";
        } else if (this.Day >= this.FirstDayOfAutumn && this.Day < this.FirstDayOfWinter) {
            return "Winter";
        } else {
            return "Spring";
        }
    }

    getDaysUntilNextSeason() {
        if (this.Day >= 0 && this.Day < this.FirstDayOfSummer) {
            return this.FirstDayOfSummer - this.Day;
        } else if (this.Day >= this.FirstDayOfSummer && this.Day < this.FirstDayOfAutumn) {
            return this.FirstDayOfAutumn - this.Day;
        } else if (this.Day >= this.FirstDayOfAutumn && this.Day < this.FirstDayOfWinter) {
            return this.FirstDayOfWinter - this.Day;
        } else {
            return this.LengthOfYear - this.Day;
        }
    }

    // Returns the provisions needed for the next season. If the protagonist does not have enough
    // provisions at the start of the season, they will have a much harder time progressing and their
    // mood will be lowered. Will have to scavenge a lot more.
    getProvisionsNeeded() {
        if (this.ProvisionsNeededForSeason.length == 4) {
            if (this.getSeason() == "Spring") {
                // Provisions needed for summer.
                return this.ProvisionsNeededForSeason[1];
            } else if (this.getSeason() == "Summer") {
                // Provisions needed for autumn.
                return this.ProvisionsNeededForSeason[2];
            } else if (this.getSeason() == "Autumn") {
                return this.ProvisionsNeededForSeason[3];
            } else {
                // Provisions needed for spring.
                return this.ProvisionsNeededForSeason[0];
            }
        }
        // If for some reason the array storing the provisions needed does not
        // values for all 4 seasons, then just return the default
        return Constants.Provisions.NeededDefault;
    }
}

module.exports = { World };
