import { showToast } from "./utils.js";

export function updateButtonText(button, appid) {
    const list = JSON.parse(localStorage.getItem("myList")) || [];
    const exists = list.some(x => x.appid === appid);
    button.textContent = exists ? "Remove from My List" : "Add to My List";
}

export function toggleMyList(game, button) {
    let list = JSON.parse(localStorage.getItem("myList")) || [];
    const index = list.findIndex(x => x.appid === game.appid);

    if (index === -1) {
        list.push(game);
        showToast(`${game.title} added!`);
    } else {
        list.splice(index, 1);
        showToast(`${game.title} removed.`);
    }

    localStorage.setItem("myList", JSON.stringify(list));
    updateButtonText(button, game.appid);
}
