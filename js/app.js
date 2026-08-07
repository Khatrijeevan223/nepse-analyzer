"use strict";

const themeButton = document.querySelector(".mode");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeButton.textContent = "Light Mode";
    themeButton.setAttribute("aria-pressed", "true");
}

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "Light Mode";
        themeButton.setAttribute("aria-pressed", "true");
        localStorage.setItem("theme", "dark");
    }
    else {
        themeButton.textContent = "Dark Mode";
        themeButton.setAttribute("aria-pressed", "false");
        localStorage.setItem("theme", "light");
    }
}
);