const API_BASE = "https://your-render-backend.onrender.com/steam";

export async function getAllGames() {
    const res = await fetch(`${API_BASE}/apps`);
    const data = await res.json();

    const games = data.applist.apps;

    return games.map(g => ({
        title: g.name,
        description: "No description yet.",
        image: `https://steamcdn-a.akamaihd.net/steam/apps/${g.appid}/header.jpg`,
        rating: Math.floor(Math.random() * 10),
        price: Math.random() * 60,
        appid: g.appid
    }));
}

export async function getTopFourGames() {
    const res = await fetch(`${API_BASE}/featured`);
    const data = await res.json();

    return data.featured_win.slice(0, 4).map(g => ({
        title: g.name,
        description: g.short_description,
        image: g.header_image,
        rating: g.review_score,
        price: g.final_price ? g.final_price / 100 : 0,
        appid: g.id
    }));
}
