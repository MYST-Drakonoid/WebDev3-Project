import { populateFeaturedGames } from "./modules/api.js";
import { initializeMyListModal } from "./modules/modal.js";
import { setupPaginatedGames } from ".cards.js";
import { attachGlobalEventListeners } from "./eventlisteners.js";

document.addEventListener("DOMContentLoaded", async () => {
    attachGlobalEventListeners();
    initializeMyListModal("openMyListNav", "myListModal", "myListItems");

    const allGames = await window.api_getAllGames();
    const topGames = await window.api_getTopFourGames();
    const topIds = topGames.map(g => g.appid);

    await populateFeaturedGames();

    const nonFeatured = allGames.filter(g => !topIds.includes(g.appid));
    const grid = document.querySelector(".game-grid");

    setupPaginatedGames(nonFeatured, grid);
});
