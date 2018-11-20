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
    constructor(itemType, name, description, options) {
        // Types: food
        this.type = itemType,
        this.name = name,
        this.description = description;


        if (options.consumedText) {
            this.consumedText = options.consumedText;
        }
        if (options.actionWhenUsed) {
            // I will need to figure out the best way to design this, but
            // I want to give the protagonist increased provisions or something
            // if they consume a job reward.
            this.actionWhenUsed = options.actionWhenUsed;
        }
        if (options.from) {
            this.from = options.from;
        }
        if (options.shelfLife) {
            // This will handle if an item goes bad or not. Would be a weird
            // story to get a food item and bring it up a year later. If an
            // item spoils and the protagonist has it on them, the story will
            // include some text that they threw it away.
            this.shelfLife = options.shelfLife;
        }
        if (options.dayRecieved) {
            // This will be the day the item was given to the player. The item
            // shelfLife is days after this date that the item goes bad.
            // The day will be calculated by (currentYear)*(lengthOfYear) + (currentDay);
            this.dayRecieved = options.dayRecieved;
        }
    }
}
