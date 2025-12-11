import { isInappropriateGame } from "./filters.js";



const backend = "https://webdev3-project.onrender.com";
const proxy = "https://corsproxy.io/?";

export async function getAllGames() {
    const res = await fetch("info.json");
    const data = await res.json();

    return data.response.apps.map(app => ({
        title: app.name,
        appid: app.appid,
        description: "No description yet.",
        image: `https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`,
        rating: Math.floor(Math.random() * 10),
        price: Math.random() * 60
    }));
}


export async function getTopFourGames() {
    const url = "https://store.steampowered.com/api/featured/";
    const res = await fetch(proxy + encodeURIComponent(url));
    const data = await res.json();

    const filtered = data.featured_win.filter(
        g => g.name && !isInappropriateGame(g)
    );

    return filtered.slice(0, 4).map(g => ({
        title: g.name,
        description: g.short_description,
        image: g.header_image,
        rating: g.review_score,
        price: g.final_price ? g.final_price / 100 : 0,
        appid: g.id
    }));
}


export async function getDescription(appid) {
    const realURL = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    const res = await fetch(proxy + encodeURIComponent(realURL));
    const json = await res.json();

    const data = json[appid]?.data;
    if (!data) return "No description";

    return data.short_description ||
           data.detailed_description ||
           "No description";
}


export async function getPrice(appid) {
    const realURL = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    const res = await fetch(proxy + encodeURIComponent(realURL));
    const json = await res.json();

    const data = json[appid]?.data;
    if (!data) return "Unknown";

    return data.price_overview
        ? data.price_overview.final_formatted
        : "Unknown";
}


export async function getMetacritic(appid) {
    const realURL = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    const res = await fetch(proxy + encodeURIComponent(realURL));
    const json = await res.json();

    const data = json[appid]?.data;
    if (!data) return null;

    return data.metacritic
        ? data.metacritic.score
        : null;
}
