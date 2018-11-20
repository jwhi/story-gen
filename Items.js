/******************
 * Item Information
 * by Jeremy White
 * 
 * Items will be given to the protagonist in the story and have the ability
 * to show up later in the story.
 * 
 * If the player receives food for a quest reward, it will be stored in their inventory
 * until they are low on provisions. The item will be consumed and then there will be
 * text in the story reflecting that the item was used.
 * 
 * Options argument right now is just for handling giving food items optional story text when
 * the item gets eaten.
 * 
 *****************/
const utility = require('./utility.js');
const Constants = require("./constants.js").Constants;

class Item {
    constructor(options) {
        if (options.name) {
            this.name = options.name;
        } else {
            this.name = '';
        }

        if (options.description) {
            this.description = options.description;
        }
    }

    getDescription() {
        if (this.description) {
            return this.description;
        } else {
            return 'impossible to describe'
        }
    }
}

module.exports = {Item}