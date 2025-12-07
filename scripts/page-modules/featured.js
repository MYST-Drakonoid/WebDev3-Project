import { getTopFourGames } from "./api.js";
import { createGameCard } from "./cards.js";


export async function populateFeaturedGames() {
    const featuredGrid = document.querySelector(".game-grid-featured");
    if (!featuredGrid) return;

    featuredGrid.innerHTML = "";

    const games = await getTopFourGames();

    games.forEach(game => {
        const card = createGameCard({
            image: game.header_image,
            title: game.name,
            description: game.short_description || "No description available.",
            rating: game.review_score || Math.floor(Math.random() * 10),
            price: game.final_price ? game.final_price / 100 : Math.random() * 60,
        });

        featuredGrid.appendChild(card);
    });
}
