export function showToast(msg) {
    const div = document.createElement("div");
    div.className = "toast";
    div.textContent = msg;
    document.getElementById("toast-container").appendChild(div);

    setTimeout(() => div.classList.add("show"), 10);

    setTimeout(() => {
        div.classList.remove("show");
        setTimeout(() => div.remove(), 300);
    }, 2000);
}

export function getURLParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}
