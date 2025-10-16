async function getSplashImage(appId) {
    const proxyURL = 'https://corsproxy.io/?';
    const apiURL = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    const res = await fetch(proxyURL + encodeURIComponent(apiURL));
    const data = await res.json();
 
    return data[appId].data?.header_image || null;
}

async function getAppId(gameName) {
    const proxyURL = 'https://corsproxy.io/?';
    const apiURL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    const response = await fetch(proxyURL + encodeURIComponent(apiURL));
    const data = await response.json();

    return data.applist.apps.find(app => app.name.toLowerCase() === gameName.toLowerCase())?.appid || null;
}

async function getRandomGame() {
    const proxyURL = 'https://corsproxy.io/?';
    const apiURL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    const response = await fetch(proxyURL + encodeURIComponent(apiURL));
    const data = await response.json();
    console.log(data);
    const apps = data.applist.apps;
    const randomGame = apps[Math.floor(Math.random() * apps.length)];
    return randomGame;
}

function generateRandom7Digit() {
    return Math.floor(Math.random() * 9000000) + 1000000;
}

console.log(generateRandom7Digit());

// Use getRandomGame (with proxy) instead of separate calls
getRandomGame()
    .then(game => {
        console.log(`Random game: ${game.name} (App Id: ${game.appid})`);
        return getSplashImage(game.appid);
    })
    .then(imageUrl => {
        console.log('Splash image URL:', imageUrl);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Test getting a specific game
getAppId("Portal 2")
    .then(appId => {
        console.log('Portal 2 App ID:', appId);
    })
    .catch(error => {
        console.error('Error:', error);
    });