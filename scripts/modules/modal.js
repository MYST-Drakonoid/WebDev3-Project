import { updateButtonText } from "./mylist.js";

export function initializeMyListModal(openBtnId, modalId, listContainerId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector(".close-button");
    const container = document.getElementById(listContainerId);

    openBtn.addEventListener("click", () => {
        populate();
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none";
    });

    function populate() {
        const list = JSON.parse(localStorage.getItem("myList")) || [];
        container.innerHTML = "";

        if (list.length === 0) {
            container.innerHTML = "<p>No games saved.</p>";
            return;
        }

        list.forEach(game => {
            const div = document.createElement("div");
            div.classList.add("game-card");
            div.innerHTML = `
                <img src="${game.image}" />
                <h3>${game.title}</h3>
            `;
            container.appendChild(div);
        });
    }
}
