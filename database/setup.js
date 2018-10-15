var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var path = require('path');

var dbPath = path.join(__dirname, 'StoryGen.db');
var db = new sqlite3.Database(dbPath);

/*
 * Setting up the tables for towns.
 * These won't be modified by the story so these only need to be run when first setting up the story.
 * Created these scripts because table layout will probably be changed frequently during development.
 * First step of setup is to drop the previous tables (if any). 
 */
db.serialize(function() {
    db.run("DROP TABLE IF EXISTS Towns;");
    db.run("DROP TABLE IF EXISTS TownTypes;")
    db.run("DROP TABLE IF EXISTS Trainers;");
    db.run("DROP TABLE IF EXISTS Skills;");
    db.run("DROP TABLE IF EXISTS Classes;");

    db.run("CREATE TABLE Towns (TownID INT NOT NULL, TownName TEXT NOT NULL, TownDescription TEXT NOT NULL, TownTypeID INT NOT NULL, PRIMARY KEY(TownID));")
    db.run("CREATE TABLE TownTypes (TownTypeID INT NOT NULL, TownTypeDescription TEXT NOT NULL, PRIMARY KEY(TownTypeID));")
    db.run("CREATE TABLE Trainers (TrainerID INT NOT NULL, TownID INT NOT NULL, SkillID INT NOT NULL, PRIMARY KEY(TrainerID));");
    db.run("CREATE TABLE Skills (SkillID INT NOT NULL, SkillName TEXT NOT NULL, ClassID INT NOT NULL, PRIMARY KEY(SkillID));");
    db.run("CREATE TABLE Classes (ClassID INT NOT NULL, ClassName TEXT NOT NULL, PreferredTownType INT NOT NULL, SecondaryTownType INT, PRIMARY KEY(ClassID));")

    /*

    Information placed into the database is from the world-info .json files.
    Each JSON file correlates to a table and each field in the JSON file correlates to a column
    in that table (an exception being the comment fields which are used for notes about specific objects)

    Notes about each table and their columns.

    TownType:
    This will be used to have different categories of towns. For example: villages, large cities, camps, stronghold, etc.
        TownTypeID: Unique identifer for each category of town. Most significant digit will be a major category (e.g. 4_ = city) and remaining digits will signify type (e.g. 41 = walled city)
        TownTypeDescription: Used as a general description that will be used in the story.

    */
    var infoPath = path.join(__dirname, '..', 'world-info')
    var TownTypesJSON = fs.readFileSync(path.join(infoPath, 'TownType.json'));
    var TownTypes = JSON.parse(TownTypesJSON);
    for (var i = 0; i < TownTypes.length; i++) {
        db.run("INSERT INTO TownTypes (TownTypeID, TownTypeDescription) VALUES ($TownTypeID, $TownTypeDescription);", {
            $TownTypeID: TownTypes[i].TownTypeID,
            $TownTypeDescription: TownTypes[i].TownTypeDescription
        });
    }
    /*
    Towns:
    This table will include all towns, cities, strongholds, etc. Any settlement of people will be organized in this table.
    Rows will be used when selected where a character begins their story and where they need to go to progress on in their tale.
        TownID: Unique identifier used as the primary key. Referenced by the Trainers table.
        TownName: Name for the town that will be used in the story.
        TownDescription: Short description of the town that can be used in the story.
        TownTypeID: The category the town belongs to based on the different categories in the TownType table.
    */
    var TownsJSON = fs.readFileSync(path.join(infoPath, 'Towns.json'));
    var Towns = JSON.parse(TownsJSON);
    for (var i = 0; i < Towns.length; i++) {
        db.run("INSERT INTO Towns (TownID, TownName, TownDescription, TownTypeID) VALUES ($TownID, $TownName, $TownDescription, $TownTypeID);", {
            $TownID: Towns[i].TownID,
            $TownName: Towns[i].TownName,
            $TownDescription: Towns[i].TownDescription,
            $TownTypeID: Towns[i].TownTypeID
        });
    }
    /*
    Trainers:
    In order to learn skills, the character will need to see a trainer. Each trainer has
    one school they teach and only reside in one town. No name since those will be story specific (at least for the time being).
        TrainerID: Unique identifer for each trainer
        TownID: The town where the trainer is located.
        SkillID: The identifer of the skill they can train the character in.
    */
    var TrainersJSON = fs.readFileSync(path.join(infoPath, 'Trainers.json'));
    var Trainers = JSON.parse(TrainersJSON);
    for (var i = 0; i < Trainers.length; i++) {
        db.run("INSERT INTO Trainers (TrainerID, TownID, SkillID) VALUES ($TrainerID, $TownID, $SkillID);", {
            $TrainerID: Trainers[i].TrainerID,
            $TownID: Trainers[i].TownID,
            $SkillID: Trainers[i].SkillID
        });
    }
    /*
    Skills:
    This table holds all the skills the protagonist can learn in their story. The skills can be learned through trainers or they
    might be able to learn them in other ways. Each skill will correspond to a class, but that doesn't mean other classes can't
    learn the skill.
        SkillID: Unique identifer for each skill.
        SkillName: The name that will appear in the story.
        ClassID: Intended class to learn this skill.
    */
    var SkillsJSON = fs.readFileSync(path.join(infoPath, 'Skills.json'));
    var Skills = JSON.parse(SkillsJSON);
    for (var i = 0; i < Skills.length; i++) {
        db.run("INSERT INTO Skills (SkillID, SkillName, ClassID) VALUES ($SkillID, $SkillName, $ClassID);", {
            $SkillID: Skills[i].SkillID,
            $SkillName: Skills[i].SkillName,
            $ClassID: Skills[i].ClassID
        });
    }
    /*
    Classes:
    The different classes the protagonist can be. This will impact the story and the towns the player will interact with.
    Preferred town types can signify a major category of town. E.g. 40 will mean that they will prefer any type of city.
    However, a 41 means they favor specifically walled cities. 0 means there have no second preference.
        ClassID: Unique identifer for each class.
        ClassName: The name of the class that will appear in the story.
        PreferredTownType: The town category this class would normally appear in. E.g. a monk would appear in a monestary village.
        SecondaryTownType: Another town category that would allow this class to exist. E.g. monks would also be a part of a cathedral city.
    */
    var ClassesJSON = fs.readFileSync(path.join(infoPath, 'Classes.json'));
    var Classes = JSON.parse(ClassesJSON);
    for (var i = 0; i < Classes.length; i++) {
        db.run("INSERT INTO Classes (ClassID, ClassName, PreferredTownType, SecondaryTownType) VALUES ($ClassID, $ClassName, $PreferredTownType, $SecondaryTownType);", {
            $ClassID: Classes[i].ClassID,
            $ClassName: Classes[i].ClassName,
            $PreferredTownType: Classes[i].PreferredTownType,
            $SecondaryTownType: (Classes[i].SecondaryTownType > 0 ? Classes[i].SecondaryTownType : "NULL")
        });
    }
});
db.close();
/*
After this is just notes about towns.

Information about Somerset from 'Anglo-Saxon Somerset'

Towns with mints:
    Axbridge, Bath, Bruton, Cadbury, Crewkerne,
    Frome, Ilchester, Langport, Milborne, Petherton,
    Taunton, Watchet

Town with 'burhs' with 'burgesses':
    Axbridge, Bath, Bruton, Ilchester, Langport,
    Milborne, Milverton, Taunton

Town with markets:
    Crewkerne, Frome

The king took geld from Bath as if it were a 20
hide estate (DB 1.31). He also received £60 in rents
and £5 from the mint and £11 from the proceeds of
‘the third penny’ (a third of the proceeds of justice).
The king had only 64 burgesses there, the abbey 24
and other lords 90. The greater part of rental income
therefore went to the church and to other non-royal
lords. Without the tax revenues the king would have
been a minority ‘shareholder’ in the borough.

*/
