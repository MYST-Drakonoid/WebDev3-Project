import { getGameDetails } from "./page-modules/api.js";
import { toggleMyListStatus, isInMyList } from "./page-modules/mylist.js";

// ------------------------------
// Get appid from URL
// ------------------------------
function getAppId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("appid");
}

// ------------------------------
// Render game info page
// ------------------------------
async function loadGameInfo() {
    const appid = getAppId();
    const container = document.getElementById("gameInfoContainer");

    if (!appid) {
        container.innerHTML = "<p>Error: No game selected.</p>";
        return;
    }

    const game = await getGameDetails(appid);

    if (!game) {
        container.innerHTML = "<p>Error loading game details.</p>";
        return;
    }

    // Format screenshots if available
    const screenshots = game.screenshots
        ? game.screenshots.slice(0, 4).map(s => `<img src="${s.path_thumbnail}" class="game-image" />`).join("")
        : "<p>No screenshots available.</p>";

    const inList = isInMyList(appid);

    container.innerHTML = `
        <h2>${game.name}</h2>
        <img src="${game.header_image}" class="game-image" style="height:250px; object-fit:cover;">

        <p><strong>Description:</strong> ${game.short_description}</p>
        <p><strong>Genres:</strong> ${game.genres?.map(g => g.description).join(", ") || "Unknown"}</p>
        <p><strong>Developers:</strong> ${game.developers?.join(", ")}</p>
        <p><strong>Publishers:</strong> ${game.publishers?.join(", ")}</p>

        <p><strong>Price:</strong> ${
            game.price_overview
                ? "$" + (game.price_overview.final / 100).toFixed(2)
                : "Free or unavailable"
        }</p>

        <button id="myListToggle" class="contact-submit" style="margin: 15px 0;">
            ${inList ? "Remove from My List" : "Add to My List"}
        </button>

        <h3>Screenshots</h3>
        <div class="screenshot-container">${screenshots}</div>
    `;

    // Handle add/remove from My List
    document.getElementById("myListToggle").addEventListener("click", () => {
        toggleMyListStatus({
            appid,
            title: game.name,
            image: game.header_image,
            price: game.price_overview ? game.price_overview.final / 100 : 0,
            rating: game.metacritic?.score || 0
        });

        // Re-render button text
        document.getElementById("myListToggle").textContent =
            isInMyList(appid) ? "Remove from My List" : "Add to My List";
    });
}

// ------------------------------
// Back button behavior
// ------------------------------
document.getElementById("backButton").addEventListener("click", () => {
    window.history.back();
});

// ------------------------------
document.addEventListener("DOMContentLoaded", loadGameInfo);
