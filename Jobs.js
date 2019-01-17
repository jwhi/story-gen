/******************
 * Job Information
 * by Jeremy White
 * 
 * This file will handle the different jobs that are available to the protagonist.
 * Jobs will eventually be created using rules also, but right now are handled by a
 * template.
 * 
 * Jobs cover whenever the protagonist needs to go somewhere else, even within town, in order to talk to someone.
 * This person will then give them a job and the fact gets a job flag so the rule engine knows to start checking
 * if a job's success requirement has been met.
 * 
 * Jobs are different than events, which will be when something happens to the player that is out of the norm.
 * An event would be your friend coming over and wanting you to help them train or bringing you a fresh loaf of bread.
 * 
 * 
 * 
 *****************/
const utility = require('./utility.js');
const jsonData = require('./loadJSON.js');
const Constants = jsonData.Constants;
const StorySegments = jsonData.StorySegments;
const c = require('./Character.js');
const itemCreator = require('./Items.js');

class Job {
    // Everything is going into an options file right now because
    // once I start creating a system to create jobs from a file to
    // be loaded in, I want to be able to automatically create the
    // all the information for a job given any information.
    constructor({
        jobType = Constants.JobTypes.None,
        // I don't know the best way to handle when no job giver
        // is assigned. This will happen often because of how I handle
        // job creation/storage in the functions down below that fetches jobs
        giver = new c.SupportingCharacter(),
        fetchItem,
        protagonistField,
        worldField,
        successFunction,
        reward,
        assignmentText = StorySegments.Job.Rumor,
        startingText,
        itemFetchedText,
        itemTurnIn,
        rewardText,
        trialText,
        immediateRewardText,
        dayAssigned
    } = {}) {
        this.jobType = jobType;
        this.giver = giver;
        this.reward = reward;
        this.assignmentText = assignmentText;
        this.itemTurnIn = itemTurnIn;
        this.rewardText = rewardText;
        this.trialText = trialText;
        this.immediateRewardText = immediateRewardText;
        this.dayAssigned = dayAssigned;
        this.worldField = worldField;

        if (fetchItem) {
            this.fetchItem = fetchItem;
        } else {
            if (jobType == Constants.JobTypes.Fetch) {
                this.fetchItem = "ERROR";
            }
        }

        // Used in rule when conditional statement to determine what
        // information from the protagonist within the fact which will
        // then be passed immediately to the jobs success function.
        if (protagonistField != null) {
            this.protagonistField = protagonistField;
        } else {
            // TODO: This protagonist check is directly related to the
            // success check. If this is not included in the options,
            // need to determine from the success function.
        }

        if (successFunction) {
            this.successFunction = successFunction;
        } else {
            // TODO: Design a way of creating the success test that reflects
            // the text used for a job.
        }

        if (startingText) {
            this.startingText = startingText;
        } else {
            if (this.jobType == Constants.JobTypes.Fetch) {
                this.startingText = StorySegments.Job.StartFetchJob;
            }
        }

        if (itemFetchedText) {
            this.itemFetchedText = itemFetchedText;
        } else {
            if (this.jobType == Constants.JobTypes.Fetch) {
                this.itemFetchedText = StorySegments.ItemGather.Default;
            }
        }
    }
}

class Reward {
    // rewardType lets the engine know if the protagonist has a skill
    // that needs updating or if the reward was an item that is going
    // into the protagonist's inventory.
    constructor(rewardType, rewardObject) {
        this.rewardType = rewardType;
        // Reward object for skill rewards is skillName and then the modifier
        // Item reward objects will contain all the information needed to create an item.
        this.rewardObject = rewardObject;
    }
}

var FightingJobs = [
    // Fetch a flower for your neighbor
    new Job({
        jobType: Constants.JobTypes.Fetch,
        fetchItem: "flower",
        itemFetchedText: StorySegments.Job.FoundFlower,
        itemTurnIn: StorySegments.Job.TurnInFlower,
        protagonistField: Constants.ProtagonistField.Item,
        successFunction: function (itemList) { for(var i = 0; i < itemList.length; i++) { if (itemList[i].name == this.fetchItem) { return true; } } return false; },
        reward: new Reward(Constants.RewardTypes.SkillIncrease, {skill: "fighter", modifier: 5}),
        rewardText: `#jobGiver explains this flower reminds them of the time time they spent as a soldier, but do not go into further detail. #jobGiver wants to pass on some of their sword fighting tips to #hero.`
    
    }),
    new Job({
        jobType: Constants.JobTypes.Fetch,
        fetchItem: "cabbage",
        giver: new c.SupportingCharacter({
            opinion: Constants.CharacterOpinions.Neighbor,
            description: "They are the oldest person in town and always happy to help."
        }),
        startingText: "#jobGiver's son recently left town and they need help harvesting their small plot of cabbages.",
        itemFetchedText: "#jobGiver's fields were overgrown with weeds but there are still plenty of healthy cabbages to harvest.",
        itemTurnIn: "#hero returns to #jobGiver's home with arms and bag filled with greens. #jobGiver is now able to fill the empty barrels in their home with the cabbages.",
        protagonistField: Constants.ProtagonistField.Item,
        successFunction: function (itemList) { for(var i = 0; i < itemList.length; i++) { if (itemList[i].name == this.fetchItem) { return true; } } return false; },
        reward: new Reward(Constants.RewardTypes.Item, new itemCreator.Item('Cabbage')),
        rewardText: '#jobGiver lets #hero keep the largest cabbage from the harvest as a thank you.'
    })
    
];

var WorldEvents = [
    // After 10 days, someone will come over and give the hero food.
    new Job({
        jobType: Constants.JobTypes.None,
        worldField: Constants.WorldField.Day,
        giver: new c.SupportingCharacter({
            opinion: Constants.CharacterOpinions.Friend
        }),
        assignmentText: StorySegments.Event.CharityFood,
        startingText: "#eventGiver wants to give you food. It will take them a few days to gather what they need.",
        successFunction: function (currentDay) { if (currentDay < (this.dayAssigned + 10)) { return false; } return true; },
        reward: new Reward(Constants.RewardTypes.Item, new itemCreator.Item('SampleFood')),
        rewardText: `#eventGiver finished making food and brought you some.`
    }),
    new Job({
        jobType: Constants.JobTypes.None,
        giver: new c.SupportingCharacter({
            opinion: Constants.CharacterOpinions.TownHero
        }),
        protagonistField: Constants.ProtagonistField.FighterSkill,
        assignmentText: "There is a fighter guild in the town that could help #hero become a true fighter. The guild's leader is #eventGiver.",
        trialText: "#hero will need to train more before guild master #eventGiver allows them to join.",
        successFunction: function (fighterSkill) { if (fighterSkill >= Constants.Requirements.FighterSkillJoinGuild) { return true; } return false; },
        reward: new Reward(Constants.RewardTypes.JoinGuild, {GuildName: "Fighter", "Rank": 0}),
        rewardText: '#eventGiver is impressed by how much #hero has improved their fighting skills. #eventGiver signs #hero up to be a recruit in the fighter guild in #eventGiverLocation.',
        immediateRewardText: '#eventGiver sees that #hero can already handle a sword better than most in #eventGiverLocation. #eventGiver signs #hero up to be a recruit in the fighter guild in #eventGiverLocation.'
    })
]

function getFightingJob(giver, day) {
    if (!giver) {
        var characterOptions = {
            //firstName:
            //lastName:
            //relationship:
            opinion: Constants.CharacterOpinions.Neighbor
        }
        var giver = new c.SupportingCharacter(characterOptions);
    }
    if (FightingJobs.length > 0) {
        var index = utility.getRandomInt(FightingJobs.length)-1;
        var job = FightingJobs[index];
        FightingJobs = FightingJobs.slice(0, index).concat(FightingJobs.slice(index+1));
        
        if (job.giver) {
            job.giver.location = giver.location;
        } else {
            job.giver = giver;
        }
        if (day) {
            job.dayAssigned = day;
        }
        return job;
    }

    return null;
    
}

function getEvent(giver, day) {
    if (!giver) {
        var characterOptions = {
            //firstName:
            //lastName:
            //relationship:
            opinion: Constants.CharacterOpinions.Friend
        }
        giver = new c.SupportingCharacter(characterOptions);
    }
    if (WorldEvents.length > 0) {
        var index = utility.getRandomInt(WorldEvents.length)-1;
        var event = WorldEvents[index];
        WorldEvents = WorldEvents.slice(0, index).concat(WorldEvents.slice(index+1));
        if (event.giver) {
            event.giver.location = giver.location;
        } else {
            event.giver = giver;
        }
        if (day) {
            event.dayAssigned = day;
        }

        return event;
    }
}


module.exports = {Job, Reward, getFightingJob, getEvent}