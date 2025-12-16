const cache = new Map();

function isCached(url) {
  return cache.has(url);
}

function getFromCache(url) {
  return cache.get(url);
}

function addToCache(url, data) {
  return cache.set(url, data);
}

function removeFromCache(url) {
  return cache.delete(url);
}

module.exports = {
  isCached,
  getFromCache,
  addToCache,
  removeFromCache,
};
