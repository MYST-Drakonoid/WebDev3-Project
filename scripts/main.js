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


// I am getting rid of inappropriate games from the list with the function below. If you find more keywords please add them to the array. Some of these might seem weird, but edit at your own risk. Still need to add descriptions.
function isInappropriateGame(game) {
    const inappropriateKeywords = ['waifu', 'hentai', 'lewd', 'slut', 'xxx', 'adult', 'nsfw',
        'sexy', 'harem', 'ecchi', 'oppai', 'nude', 'erotic', '18+',
        'porn', 'sex', 'strip', 'dating sim', 'visual novel', 'king'];

    const gameName = game.name.toLowerCase();

    return inappropriateKeywords.some(keyword => gameName.includes(keyword));
}

// Everything above is great for what we have planned, but below I have how to get the featured games
async function getTopFourGames() {
    const proxyURL = 'https://corsproxy.io/?';
    const apiURL = 'https://store.steampowered.com/api/featured/';
    const res = await fetch(proxyURL + encodeURIComponent(apiURL));
    const data = await res.json();

    //added the filter here
    const filteredGames = data.featured_win.filter(game => !isInappropriateGame(game));

    return filteredGames.slice(0,4);
}

// Next is to populate the cards with what we got from getTopFourGames
function populateGameCards(games) {
    const gameCards = document.querySelectorAll('.game-card');

    games.forEach((game, index) => {
        if (index < gameCards.length) {
            const card = gameCards[index];
            const img = card.querySelector('.game-image');
            img.src = game.header_image;
            img.alt = game.name;
            const title = card.querySelector('.game-title');
            title.textContent = game.name;
            const description = card.querySelector('.game-description');
            const rating = card.querySelector('.game-rating');
            rating.textContent = 'Featured Game';
        }
    });
}

// This will load the feadured games
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Getting top four games...');
        const games = await getTopFourGames();
        console.log('Top four games aquired:', games);
        populateGameCards(games);
    } catch (error) {
        console.error('Error loading featured games:', error);
    }
});