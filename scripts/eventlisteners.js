// eventlisteners.js
import { createGameCard, updateDisplayedGames } from './main.js';

/* -----------------------------------------------------------
   Get search parameters from URL
----------------------------------------------------------- */
export function getSearchParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        query: params.get('query') || '',
        sort: params.get('sort') || ''
    };
}

/* -----------------------------------------------------------
   Fetch all games (replace with API or JSON as needed)
----------------------------------------------------------- */
export async function getAllGames() {
    // Example with local JSON file
    // Make sure you have a games.json in your project with a "games" array
    try {
        const res = await fetch('games.json');
        const data = await res.json();
        return data.games || [];
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
}

/* -----------------------------------------------------------
   Populate the search results page
----------------------------------------------------------- */
export async function populateSearchResults() {
    const { query, sort } = getSearchParams();
    if (!query) return;

    const allGames = await getAllGames();

    // Filter based on search query
    let results = allGames.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase())
    );

    // Sort results if needed
    if (sort === "price") {
        results.sort((a,b) => a.price - b.price);
    } else if (sort === "reviews") {
        results.sort((a,b) => b.rating - a.rating);
    }

    // Insert into game grid
    const grid = document.querySelector(".game-grid");
    grid.innerHTML = '';
    results.forEach(game => {
        const card = createGameCard(game);
        grid.appendChild(card);
    });

    // Apply initial card limit display
    updateDisplayedGames();
}

/* -----------------------------------------------------------
   Listen for "Cards per Page" changes
----------------------------------------------------------- */
export function watchCardsPerPage() {
    const radioButtons = document.querySelectorAll('input[name="cardsCount"]');
    radioButtons.forEach(radio => {
        radio.addEventListener("change", (e) => {
            window.currentCardLimit = parseInt(e.target.value); // global for updateDisplayedGames
            updateDisplayedGames();
        });
    });
}

/* -----------------------------------------------------------
   Initialize event listeners for search page
----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
    await populateSearchResults();
    watchCardsPerPage();
});
