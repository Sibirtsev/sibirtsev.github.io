document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("theme-toggle");
    const html = document.documentElement; 
    const chromaStyle = document.getElementById("chroma-style");

    if (localStorage.getItem("theme") === "dark") {
        html.classList.add("dark");
        chromaStyle.href = "/css/chroma-dark.css";
    } else {
        html.classList.remove("dark");
        chromaStyle.href = "/css/chroma-light.css";
    }

    toggle.addEventListener("click", function () {
        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            chromaStyle.href = "/css/chroma-light.css";
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            chromaStyle.href = "/css/chroma-dark.css";
        }
    });
});

//Javascript to toggle the menu
document.getElementById("nav-toggle").onclick = function() {
    document.getElementById("nav-content").classList.toggle("hidden");
}