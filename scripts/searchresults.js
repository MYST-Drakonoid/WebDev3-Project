// searchresults.js

import { getAllGames } from "./page-modules/api.js";
import { setupPaginatedGames } from "./page-modules/pagination.js";

// ------------------------------
// Read URL parameters
// ------------------------------
function getSearchParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        query: params.get("query")?.trim().toLowerCase() || "",
        sort: params.get("sort") || ""
    };
}

// ------------------------------
// Populate search results
// ------------------------------
async function populateSearchResults() {
    const { query, sort } = getSearchParams();
    const grid = document.querySelector(".game-grid");

    if (!grid) {
        console.error("No .game-grid element found on page.");
        return;
    }

    // Fetch all games
    const allGames = await getAllGames();

    // Filter by search text
    let results = allGames.filter(game =>
        game.title.toLowerCase().includes(query)
    );

    // Apply sorting
    if (sort === "price") {
        results.sort((a, b) => a.price - b.price);
    } else if (sort === "reviews") {
        results.sort((a, b) => b.rating - a.rating);
    }

    // If nothing found
    if (results.length === 0) {
        grid.innerHTML = `
            <p style="text-align:center; font-size:1.3rem; padding:20px;">
                No results found for "<strong>${query}</strong>"
            </p>
        `;
        return;
    }

    // Display results with pagination
    setupPaginatedGames(results, grid);
}

// ------------------------------
// Initialize on page load
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    populateSearchResults();
});
