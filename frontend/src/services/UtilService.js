import worldApi from '../data/world.json';

export default {
    generateId
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
 }