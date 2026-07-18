var playerDataFetcher = {};

/** Request parameters */
playerDataFetcher.serverUrl = "http://188.225.57.219:5000"
playerDataFetcher.loadPlayerDataUri = "/status/"
playerDataFetcher.playerId = 167002776; // TODO: Get if from TG. If TG instance exists, then wait for it to give a user ID before initializing Unity game.

/** Utility */
playerDataFetcher.loadedPlayerData = null;
playerDataFetcher.loadedPlayerDataPromise = null;
playerDataFetcher.loadPlayerDataUrl = playerDataFetcher.serverUrl + playerDataFetcher.loadPlayerDataUri + playerDataFetcher.playerId;

playerDataFetcher.getPlayerId = function() {
  return playerDataFetcher.playerId;
}

playerDataFetcher.loadPlayerData = async function() {
  if (playerDataFetcher.loadedPlayerDataPromise) {
    return playerDataFetcher.loadedPlayerDataPromise;
  }

  try {
    const response = await fetch(playerDataFetcher.loadPlayerDataUrl);
    const data = await response.text();
    console.log('Loaded ', data);
    return JSON.parse(data);
  } catch (reason) {
    console.error('[playerDataFetcher] Failed to fetch player data:\n' + reason);
    playerDataFetcher.loadedPlayerDataPromise = null;
    throw reason;
  }
};

playerDataFetcher.getLoadedSheets = function() {
  return playerDataFetcher.loadedPlayerData;
};

