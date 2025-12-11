import { createGameCard } from "./cards.js";

export function setupPaginatedGames(games, container, perPage = 15) {
    let page = 1;

    async function render() {
        container.innerHTML = "";
        const start = (page - 1) * perPage;
        const end = start + perPage;

        for (const g of games.slice(start, end)) {
            const card = await createGameCard(g);  
            container.appendChild(card);
        }
    }

    
    render();

    return { render };
}
