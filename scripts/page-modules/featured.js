import { getTopFourGames } from "./api.js";
import { createGameCard } from "./cards.js";

export async function populateFeaturedGames() {
    const featuredGrid = document.querySelector(".game-grid-featured");
    if (!featuredGrid) return;

    featuredGrid.innerHTML = "";

    const games = await getTopFourGames();

    games.forEach(g => {
        const card = createGameCard({
            image: g.image,
            title: g.title,
            description: g.description || "No description available.",
            rating: g.rating,
            price: g.price,
            appid: g.appid
        });

        featuredGrid.appendChild(card);
    });
}
