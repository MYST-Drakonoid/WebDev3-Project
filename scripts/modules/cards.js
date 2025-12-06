import { toggleMyList, updateButtonText } from "./mylist.js";

export function createGameCard(game) {
    const { image, title, description, rating, price, appid } = game;

    const card = document.createElement("div");
    card.classList.add("game-card");
    card.dataset.price = price;
    card.dataset.rating = rating;
    card.dataset.appid = appid;

    card.innerHTML = `
        <img src="${image}" alt="${title}" class="game-image" />
        <div class="game-info">
            <h3 class="game-title">${title}</h3>
            <p class="game-description">${description}</p>
            <p class="game-rating">Rating: ${rating}</p>
            <p class="game-price">Price: $${price.toFixed(2)}</p>
            <button class="list-toggle-button"></button>
        </div>
    `;

    const btn = card.querySelector(".list-toggle-button");
    updateButtonText(btn, appid);

    btn.addEventListener("click", () => toggleMyList(game, btn));

    return card;
}
