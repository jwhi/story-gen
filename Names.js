/***
 * This is a selection of names from http://medieval.stormthecastle.com/medieval-names.htm
 * This list contains a few repeats and names that probably aren't accurate to the region or time period.
 * I will do a more thorough search for accurate and reader friendly names, but right now this will accomplish the task.
 * 
 * Future name system will also include nicknames for most of the names that characters can use when they are on good terms
 * with the other person.
 */
const utility = require('./utility.js');

class Names {
    constructor() {
        this.maleNames = [
            'Merek',
            'Carac',
            'Ulric',
            'Tybalt',
            'Borin',
            'Sadon',
            'Terrowin',
            'Rowan',
            'Forthwind',
            'Althalos',
            'Fendrel',
            'Brom',
            'Hadrian',
            'Walter',
            'John',
            'Oliver',
            'Walter',
            'Roger',
            'Joseph',
            'Geoffrey',
            'William',
            'Francis',
            'Simon',
            'Edmund',
            'Charles',
            'Gregory',
            'Peter',
            'Henry',
            'Frederick',
            'Walter',
            'Thomas',
            'Arthur',
            'Leofrick',
            'Lief',
            'Barda',
            'Rulf',
            'Robin',
            'Terrin',
            'Jarin',
            'Cassius',
            'Leo',
            'Cedric',
            'Gavin',
            'Peyton',
            'Josef',
            'Janshai',
            'Doran',
            'Asher',
            'Quinn',
            'Zane',
            'Xalvador',
            'Favian',
            'Destrian',
            'Dain',
            'Berinon',
            'Tristan'
        ];

        this.femaleNames = [
            'Millicent',
            'Alys',
            'Ayleth',
            'Anastas',
            'Alianor',
            'Cedany',
            'Ellyn',
            'Helewys',
            'Malkyn',
            'Peronell',
            'Thea',
            'Jacquelyn',
            'Amelia',
            'Gloriana',
            'Catherine',
            'Anne',
            'Mary',
            'Arabella',
            'Elizabeth',
            'Hildegard',
            'Brunhild',
            'Adelaide',
            'Alice',
            'Beatrix',
            'Cristiana',
            'Eleanor',
            'Emeline',
            'Isabel',
            'Juliana',
            'Margaret',
            'Matilda',
            'Mirabelle',
            'Rose',
            'Helena',
            'Guinevere',
            'Isolde',
            'Maerwynn',
            'Muriel',
            'Winifred',
            'Godiva',
            'Catrain',
            'Angmar',
            'Gussalen',
            'Jasmine',
            'Josselyn',
            'Maria',
            'Victoria',
            'Gwendolynn',
            'Enndolynn',
            'Janet',
            'Luanda',
            'Krea',
            'Rainydayas',
            'Atheena',
            'Dimia',
            'Aleida',
            'Ariana',
            'Alexia',
            'Katelyn',
            'Katrina',
            'Loreena',
            'Kaylein',
            'Seraphina',
            'Duraina',
            'Ryia',
            'Farfelee',
            'Elspeth'
        ];
    }
    getMaleName() {
        return this.maleNames[utility.getRandomInt(this.maleNames.length)-1];
    }

    getFemaleName() {
        return this.femaleNames[utility.getRandomInt(this.femaleNames.length)-1];
    }
}

module.exports = {Names};