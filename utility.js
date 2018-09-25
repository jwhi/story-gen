function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}

function rollDice(numberOfDice, modifier) {
    if (!numberOfDice || numberOfDice == 1) {
        return getRandomInt(6) + ((modifier) ? modifier : 0)
    }
    else if (numberOfDice > 1) {
        return getRandomInt(6) + rollDice(numberOfDice-1, modifier);
    }
    else {
        return 0;
    }
}

module.exports = {rollDice}