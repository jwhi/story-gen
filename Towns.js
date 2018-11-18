"use strict";
const utility = require('./utility.js')
const Constants = require("./constants.js").Constants;

class Towns {
    constructor(townName, townType, reputation) {
        this.townName = townName;
        this.townType = Constants.TownType.Town;
        
        if (reputation) {
            this.reputation = reputation;
        } else {
            this.reputation = 0;
        }
    }
}

module.exports = { Character };
