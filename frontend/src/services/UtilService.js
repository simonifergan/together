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
    generateId,
    getRandomPastel,
    worldCodeMap
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
 }


 function getPastelPalette() {
    return ['#f78882','#fff06f', '#d2fc8d', '#caf2f9', '#a9cffb','#d5b3fc', '#fed1e9', '#eac8a8'];
    // return ['#fff','#f98a8d','#fdcc87', '#fffd7f', '#c9ff9b', '#a5ffef', '#89dcfc', '#88b9fd', '#debbfe', '#dddddd'];
}

function getRandomPastel() {
    return getPastelPalette()[getRandomIntInclusive(0,7)];
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}