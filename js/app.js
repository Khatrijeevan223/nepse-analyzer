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
const lastUpdated = document.querySelector(".last-updated");
const watchlistGrid = document.querySelector(".watchlist-grid");
const watchlistEmpty = document.querySelector(".watchlist-empty");
const portfolioSymbol = document.querySelector("#portfolio-symbol");
const portfolioForm = document.querySelector(".portfolio-form");
const portfolioQuantity = document.querySelector("#portfolio-quantity");
const portfolioPrice = document.querySelector('#portfolio-price');
const portfolioGrid = document.querySelector(".portfolio-grid");
const portfolioEmpty = document.querySelector(".portfolio-empty");
const totalInvestedElement = document.querySelector("#total-invested");
const totalCurrentValueElement = document.querySelector("#total-current-value");
const totalGainLossElement = document.querySelector("#total-gain-loss");


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

        const watchlistButton =
            document.createElement("button");

        watchlistButton.type = "button";
        watchlistButton.classList.add("watchlist-button");
        watchlistButton.dataset.symbol = stock.symbol;
        watchlistButton.textContent = "Add to Watchlist";
        watchlistButton.addEventListener(
            "click",
            function () {
                const symbol =
                    watchlistButton.dataset.symbol;
                if (!watchlistSymbols.includes(symbol)) {
                    watchlistSymbols.push(symbol);
                    saveWatchlist();
                    displayWatchedlist();
                }
            }
        )

        card.appendChild(symbol);
        card.appendChild(companyName);
        card.appendChild(price);
        card.appendChild(change);
        card.appendChild(watchlistButton);
        stockGrid.appendChild(card);

    });
    if (stocks.length === 0) {
        stockGrid.textContent = "No matching stocks found.";
        return;
    }
    updateWatchlistButtons();
}

let watchlistSymbols = [];
let allStocks = [];
let portfolioHoldings = [];

const savedWatchlist =
    localStorage.getItem("watchlist");

if (savedWatchlist !== null) {
    try {
        const parsedWatchlist =
            JSON.parse(savedWatchlist);

        if (Array.isArray(parsedWatchlist)) {
            watchlistSymbols = parsedWatchlist;
        }
        else {
            localStorage.removeItem("watchlist");
        }
    }
    catch (error) {
        console.error(
            "Saved watchlist could not be read.",
            error
        );

        localStorage.removeItem("watchlist");
    }
}


function saveWatchlist() {
    const watchlistText =
        JSON.stringify(watchlistSymbols);

    localStorage.setItem(
        "watchlist",
        watchlistText
    )
}

function savePortfolio() {
    const portfolioText =
        JSON.stringify(portfolioHoldings);

    localStorage.setItem(
        "portfolio",
        portfolioText
    );
}

function displayPortfolio() {
    portfolioGrid.innerHTML = "";
    updatePortfolioTotals();
    if (portfolioHoldings.length === 0) {
        portfolioEmpty.hidden = false;
        return;
    }

    portfolioEmpty.hidden = true;

    portfolioHoldings.forEach(function (holding, holdingIndex) {
        const marketStock =
            allStocks.find(function (stock) {
                return stock.symbol === holding.symbol;
            });

        const card =
            document.createElement("article");

        card.classList.add("portfolio-card");

        const symbol =
            document.createElement("h3");
        symbol.textContent = holding.symbol;

        const quantity =
            document.createElement("p");
        quantity.textContent =
            "Quantity: " + holding.quantity;

        const purchasePrice =
            document.createElement("p");

        purchasePrice.textContent =
            "Purchase price: NPR " + holding.purchasePrice.toFixed(2);

        const investedAmount =
            holding.quantity * holding.purchasePrice;

        const investedAmountText =
            document.createElement("p");
        investedAmountText.textContent =
            "Invested amount: NPR " +
            investedAmount.toFixed(2);

        const currentPriceText =
            document.createElement("p");
        const currentValueText =
            document.createElement("p");

        const gainLossText =
            document.createElement("p");
        const returnText =
            document.createElement("p");
        // Remove Button
        const removeButton =
            document.createElement("button");


        removeButton.type = "button";
        removeButton.classList.add("remove-holding");
        removeButton.textContent = "Remove";

        removeButton.addEventListener(
            "click",
            function () {
                portfolioHoldings.splice
                    (
                        holdingIndex,
                        1
                    );
                savePortfolio();
                displayPortfolio();

            }
        );


        if (marketStock) {
            currentPriceText.textContent =
                "Current Price: NPR " +
                marketStock.currentPrice.toFixed(2);

            const currentValue =
                holding.quantity *
                marketStock.currentPrice;

            currentValueText.textContent =
                "Current value: NPR " +
                currentValue.toFixed(2);

            const gainLoss =
                currentValue - investedAmount;

            gainLossText.textContent =
                "Unrealized gain/loss: NPR " +
                gainLoss.toFixed(2);

            const returnPercentage =
                (gainLoss / investedAmount) * 100;
            returnText.textContent =
                "Return: " +
                returnPercentage.toFixed(2) +
                "%";
            if (gainLoss >= 0) {
                gainLossText.classList.add("positive-return");
                returnText.classList.add("positive-return");
            }
            else {
                gainLossText.classList.add("negative-return");
                returnText.classList.add("negative-return");
            }
        }

        else {
            currentPriceText.textContent =
                "Current price: unavailable";

            currentValueText.textContent =
                "Current value: unavailable";

            gainLossText.textContent =
                "Unrealized gain/loss: unavailable";
            returnText.textContent =
                "Return: unavailable";

        }

        card.appendChild(symbol);
        card.appendChild(quantity);
        card.appendChild(purchasePrice);
        card.appendChild(investedAmountText);
        card.appendChild(currentPriceText);
        card.appendChild(currentValueText);
        card.appendChild(gainLossText);
        card.appendChild(returnText);
        card.appendChild(removeButton);
        portfolioGrid.appendChild(card);
    });
}

function updatePortfolioTotals() {
    let totalInvested = 0;
    let totalCurrentValue = 0;

    portfolioHoldings.forEach(function (holding) {
        totalInvested +=
            holding.quantity * holding.purchasePrice;

    const marketStock =
        allStocks.find(function (stock) {
             return stock.symbol === holding.symbol;
        });

    if (marketStock) {
        totalCurrentValue += holding.quantity * marketStock.currentPrice;
    }
    });

    const totalGainLoss =
        totalCurrentValue - totalInvested;
    totalGainLossElement.textContent =
        "NPR " + totalGainLoss.toFixed(2);
    totalInvestedElement.textContent =
        "NPR " + totalInvested.toFixed(2);
    totalCurrentValueElement.textContent =
        "NPR " + totalCurrentValue.toFixed(2);
    // Gain and loss Calculator

    totalGainLossElement.classList.remove(
        "positive-return",
        "negative-return"
    );

    if (totalGainLoss >= 0)
    {
        totalGainLossElement.classList.add(
            "positive-return"
        );
    }
    else
    {
        totalGainLossElement.classList.add(
            "negative-return"
        );
    }


}



const savedPortfolio =
    localStorage.getItem("portfolio");


if (savedPortfolio !== null) {
    try {
        const parsedPortfolio =
            JSON.parse(savedPortfolio);

        if (Array.isArray(parsedPortfolio)) {
            portfolioHoldings = parsedPortfolio;
        }
        else {
            localStorage.removeItem("portfolio");
        }

    }

    catch (error) {
        console.error("Saved portfolio could not be read.",
            error
        );
        localStorage.removeItem("portfolio");
    }
}
function updateWatchlistButtons() {
    const buttons =
        document.querySelectorAll(".watchlist-button");

    buttons.forEach(function (button) {
        const isWatched =
            watchlistSymbols.includes(
                button.dataset.symbol
            );

        button.disabled = isWatched;

        if (isWatched) {
            button.textContent = "Added";
        }
        else {
            button.textContent = "Add to Watchlist";
        }
    });
}
function getWatchedStocks() {
    return allStocks.filter(function (stock) {
        return watchlistSymbols.includes(
            stock.symbol
        );
    });
}

function displayWatchedlist() {
    const watchedStocks = getWatchedStocks();

    watchlistGrid.innerHTML = "";
    if (watchedStocks.length === 0) {
        watchlistEmpty.hidden = false;
        return;
    }
    watchlistEmpty.hidden = true;


    watchedStocks.forEach(function (stock) {
        const card = document.createElement("article");
        card.classList.add("watchlist-card");

        const symbol = document.createElement("h3");
        symbol.textContent = stock.symbol;

        const price = document.createElement("p");
        price.textContent = "NPR " + stock.currentPrice;

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.classList.add("remove-watchlist")
        removeButton.dataset.symbol = stock.symbol;
        removeButton.textContent = "Remove";
        removeButton.addEventListener(
            "click",
            function () {
                const symbolToRemove
                    = removeButton.dataset.symbol;

                watchlistSymbols =
                    watchlistSymbols.filter(
                        function (symbol) {
                            return symbol !== symbolToRemove;
                        }
                    );
                saveWatchlist();
                displayWatchedlist();
                updateWatchlistButtons();
            }
        );

        card.appendChild(symbol);
        card.appendChild(price);
        card.appendChild(removeButton);
        watchlistGrid.appendChild(card);
    })
}

function populatePortfolioOptions(stocks) {
    stocks.forEach(function (stock) {
        const option =
            document.createElement("option");

        option.value = stock.symbol;
        option.textContent =
            stock.symbol + " - " + stock.companyName;

        portfolioSymbol.appendChild(option);
    });
}

portfolioForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();
        const holdingAlreadyExists =
            portfolioHoldings.some(function (holding)
        {
            return holding.symbol === portfolioSymbol.value;
        })
        if (holdingAlreadyExists)
        {
            alert(
                "This stock is already in your portfolio."
            );
            return;
        }
        const holding =
        {
            symbol: portfolioSymbol.value,
            quantity: Number(portfolioQuantity.value),
            purchasePrice: Number(portfolioPrice.value)
        };

        portfolioHoldings.push(holding);
        savePortfolio();
        displayPortfolio();
        portfolioForm.reset();

    }
);
fetch("data/generated-stocks.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Stock data could not be loaded.");
        }

        return response.json();
    })

    .then(function (stocks) {
        allStocks = stocks;



        if (allStocks.length > 0 &&
            allStocks[0].updatedAt
        ) {
            const updateDate = allStocks[0].updatedAt;
            lastUpdated.textContent =
                "Updated: " + formatChartDate(updateDate);
        }
        else {
            lastUpdated.textContent = "Updated: unavailable";
        }
        displayStocks(allStocks);
        displayGainers(allStocks);
        displayLosers(allStocks);
        displayWatchedlist();
        updateWatchlistButtons();
        populatePortfolioOptions(allStocks);
        displayPortfolio();
        totalCompanies.textContent = allStocks.length;
    })

    .catch(function (error) {
        console.error(error);
        stockGrid.textContent = "Stock data is temporarily unavailable.";
        lastUpdated.textContent = "Updated: unavailable";
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

