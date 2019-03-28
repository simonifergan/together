import worldDb from '../data/world.json'

const worldCodeMap = new Map();
(function() {
    worldDb.forEach(country => {
        let key = country.alpha2Code;
        let value = country.name;
        worldCodeMap.set(key, value);
    })
})();

export default {
    worldCodeMap,
    generateId,
    getRandomPastel,
    getMonthName
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function getRandomPastel() {
    return _getPastelPalette()[_getRandomIntInclusive(0,7)];
}

function getMonthName(monthNum) {
    let monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthsName[monthNum - 1];
}

function _getPastelPalette() {
    return ['#f78882','#fff06f', '#d2fc8d', '#caf2f9', '#a9cffb','#d5b3fc', '#fed1e9', '#eac8a8'];
}

function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}