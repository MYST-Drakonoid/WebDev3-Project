import { isInappropriateGame } from "./filters";


const backend = "https://YOUR-BACKEND-SERVICE.onrender.com";

export async function getAllGames() {
    const res = await fetch(`${backend}/steam/apps`);
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
