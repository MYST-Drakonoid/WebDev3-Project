import { populateFeaturedGames } from "./page-modules/featured.js";
import { initializeMyListModal } from "./page-modules/modal.js";
import { setupPaginatedGames } from "./page-modules/pagination.js";
import { attachGlobalEventListeners } from "./eventlisteners.js";
import { getAllGames, getTopFourGames } from "./page-modules/api.js";



document.addEventListener("DOMContentLoaded", async () => {
    attachGlobalEventListeners();
    initializeMyListModal("openMyListNav", "myListModal", "myListItems");

    const allGames = await getAllGames();
    const topGames = await getTopFourGames();
    const topIds = topGames.map(g => g.appid);

    await populateFeaturedGames();

    const nonFeatured = allGames.filter(g => !topIds.includes(g.appid));
    const grid = document.querySelector(".game-grid");

    setupPaginatedGames(nonFeatured, grid);
});
