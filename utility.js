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

function rollNSidedDice(n, numberOfDice) {
    if (!numberOfDice || numberOfDice == 1) {
        return getRandomInt(n); 
    } else {
        return rollNSidedDice(n, numberOfDice - 1)
    }
}

module.exports = {rollDice, rollNSidedDice, getRandomInt}