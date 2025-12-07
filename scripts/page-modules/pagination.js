import { createGameCard } from "./cards.js";

export function setupPaginatedGames(games, container, perPage = 15) {
    let page = 1;

    function render() {
        container.innerHTML = "";
        const start = (page - 1) * perPage;
        const end = start + perPage;

        games.slice(start, end).forEach(g => {
            container.appendChild(createGameCard(g));
        });
    }

    render();
    return { render };
}
