function getFromStorageOrDefault(name, defaultValue) {
  if (localStorage.getItem(name)) {
    return JSON.parse(localStorage.getItem(name));
  }
  localStorage.setItem(name, defaultValue)
  return defaultValue;
}

function writeToStorage(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

function removeFromStorage(name) {
  localStorage.removeItem(name);
}

export { getFromStorageOrDefault, writeToStorage, removeFromStorage };
