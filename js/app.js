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
const searchInput = document.querySelector('input[type="search"]');
const searchForm = document.querySelector(".search-form");
const sectorFilter = document.querySelector("#sector-filter");
const gainersTableBody = document.querySelector(".daily-gainers tbody");
const totalCompanies = document.querySelector(".totalcompanies");
const indexChart = document.querySelector(".index-chart");
const chartPeriod = document.querySelector(".chart-period");

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSector = sectorFilter.value;

    const filteredStocks = allStocks.filter(function (stock) {
        const matchesSearch =
            stock.symbol.toLowerCase().includes(searchTerm) ||
            stock.companyName.toLowerCase().includes(searchTerm);

        const normalizedSector = stock.sector
            .toLowerCase()
            .replace(" ", "-");
        const matchesSector =
            selectedSector === "all" ||
            normalizedSector === selectedSector;

        return matchesSearch && matchesSector;
    })
    displayStocks(filteredStocks);
}

function calculatePercentageChange(stock) {
    const pointChange =
        stock.currentPrice - stock.previousClose;

    if (stock.previousClose === 0) {
        return 0;
    }

    return (
        pointChange / stock.previousClose
    ) * 100;
}

function showEmptyTableMessage(tableBody, message) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.textContent = message;
    cell.colSpan = 3;

    row.appendChild(cell);
    tableBody.appendChild(row);
}

function displayGainers(stocks) {
    const gainers = stocks
        .filter(function (stock) {
            return calculatePercentageChange(stock) > 0;
        })
        .sort(function (firstStock, secondStock) {
            return (
                calculatePercentageChange(secondStock) -
                calculatePercentageChange(firstStock)
            );
        })
        .slice(0, 5);

    gainersTableBody.innerHTML = "";
    gainers.forEach(function (stock) {
        const row = document.createElement("tr");

        const symbolCell = document.createElement("td");
        symbolCell.textContent = stock.symbol;

        const priceCell = document.createElement("td");
        priceCell.textContent = stock.currentPrice;

        const changeCell = document.createElement("td");
        const percentageChange =
            calculatePercentageChange(stock);

        changeCell.textContent =
            "+" + percentageChange.toFixed(2) + "%";

        changeCell.classList.add("positive");

        row.appendChild(symbolCell);
        row.appendChild(priceCell);
        row.appendChild(changeCell);

        gainersTableBody.appendChild(row);
    });
    if (gainers.length === 0) {
        showEmptyTableMessage(
            gainersTableBody,
            "No gainers available."
        );
    }
};

const losersTableBody =
    document.querySelector(".daily-losers tbody");

function displayLosers(stocks) {
    const losers = stocks
        .filter(function (stock) {
            return calculatePercentageChange(stock) < 0;
        })
        .sort(function (firstStock, secondStock) {
            return (
                calculatePercentageChange(firstStock) -
                calculatePercentageChange(secondStock)
            );
        })
        .slice(0, 5);

    losersTableBody.innerHTML = "";

    losers.forEach(function (stock) {
        const row = document.createElement("tr");

        const symbolCell = document.createElement("td");
        symbolCell.textContent = stock.symbol;

        const priceCell = document.createElement("td");
        priceCell.textContent = stock.price;

        const changeCell = document.createElement("td");
        const percentageChange =
            calculatePercentageChange(stock);

        changeCell.textContent = percentageChange.toFixed(2) + "%";
        changeCell.classList.add("negative");

        row.appendChild(symbolCell);
        row.appendChild(priceCell);
        row.appendChild(changeCell);

        losersTableBody.appendChild(row);
    });
    if (losers.length === 0) {
        showEmptyTableMessage(
            losersTableBody,
            "No losers available."
        );
    }
}

function displayStocks(stocks) {
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

        // POINT CHANGE
        const pointChange = stock.currentPrice - stock.previousClose;
        const change = document.createElement("p");
        const formattedChange =
            pointChange > 0 ? "+" + pointChange : pointChange;
        change.textContent = "Change: " + formattedChange;

        change.classList.add("stock-change");
        if (pointChange > 0) {
            change.classList.add("positive");
        }
        else if (pointChange < 0) {
            change.classList.add("negative");
        }
        else {
            change.classList.add("neutral");
        }

        const percentageChange = calculatePercentageChange(stock);
        change.textContent = "Change: " + formattedChange + " (" + percentageChange.toFixed(2) + "%)";


        card.appendChild(symbol);
        card.appendChild(companyName);
        card.appendChild(price);
        card.appendChild(change);
        stockGrid.appendChild(card);

    });
    if (stocks.length === 0) {
        stockGrid.textContent = "No matching stocks found.";
        return;
    }
}

let allStocks = [];

fetch("data/generated-stocks.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Stock data could not be loaded.");
        }

        return response.json();
    })

    .then(function (stocks) {
        allStocks = stocks;
        displayStocks(allStocks);
        displayGainers(allStocks);
        displayLosers(allStocks);

        totalCompanies.textContent = allStocks.length;
    })

    .catch(function (error) {
        console.error(error);
        stockGrid.textContent = "Stock data is temporarily unavailable.";
    });


searchInput.addEventListener("input", applyFilters);
sectorFilter.addEventListener("change", applyFilters);
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
});

function formatChartDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

function displayMarketChart(marketHistory) {
    indexChart.innerHTML = "";

    if (
        !Array.isArray(marketHistory) ||
        marketHistory.length === 0
    ) {
        indexChart.textContent =
            "Market history is unavailable.";
        return;
    }


    const indexValues = marketHistory.map(function (day) {
        return day.indexValue;
    });

    const minimumValue = Math.min(...indexValues);
    const maximumValue = Math.max(...indexValues);
    const valueRange = maximumValue - minimumValue;
    const firstDay = marketHistory[0];
    const lastDay =
        marketHistory[marketHistory.length - 1];

    indexChart.setAttribute(
        "aria-label",
        "NEPSE Index from " +
        firstDay.date +
        " at " +
        firstDay.indexValue +
        " to " +
        lastDay.date +
        " at " +
        lastDay.indexValue
    );
     chartPeriod.textContent =
    	"NEPSE Index - Last " +
        marketHistory.length + 
        " Trading Days";

    marketHistory.forEach(function (day) {
        const barHeight =
            valueRange === 0 ? 60 : 30 + ((day.indexValue - minimumValue) /
                valueRange) * 70;

        const column = document.createElement("div");
        column.classList.add("chart-column");

        const bar = document.createElement("div");
        const valueLabel = document.createElement("span");

        valueLabel.classList.add("chart-value");
        valueLabel.textContent =
            day.indexValue.toFixed(2);

        bar.appendChild(valueLabel);
        bar.classList.add("chart-bar");
        bar.style.height = barHeight + "%";
        bar.title =
            day.date + ":" + day.indexValue;
        const label = document.createElement("span");
        label.textContent = formatChartDate(day.date);

        column.appendChild(bar);
        column.appendChild(label);
        indexChart.appendChild(column);
    })

}


fetch("data/market-history.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Market history could not be loaded");
        }
        return response.json();
    })

    .then(function (marketHistory) {
        displayMarketChart(marketHistory);
    })

    .catch(function (error) {
        console.error(error);
        indexChart.textContent =
            "Market chart could not be loaded.";
    });

