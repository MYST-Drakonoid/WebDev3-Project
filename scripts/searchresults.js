import { setupPaginatedGames } from "./modules/pagination.js";
import { api_getAllGames } from "./modules/api.js";
import { getURLParam } from "./modules/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const query = getURLParam("q")?.toLowerCase() || "";
    const allGames = await api_getAllGames();

    const filtered = allGames.filter(g => g.title.toLowerCase().includes(query));

    const container = document.querySelector(".game-grid");
    setupPaginatedGames(filtered, container);
});
