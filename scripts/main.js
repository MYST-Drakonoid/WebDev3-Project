// main.js

// -----------------------------
// Global variables
// -----------------------------
window.currentCardLimit = 15; // controls how many game cards are displayed at once

// -----------------------------
// Create a dynamic game card
// -----------------------------
export function createGameCard({ image, title, description, rating, price, appid }) {
    const card = document.createElement("div");
    card.classList.add("game-card");

    // Store values for sorting/filtering
    card.dataset.price = price || 0;
    card.dataset.rating = rating || 0;
    card.dataset.appid = appid || null;

    // Card inner HTML
    card.innerHTML = `
        <img src="${image}" alt="${title}" class="game-image" />
        <div class="game-info">
            <h3 class="game-title">${title}</h3>
            <p class="game-description">${description}</p>
            <p class="game-rating">Rating: ${rating || "N/A"}</p>
            <p class="game-price">Price: $${price ? price.toFixed(2) : "—"}</p>
            <button class="list-toggle-button"></button>
        </div>
    `;

    const button = card.querySelector(".list-toggle-button");

    // Initialize button text based on localStorage
    updateButtonText(button, appid);

    // Button click toggles add/remove from My List
    button.addEventListener("click", () => toggleMyList({ image, title, description, rating, price, appid }, button));

    return card;
}

// -----------------------------
// Update button text depending on localStorage
// -----------------------------
function updateButtonText(button, appid) {
    const myList = JSON.parse(localStorage.getItem("myList")) || [];
    const inList = myList.some(item => item.appid === appid);

    button.textContent = inList ? "Remove from My List" : "Add to My List";
}

// -----------------------------
// Toggle game in My List (localStorage)
// -----------------------------
function toggleMyList(game, button) {
    const myList = JSON.parse(localStorage.getItem("myList")) || [];
    const index = myList.findIndex(item => item.appid === game.appid);

    if (index === -1) {
        myList.push(game);
        localStorage.setItem("myList", JSON.stringify(myList));
        showToast(`${game.title} added to My List!`);
    } else {
        myList.splice(index, 1);
        localStorage.setItem("myList", JSON.stringify(myList));
        showToast(`${game.title} removed from My List!`);
    }

    updateButtonText(button, game.appid);
}

// -----------------------------
// Show toast notifications
// -----------------------------
function showToast(message, duration = 2000) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// -----------------------------
// Limit visible cards based on currentCardLimit
// -----------------------------
export function updateDisplayedGames() {
    const gameGrid = document.querySelector(".game-grid");
    if (!gameGrid) return;

    const allCards = Array.from(gameGrid.children);
    allCards.forEach((card, index) => {
        card.style.display = index < window.currentCardLimit ? "block" : "none";
    });
}

// -----------------------------
// Filter inappropriate games
// -----------------------------
export function isInappropriateGame(game) {
    const inappropriateKeywords = [
        'waifu','hentai','lewd','slut','xxx','adult','nsfw','sexy','harem','ecchi',
        'oppai','nude','erotic','18+','porn','sex','strip','dating sim','visual novel','king'
    ];
    const gameName = game.name.toLowerCase();
    return inappropriateKeywords.some(keyword => gameName.includes(keyword));
}

// -----------------------------
// Fetch Steam splash image
// -----------------------------
export async function getSplashImage(appId) {
    const proxyURL = 'https://corsproxy.io/?';
    const apiURL = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

    const res = await fetch(proxyURL + encodeURIComponent(apiURL));
    const data = await res.json();
    return data[appId].data?.header_image || null;
}

// -----------------------------
// Get random game from Steam
// -----------------------------
export async function getRandomGame() {
    const proxyURL = 'https://corsproxy.io/?';
    const apiURL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';

    const response = await fetch(proxyURL + encodeURIComponent(apiURL));
    const data = await response.json();

    const apps = data.applist.apps;
    return apps[Math.floor(Math.random() * apps.length)];
}

// -----------------------------
// Get top featured games
// -----------------------------
export async function getTopFourGames() {
    const proxyURL = 'https://corsproxy.io/?';
    const apiURL = 'https://store.steampowered.com/api/featured/';

    const res = await fetch(proxyURL + encodeURIComponent(apiURL));
    const data = await res.json();

    const filteredGames = data.featured_win.filter(game => !isInappropriateGame(game));
    return filteredGames.slice(0, 4);
}

export async function getAllGames() {
    try {
        const proxyURL = 'https://corsproxy.io/?';
        const apiURL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
        const res = await fetch(proxyURL + encodeURIComponent(apiURL));
        const data = await res.json();
        let games = data.applist.apps;

        // Filter out inappropriate games
        games = games.filter(game => !isInappropriateGame(game));

        // Map to your standardized object shape
        return games.map(game => ({
            title: game.name,
            description: game.short_description || "No description available.",
            image: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`,
            rating: Math.floor(Math.random() * 10), // placeholder if no rating
            price: Math.random() * 60, // placeholder if no price
            appid: game.appid
        }));
    } catch (err) {
        console.error("Error fetching all games:", err);
        return [];
    }
}

// -----------------------------
// Populate Featured Games section
// -----------------------------
export async function populateFeaturedGames() {
    const featuredGrid = document.querySelector('.game-grid-featured');
    if (!featuredGrid) return;

    featuredGrid.innerHTML = ''; // Clear grid first

    try {
        const games = await getTopFourGames();

        games.forEach(game => {
            const card = createGameCard({
                image: game.header_image,
                title: game.name,
                description: game.short_description || "No description available.",
                rating: game.review_score || Math.floor(Math.random() * 10),
                price: game.final_price ? game.final_price / 100 : Math.random() * 60,
            });

            featuredGrid.appendChild(card);
            setTimeout(() => card.classList.add("visible"), 50);
        });
    } catch (error) {
        console.error("Error loading featured games:", error);
    }
}

// -----------------------------
// Initialize My List Modal
// -----------------------------
export function initializeMyListModal(openButtonId, modalId, listContainerId) {
    const myListModal = document.getElementById(modalId);
    const openMyListBtn = document.getElementById(openButtonId);
    const closeBtn = myListModal.querySelector(".close-button");
    const myListContainer = document.getElementById(listContainerId);

    // Open modal and populate content
    openMyListBtn.addEventListener("click", () => {
        populateMyList();
        myListModal.style.display = "block";
    });

    // Close modal when clicking X
    closeBtn.addEventListener("click", () => {
        myListModal.style.display = "none";
    });

    // Close modal when clicking outside content
    window.addEventListener("click", (e) => {
        if (e.target === myListModal) myListModal.style.display = "none";
    });

    // Populate modal with My List games
    function populateMyList() {
        const myList = JSON.parse(localStorage.getItem("myList")) || [];
        myListContainer.innerHTML = '';

        if (myList.length === 0) {
            myListContainer.innerHTML = '<p>No games in your list yet!</p>';
            return;
        }

        myList.forEach(game => {
            const card = document.createElement("div");
            card.classList.add("game-card");
            card.innerHTML = `
                <img src="${game.image}" alt="${game.title}" class="game-image"/>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-price">Price: $${game.price.toFixed(2)}</p>
                    <button class="mylist-button">Remove from My List</button>
                </div>
            `;

            card.querySelector(".mylist-button").addEventListener("click", () => {
                removeFromMyList(game.appid);
                populateMyList();
            });

            myListContainer.appendChild(card);
        });
    }

    // Remove a game from localStorage
    function removeFromMyList(appid) {
        let myList = JSON.parse(localStorage.getItem("myList")) || [];
        myList = myList.filter(game => game.appid !== appid);
        localStorage.setItem("myList", JSON.stringify(myList));
        showToast("Removed from My List");
    }

    // Show toast
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 10);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// -----------------------------
// Initialize on DOMContentLoaded
// -----------------------------
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1️⃣ Populate featured games
        await populateFeaturedGames();

        // 2️⃣ Initialize My List modal
        initializeMyListModal("openMyListNav", "myListModal", "myListItems");

        // 3️⃣ Get all games and top featured games
        const allGames = await getAllGames();
        const topGames = await getTopFourGames();
        const topAppIds = topGames.map(g => g.appid);

        // 4️⃣ Filter out top featured games
        const nonFeaturedGames = allGames.filter(g => !topAppIds.includes(g.appid));

        // 5️⃣ Setup paginated display for all non-featured games
        const container = document.querySelector(".game-grid");
        setupPaginatedGames(nonFeaturedGames, container);

        // 6️⃣ Setup search functionality
        const searchForm = document.getElementById("searchForm");
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = document.getElementById("searchBar").value.toLowerCase();

            const filtered = nonFeaturedGames.filter(game =>
                game.title.toLowerCase().includes(query)
            );

            // Re-render paginated games with search results
            setupPaginatedGames(filtered, container);
        });

        // 7️⃣ Optional: handle mobile dropdown for My List
        const dropdown = document.querySelector(".menu-dropdown");
        if (dropdown) {
            dropdown.addEventListener("change", (e) => {
                if (e.target.value === "mylist") {
                    e.preventDefault();
                    document.getElementById("openMyListNav").click();
                    dropdown.value = "#"; // reset
                }
            });
        }

    } catch (error) {
        console.error("Error initializing page:", error);
    }
});

/**
 * Paginate and render a list of games
 * @param {Array} games - Array of game objects
 * @param {HTMLElement} container - Container to render game cards
 * @param {number} initialCardsPerPage - How many cards to show per page initially
 */
export function setupPaginatedGames(games, container, initialCardsPerPage = 15) {
    let currentPage = 1;
    let cardsPerPage = initialCardsPerPage;

    // Create pagination controls
    const controls = document.createElement("div");
    controls.className = "pagination-controls";
    controls.innerHTML = `
        <button id="prevPage" disabled>Previous</button>
        <span id="pageInfo">Page 1</span>
        <button id="nextPage">Next</button>
    `;
    container.parentNode.insertBefore(controls, container.nextSibling);

    const prevBtn = controls.querySelector("#prevPage");
    const nextBtn = controls.querySelector("#nextPage");
    const pageInfo = controls.querySelector("#pageInfo");

    // Render the current page
    function renderPage() {
        container.innerHTML = "";
        const start = (currentPage - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        const gamesToShow = games.slice(start, end);

        gamesToShow.forEach(game => {
            const card = createGameCard({
                image: game.image,
                title: game.title,
                description: game.description,
                rating: game.rating,
                price: game.price,
                appid: game.appid
            });
            container.appendChild(card);
        });

        const totalPages = Math.ceil(games.length / cardsPerPage);
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Event listeners
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(games.length / cardsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });

    // Cards per page selector (if exists)
    const radios = document.querySelectorAll('input[name="cardsCount"]');
    radios.forEach(radio => {
        radio.addEventListener("change", e => {
            cardsPerPage = parseInt(e.target.value);
            currentPage = 1;
            renderPage();
        });
    });

    // Initial render
    renderPage();
    return { renderPage };
}
