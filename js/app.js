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

const stockGrid = document.querySelector(".stock-grid");

fetch("data/sample-stocks.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Stock data could not be loaded.");
        }

        return response.json();
    })
    .then(function (stocks) {
        stockGrid.innerHTML = "";

        stocks.forEach(function (stock) {
            const card = document.createElement("article");
            card.classList.add("stock-card");
            const symbol = document.createElement("h3");
            symbol.textContent = stock.symbol;
            const companyName = document.createElement("p");
            companyName.textContent = stock.companyName;
            const price = document.createElement("p");
            price.textContent = "NPR " + stock.currentPrice;
            price.classList.add("stock-price");

            card.appendChild(symbol);
            card.appendChild(companyName);
            card.appendChild(price);
            stockGrid.appendChild(card);

        });
    })
    .catch(function (error)	
	{	
    console.error(error);
    stockGrid.textContent = "Stock data is temporarily unavailable.";
	});

