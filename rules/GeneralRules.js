/******************
 * General Rules
 * by Jeremy White
 * 
 * These rules are generic story components that can happen regardless of the protagonist's
 * location or class.
 * 
 * Found in these rules will be the system to do a town change, general time passing story segments,
 * and anything to keep the story going to ensure the protagonist eventually finds themselves
 * in the dungeon.
 * 
 * Priority of rules is something that acts a little strange. In most cases, 0 is the highest priority,
 * followed by 1 being the lowest and then the higher the number, the higher the priority.
 * However, when I try ending the story with a rule priority 0, the rule engine prioritizes other rules
 * causing an infinite loop.
 * 
 * To help keep priorities organized, values are stored in the constants value to make reorganizing priorities
 * a bit less painful.
 *****************/

const utility = require('../utility.js');
const jsonData = require('../loadJSON.js');
const Constants = jsonData.Constants;
const StorySegments = jsonData.StorySegments;
const c = require('../Character.js');
const jobCreator = require('../Jobs.js');
const itemCreator = require('../Items.js');

var rules = [{
    /************* Start of checks that pass time but don't provide any story *************/
    // This rule is for when there are no other rules that match.
    // It has the lowest priority, always enabled, and will cause
    // an infinite loop if there are no other rules to stop the
    // rule engine.
    "name": "PassDay",
    "priority": Constants.Priorities.PassDay,
    "on" : true,
    "condition": function (R) {
        R.when(this.world.Day >= 0);
    },
    "consequence": function (R) {
        this.passDay();
        this.debug["passedDayCount"] = (this.debug["passedDayCount"] ? this.debug["passedDayCount"] += 1 : this.debug["passedDayCount"] = 1);
        if (this.debug["passedDayCount"] > 2) {
            if (utility.rollDice() >= 3) {
                this.flags['findEvent'] = true;
            } else {
                this.flags['train'] = true;
            }
        }
        
        // If a bit of time passes and they have enough food, then they should train.
        // If they have done the training quest, that quest giver is marked as a trainer and gives them a bonus
        // If they haven't they train on their own and don't get much of a bonus.
        R.restart();
    }
},{
    // This rule forces a story to end after 30 days pass.
    // This will not how stories should end, but it is great
    // for testing.
    "name": "EndStory",
    "priority": Constants.Priorities.EndStory,
    "on" : true,
    "condition": function (R) {
        R.when(this.world.Day > 30);
    },
    "consequence": function (R) {
        this.queueOutput("Thirty days have passed.");
        this.flags["end"] = true;
        R.restart();
    }
},{
    /************* Start of checks that don't pass time but add flags to the fact. *************/

    // When the protagonist does not have enough provisions for the day,
    // need to add a flag that they should focus on rules that feed them.
    // If the protagonist already has the flag set to find food, rule is ignored.
    "name": "NeedProvisionsImmediately",
    "priority": Constants.Priorities.NeedProvisionsImmediately,
    "on" : true,
    "condition": function (R) {
        R.when(!this.flags['provisionsNeeded'] && (this.protagonist.provisions <= Constants.Provisions.UsedPerDay));
    },
    "consequence": function (R) {
        // want to keep track of who gives the item and expand the text when food items are used.
        for(var i = 0; i < this.protagonist.items.length; i++) {
            var protagonistItem = this.protagonist.items[i];
            if (protagonistItem.itemType == Constants.ItemTypes.Food) {
                this.queueOutput(`#hero eats ${protagonistItem.name} from their bag.`)
                if (protagonistItem.dayReceived + protagonistItem.daysBeforeRotten < this.world.getCurrentDay()) {
                    this.queueOutput(protagonistItem.rottenActionText);
                    this.protagonist.provisions += protagonistItem.provisionsGivenRotten;
                } else {
                    this.queueOutput(protagonistItem.actionText);
                    this.protagonist.provisions += protagonistItem.provisionsGiven;
                }
                // Remove item from inventory after it is eaten.
                this.protagonist.removeItemFromInventory(protagonistItem.name);
            }
        }

        if (this.protagonist.provisions <= Constants.Provisions.UsedPerDay) {
            this.flags['provisionsNeeded'] = true;
        }
        R.restart();
    }
},{
    // If the protagonist does not have enough provisions stored for the next season,
    // they get a flag to search for work. They will prioritize jobs that fit their goals,
    // within their skills, and give the best rewards.
    "name": "NeedJob",
    "priority": Constants.Priorities.NeedJob,
    "on" : true,
    "condition": function (R) {
        R.when(!this.flags['searchForJob'] && !this.flags['hasJob'] && (this.protagonist.provisions <= this.world.getProvisionsNeeded()));
    },
    "consequence": function (R) {
        this.flags['searchForJob'] = true;
        R.restart();
    }
},{
    /************* Start of checks that relate to food *************/
    // This is how the protagonist finds provisions no matter 
    // the personality, class, or any other details. Other rules
    // will add a more personalized way to find food, but this is
    // to make sure the main character can get some food.
    // Using debug object to keep track of how often this rule happens.
    // This allows us to modify the story text based on how often it has been called.
    "name": "FindProvisionsBasic",
    "priority": Constants.Priorities.FindProvisionsBasic,
    "on" : true,
    "condition": function (R) {
        R.when(this.flags['provisionsNeeded']);
    },
    "consequence": function (R) {
        this.debug["findProvisionsBasic"] = (this.debug["findProvisionsBasic"] ? this.debug["findProvisionsBasic"] += 1 : this.debug["findProvisionsBasic"] = 1);
        
        if (this.debug["findProvisionsBasic" < 4]) {
            this.queueOutput('#hero is hungry and needs to find some food.');
            this.queueOutput(`Searching for food in the woods near #heroLocation.`);
                
            if (this.debug["findProvisionsBasic"] < 2) {
                this.queueOutput('#hero is hungry and needs to find some food.');
                this.queueOutput(`Searching for food in the woods near #heroLocation.`);
                this.queueOutput(`#hero grabbed some of their favorite berries.`)
            } else {
                this.queueOutput(`#hero had to settle for some bland but edible plants.`);
            }
        } else {
            if (utility.rollDice() >= 3) {
                var otherCharacter = this.getRandomTownPerson();
                if (otherCharacter) {
                    this.queueOutput(`#hero has some food with ${otherCharacter.firstName}.`);
                } else {
                    // Hero already went and found a lot of food by themselves and there are no town people they know
                }
            } else {
                this.queueOutput('#hero has a meal alone.');
            }
        }
        this.protagonist.provisions += Constants.Provisions.CanBeFoundInBasicSearch;
        // Can set the flag to false instead of deleting because this flag will most likely occur a lot
        this.flags['provisionsNeeded'] = false;
        //delete this.flags['provisionsNeeded'];
        this.passDay();
        R.restart();
    }
},{
    /************* Start of checks that relate to jobs *************/
    "name": "FindBasicJob",
    "priority": Constants.Priorities.FindBasicJob,
    "on" : true,
    "condition": function (R) {
        R.when(this.flags['searchForJob'] && !this.flags['hasJob'] );
    },
    "consequence": function (R) {
        /*
        * Jobs available should be related to what town they are in.
        * Towns have economies centered around different forms of
        * agriculture and labor.
        * The number of jobs will also be affected by the size of the town.
        * This will eventually be another set of rules that generate jobs,
        * but right now the jobs use a template.
        */
        // Create/find a character to give the protagonist a job
        // Right now I always create a new person, but would be
        // nice to see reoccurring characters in longer stories
        var characterOptions = {
            //firstName:
            //lastName:
            //relationship:
            opinion: Constants.CharacterOpinions.Neighbor,
            location: this.protagonist.getCurrentTown()
        }
        var jobGiver = new c.SupportingCharacter(characterOptions);

        this.currentJob = jobCreator.getFightingJob(jobGiver, this.world.getCurrentDay());
        
        // Only want to display job story text if the fetch to jobCreator worked
        if (this.currentJob) {
            // Story segment about how the protagonist heard about this job
            
            this.queueOutput(`#hero needs to find work before #nextSeason.`)
            this.queueOutput(this.currentJob.assignmentText);

            // Story segment about getting to meet with the job giver.
            // Can use the job giver's opinion about the protagonist and their relationship to create different story segments.
            this.queueOutput(this.currentJob.giver.getFullDescription());

            if (this.currentJob.startingText) {
                this.queueOutput(this.currentJob.startingText);
            }
            
            if (this.currentJob.jobType == Constants.JobTypes.Fetch) {
                if (this.currentJob.fetchItem == "flower") {
                    // Give the protagonist a goal that will cause them to complete the job
                    this.protagonist.addGoal(Constants.Goals.FindFlower);
                } else if (this.currentJob.fetchItem == "cabbage") {
                    this.protagonist.addGoal(Constants.Goals.FindCabbage);
                }
            }

            // Flags do not get changed until the end.
            // Once job information is loaded from a file or database, want
            // to make sure the job is able to be created successfully so
            // the protagonist does not start their quest to complete a
            // corrupted job.
            this.flags['searchForJob'] = false;
            this.flags['hasJob'] = true;
        } else {
            // Disable basic job find once the list of jobs is empty
            
            this.queueOutput(`There is currently no work to be found in #heroLocation`)
            this.disableRules.push('FindBasicJob');
        }
        
        this.passDay();
        R.restart();
    }
},{
    /************* Start of checks that related to events *************/
    "name": "FindEvent",
    "priority": Constants.Priorities.FindEvent,
    "on" : true,
    "condition": function (R) {
        R.when(this.flags['findEvent']);
    },
    "consequence": function (R) {
        var characterOptions = {
            //firstName:
            //lastName:
            //relationship:
            opinion: Constants.CharacterOpinions.Friend,
            location: this.protagonist.getCurrentTown()
        }
        var jobGiver = new c.SupportingCharacter(characterOptions);

        this.lastEvent = jobCreator.getEvent(jobGiver, this.world.getCurrentDay());
        
        if (this.lastEvent) {
            this.events.push(this.lastEvent);
            this.queueOutput(this.lastEvent.assignmentText.replace('#jobGiver','#eventGiver'));
            if (this.lastEvent.startingText) {
                this.queueOutput(this.lastEvent.startingText.replace('#jobGiver','#eventGiver'));
            }
            this.queueOutput(this.lastEvent.giver.getFullDescription().replace('#jobGiver','#eventGiver'));

            this.flags['findEvent'] = false;

            if (this.lastEvent.worldField && this.lastEvent.successFunction(this.world.getValueFromField(this.lastEvent.worldField))
            || this.lastEvent.protagonistField && this.lastEvent.successFunction(this.protagonist.getValueFromField(this.lastEvent.protagonistField))) {
                if (this.lastEvent.immediateRewardText) {
                    this.queueOutput(this.lastEvent.immediateRewardText);
                } else {
                    this.queueOutput('#hero had everything they needed.');
                    this.queueOutput(this.lastEvent.rewardText);
                }
                this.events.pop();
            } else {
                if (this.lastEvent.trialText) {
                    this.queueOutput(this.lastEvent.trialText);
                }
            }
        } else {
            this.disableRules.push('FindEvent');
        }
        this.passDay();
        R.restart();
    }
},{
    "name": "TrainMainSkill",
    "priority": Constants.Priorities.TrainMainSkill,
    "on": true,
    "condition": function (R) {
        R.when(this.flags['train'])
    },
    "consequence": function (R) {
        
        var trainer = this.getTrainer('fighter');
        if (trainer) {
            this.debug["trainWithTrainer"] = (this.debug["trainWithTrainer"] ? this.debug["trainWithTrainer"] += 1 : this.debug["trainWithTrainer"] = 1);
            var trainerSessions = this.debug["trainWithTrainer"];
            this.queueOutput(`#hero asks ${trainer.firstName} to help them train some more.`);
            var storyOutput = '';
            switch (trainerSessions) {
                case 1:
                    storyOutput += `${trainer.firstName} tells #hero if they really want to become a fighter, then #hero should know it is not easy.`;
                    storyOutput += `\n#hero left the training session covered in bruises.`;
                    break;
                case 2:
                    storyOutput += `#hero learned how to predict some of ${trainer.firstName}'s moves.`;
                    break;
                case 3:
                    storyOutput += `#hero is becoming light on their feet and can finally hold their own against ${trainer.firstName}`;
                    break;
                default:
                    storyOutput += `${trainer.firstName} passes on more of their fighter knowledge to #hero.`;
                    break;
            }
            storyOutput += `\n#hero thanks ${trainer.firstName} for their time and heads home.`;
            this.queueOutput(storyOutput);
            this.protagonist.modifySkillFromName("fighter", Constants.Train.Trainer);
        } else {
            this.debug["train"] = (this.debug["train"] ? this.debug["train"] += 1 : this.debug["train"] = 1);
            var soloSessions = this.debug["train"];
            var skillLevel = this.protagonist.getValueFromField(Constants.ProtagonistField.FighterSkill);
            this.queueOutput(`#hero heads to their favorite spot to train by themselves, ${StorySegments.Train.Fighter.SoloTrainingLocation}`);
            switch (soloSessions) {
                case 1:
                case 2:
                    
                if (skillLevel == 0) {
                    this.queueOutput(StorySegments.Train.Fighter.NoSkill);
                } else if (skillLevel < 5) {
                    this.queueOutput(StorySegments.Train.Fighter.SomeSkill)
                }
                break;
                default:
                    this.queueOutput('#hero spends a few hours practicing their fighting.');
            }
            this.protagonist.modifySkillFromName("fighter", Constants.Train.Solo);
        }
        
        this.flags['train'] = false;
        this.passDay();
        R.restart();
    }
}, {
    /************* Start of rules that help the protagonist to accomplish goals *************/
    "name": "FlowerGoal",
    "priority": Constants.Priorities.BasicGoalProgress,
    "on" : true,
    "condition": function (R) {
        R.when(this.protagonist.hasGoal(Constants.Goals.FindFlower));
    },
    "consequence": function (R) {
        this.queueOutput(StorySegments.ItemGather.FlowerLocation);
        
        var jobItem = new itemCreator.Item(`${this.world.getSeason()}Flower`);
        
        if (this.currentJob && this.currentJob.jobType == Constants.JobTypes.Fetch) {
            this.queueOutput(this.currentJob.itemFetchedText);
        } else {
            this.queueOutput(StorySegments.ItemGather.Default);
        }

        this.protagonist.addItemToInventory(jobItem, this.world.getCurrentDay());
        this.queueOutput(StorySegments.ItemGather.PlacedItemInBag);

        this.protagonist.removeGoal(Constants.Goals.FindFlower);
        this.passDay();
        R.restart();
    }
},{
    "name": "CabbageGoal",
    "priority": Constants.Priorities.BasicGoalProgress,
    "on" : true,
    "condition": function (R) {
        R.when(this.protagonist.hasGoal(Constants.Goals.FindCabbage));
    },
    "consequence": function (R) {
        this.queueOutput('The small field is just on the edge of town.');
        
        var jobItem = new itemCreator.Item(`Cabbage`);
        
        if (this.currentJob && this.currentJob.jobType == Constants.JobTypes.Fetch) {
            this.queueOutput(this.currentJob.itemFetchedText);
        } else {
            this.queueOutput('#hero finds a good cabbage that is worth holding onto.');
        }

        this.protagonist.addItemToInventory(jobItem, this.world.getCurrentDay());

        this.protagonist.removeGoal(Constants.Goals.FindCabbage);
        R.restart();
    }
},{
    /************* Start of rules that check if jobs have been completed *************/
    // Need to check that the current job object has all the fields required to check for
    // success, but for testing purposes I am just testing if there is a current job and
    // assume that the required variables and functions for the job object are set.
    // Check should include: 
    //this.currentJob.successFunction(this.protagonist.getValueFromField(this.currentJob.protagonistField))
    // Rule currently does not work.
    "name": "JobSuccess",
    "priority": Constants.Priorities.CompleteJob,
    "on" : true,
    "condition": function (R) {
        R.when(this.currentJob && ((this.currentJob.protagonistField && this.currentJob.successFunction(this.protagonist.getValueFromField(this.currentJob.protagonistField)))));
    },
    "consequence": function (R) {
        if (this.currentJob.protagonistField == Constants.ProtagonistField.Item) {

            this.protagonist.removeItemFromInventory(this.currentJob.fetchItem);

            if (this.currentJob.itemTurnIn) {
                this.queueOutput(this.currentJob.itemTurnIn);
            }
        }

        //this.protagonist.removeGoal(Constants.Goals.FindFlower);
        
        if (this.currentJob.reward) {
            var jobReward = this.currentJob.reward;
            if (jobReward.rewardType == Constants.RewardTypes.SkillIncrease) {
               this.protagonist.modifySkillFromName(jobReward.rewardObject.skill, jobReward.rewardObject.modifier);
               var trainer = this.currentJob.giver;
               trainer.skill = jobReward.rewardObject.skill;
               this.addCharacter(trainer);
            } else if (jobReward.rewardType == Constants.RewardTypes.Item) {
                this.protagonist.addItemToInventory(jobReward.rewardObject, this.world.getCurrentDay());
                this.queueOutput(StorySegments.Job.ItemReward);
                this.addCharacter(this.currentJob.giver);
            } else {
                this.addCharacter(this.currentJob.giver);
            }
        }
        
        if (this.currentJob.rewardText) {
            this.queueOutput(this.currentJob.rewardText);
        }

        // Add trainer to the fact here
        

        // Delete this job from the fact after the fact and story
        // finish updating.
        delete this.currentJob;
        
        this.flags['hasJob'] = false;
        this.passDay();
        R.restart();
    }
},{
	"name": "EventSuccess",
    "priority": Constants.Priorities.CompleteEvent,
    "on" : true,
    "condition": function (R) {
        R.when(this.checkEvents() != -1);
    },
    "consequence": function (R) {
        var completedEvent = this.checkEvents();
        var event = this.events[completedEvent];
        this.lastEvent = this.events[completedEvent];
		if (this.lastEvent.reward) {
            if (event.rewardText) {
                this.queueOutput(event.rewardText.replace('#jobGiver','#eventGiver'));
            }
            var eventReward = this.lastEvent.reward;
            if (eventReward.rewardType == Constants.RewardTypes.SkillIncrease) {
               this.protagonist.modifySkillFromName(eventReward.rewardObject.skill, eventReward.rewardObject.modifier);
            } else if (eventReward.rewardType == Constants.RewardTypes.Item) {
                this.protagonist.addItemToInventory(eventReward.rewardObject);
                this.queueOutput(StorySegments.Job.ItemReward.replace('#jobGiver','#eventGiver'));
            }
        }

        if (this.lastEvent.giver) {
            this.addCharacter(this.lastEvent.giver);
        }
        
        

        // Delete this job from the fact after the fact and story
        // finish updating.
        this.events = this.events.slice(0, completedEvent).concat(this.events.slice(completedEvent+1));;
        
        this.passDay();
        R.restart();
    }
}];

module.exports = {rules}
