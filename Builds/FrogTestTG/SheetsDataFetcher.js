var sheetsDataFetcher = {};

/** Google Sheets parameters */
sheetsDataFetcher.sheet_id = '1QuXgLlg2RHdG7eQwrhzXmv5o1EtMS5-74Mfl5rO00S8';
sheetsDataFetcher.sheet_gids = ['1817276773'];

/** Utility */
sheetsDataFetcher.loadedSheets = null;
sheetsDataFetcher.loadedSheetsPromise = null;
sheetsDataFetcher.sheet_urls = sheetsDataFetcher.sheet_gids
    .map(gid => 'https://docs.google.com/spreadsheets/d/'+sheetsDataFetcher.sheet_id+'/gviz/tq?tqx=out:json&tq&gid='+gid);

sheetsDataFetcher.hello = async function() {
  console.log("[SheetsDataFetcher] Hello, World!");
};

sheetsDataFetcher.loadSheets = async function() {
  if (sheetsDataFetcher.loadedSheetsPromise) {
    return sheetsDataFetcher.loadedSheetsPromise;
  }

  try {
    sheetsDataFetcher.loadedSheetsPromise = Promise.all(
      sheetsDataFetcher.sheet_urls.map(async (url) => {
        const response = await fetch(url);
        const data = await response.text();
        const jsonString = data.substring(47).slice(0, -2);
        console.log('Loaded ', jsonString);
        return JSON.parse(jsonString);
      })
    );
    sheetsDataFetcher.loadedSheets = await sheetsDataFetcher.loadedSheetsPromise;
    sheetsDataFetcher.loadedSheetsPromise = null;
    return sheetsDataFetcher.loadedSheets;
  } catch (reason) {
    console.error('[SheetsDataFetcher] Failed to fetch google sheet data:\n' + reason);
    sheetsDataFetcher.loadedSheetsPromise = null;
    throw reason;
  }
};

sheetsDataFetcher.getLoadedSheets = function() {
  return sheetsDataFetcher.loadedSheets;
};

