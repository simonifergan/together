function getFromLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}

function saveToLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function removeFromLocal(key) {
    localStorage.removeItem(key);
}

export default {
    getFromLocal,
    saveToLocal,
    removeFromLocal
}