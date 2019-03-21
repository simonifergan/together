export default {
    makeId
}

function makeId() {
    return '_' + Math.random().toString(36).substr(2, 9);
 }