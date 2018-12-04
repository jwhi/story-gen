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
const jsonData = require("./loadJSON.js");
const Constants = jsonData.Constants;
const StorySegments = jsonData.StorySegments;
const Items = jsonData.Items;

class Item {
    constructor(id, options) {
        if (id && Items[id]) {
            // The id for items comes from the order they are in items.json
            // Will switch to a more user-friendly way of id's in the future
            this.itemType = Items[id].ItemType;
            this.name = Items[id].Name;
            this.description = Items[id].Description;

            if (options) {
                if (options.dayReceived) {
                    this.dayReceived = options.dayReceived;
                }
            }

            if (this.itemType == Constants.ItemTypes.Food) {
                if (Items[id].DaysBeforeRotten) {
                    this.daysBeforeRotten = Items[id].DaysBeforeRotten;
                }
                
                if (Items[id].ActionText) {
                    this.actionText = Items[id].ActionText;
                }

                if (Items[id].RottenActionText) {
                    this.rottenActionText = Items[id].RottenActionText;
                } else {
                    this.rottenActionText = StorySegments.Food.DefaultEatingRottenFood;
                }
                
                if (Items[id].ProvisionsGiven) {
                    this.provisionsGiven = Items[id].ProvisionsGiven;
                } else {
                    this.provisionsGiven = Constants.Food.DefaultProvisionsGiven;
                }

                if (Items[id].ProvisionsGivenRotten) {
                    this.provisionsGivenRotten = Items[id].ProvisionsGivenRotten;
                } else {
                    this.provisionsGivenRotten = Constants.Food.DefaultProvisionsGivenRotten;
                }

                // Since food can go bad, I do want to implement a sickness
                // system that allows for more story variety.
                // Using integers because using floats in the rule system
                // will lead to rounding errors even when adding simple decimals like 0.5
                // can lead to a variable becoming for example 5.00000000001
                if (Items[id].SicknessChance) {
                    this.sicknessChance = Items[id].SicknessChance;
                } else {
                    this.sicknessChance = Constants.Food.DefaultSicknessChance;
                }
            }
            
        }

        // Optional object allows the customizing of item name and descriptions if needed
        // Item id and all other attributes will remain the same but will eventually
        // be able to be customized as well after the item system is fully implemented.
        if (options) {
            if (options.name) {
                this.name = options.name;
            }

            if (options.description) {
                this.description = options.description;
            }
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