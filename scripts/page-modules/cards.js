import { toggleMyList, updateButtonText } from "./mylist.js";
import { getMetacritic, getPrice, getDescription } from "./api.js";

export async function createGameCard(game) {
    const { image, title, appid } = game;

    const price = await getPrice(appid);
    const desc = await getDescription(appid);
    const rating = await getMetacritic(appid);


    const card = document.createElement("div");
    card.classList.add("game-card");
    card.dataset.price = price;
    card.dataset.rating = rating;
    card.dataset.appid = appid;

    card.innerHTML = `
        <img src="${image}" alt="${title}" class="game-image" />
        <div class="game-info">
            <h2 class="game-title">${title}</h3>
            <p class="game-description">${desc}</p>
            <p class="game-rating">Rating: ${rating ?? "N/A"}</p>
            <p class="game-price">Price: ${price ?? "Unknown"}</p>
            <button class="list-toggle-button"></button>
        </div>
    `;

    const btn = card.querySelector(".list-toggle-button");
    updateButtonText(btn, appid);

    btn.addEventListener("click", () => toggleMyList(game, btn));

    return card;
}
