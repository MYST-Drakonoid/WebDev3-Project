export function attachGlobalEventListeners() {
    const searchForm = document.getElementById("searchForm");

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = document.getElementById("searchBar").value;
            window.location.href = `searchresults.html?q=${encodeURIComponent(text)}`;
        });
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thank you! Your message has been received.");
            contactForm.reset();
        });
    }
}
