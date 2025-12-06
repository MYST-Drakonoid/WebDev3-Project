import { isInappropriateGame } from "./filters.js";

const proxy = "https://corsproxy.io/?";

export async function api_getAllGames() {
    try {
        const link = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";
        const res = await fetch(proxy + encodeURIComponent(link));
        const data = await res.json();

        let games = data.applist.apps.filter(g => !isInappropriateGame(g));

        return games.map(g => ({
            title: g.name,
            description: "No description available.",
            image: `https://steamcdn-a.akamaihd.net/steam/apps/${g.appid}/header.jpg`,
            rating: Math.floor(Math.random() * 10),
            price: Math.random() * 60,
            appid: g.appid
        }));
    } catch (err) {
        console.error("API error:", err);
        return [];
    }
}

export async function api_getTopFourGames() {
    const url = "https://store.steampowered.com/api/featured/";
    const res = await fetch(proxy + encodeURIComponent(url));
    const data = await res.json();

    const filtered = data.featured_win.filter(g => !isInappropriateGame(g));

    return filtered.slice(0, 4).map(g => ({
        title: g.name,
        description: g.short_description,
        image: g.header_image,
        rating: g.review_score,
        price: g.final_price ? g.final_price / 100 : 0,
        appid: g.id
    }));
}
