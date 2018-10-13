/*
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

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('StoryGen.db');

/*
 * Setting up the tables for towns.
 * These won't be modified by the story so these only need to be run when first setting up the story.
 * Created these scripts because table layout will probably be changed frequently during development.
 * First step of setup is to drop the previous tables (if any). 
 */
db.serialize(function() {
    db.run("DROP TABLE IF EXISTS Towns;");
    db.run("DROP TABLE IF EXISTS Trainers;");
    db.run("DROP TABLE IF EXISTS Skills;");
    db.run("DROP TABLE IF EXISTS Classes;");

    db.run("CREATE TABLE Towns (TownID INT NOT NULL, TownName TEXT NOT NULL, PRIMARY KEY(TownID));")
    db.run("CREATE TABLE Trainers (TrainerID INT NOT NULL, TownID INT NOT NULL, SkillID INT NOT NULL, PRIMARY KEY(TrainerID));");
    db.run("CREATE TABLE Skills (SkillID INT NOT NULL, SkillName TEXT NOT NULL, ClassID INT NOT NULL, PRIMARY KEY(SkillID));");
    db.run("CREATE TABLE Classes (ClassID INT NOT NULL, ClassName TEXT NOT NULL, PRIMARY KEY(ClassID));")
});
db.close();
    /*

    db.serialize(function() {
  db.run("CREATE TABLE user (id INT, dt TEXT)");

  var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
  for (var i = 0; i < 10; i++) {
  
  var d = new Date();
  var n = d.toLocaleTimeString();
  stmt.run(i, n);
  }
  stmt.finalize();

  db.each("SELECT id, dt FROM user", function(err, row) {
      console.log("User id : "+row.id, row.dt);
  });
});

db.close();
*/