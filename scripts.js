async function fetchStockData() {
    const stock = document.getElementById('stock').value;

    try {
        const response = await fetch(`data/${stock}_data.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayStockData(data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        document.getElementById('stock-data').innerHTML = `<p>Error loading data. Please try again later.</p>`;
    }
}

function displayStockData(data) {
    const stockDataDiv = document.getElementById('stock-data');

    // Check if data exists
    if (!data || Object.keys(data).length === 0) {
        stockDataDiv.innerHTML = `<p>No data available for this stock.</p>`;
        return;
    }

    // Display the stock data
    stockDataDiv.innerHTML = `
        <h2>${data.ticker} Stock Data</h2>
        <p>Latest Close Price: ${data.latest_close}</p>
        <p>Total Trades: ${data.TotalTrades}</p>
        <p>Win Rate: ${(data.WinRate * 100).toFixed(2)}%</p>
        <p>Cumulative Return: ${(data.CumulativeReturn * 100).toFixed(2)}%</p>
        <canvas id="stock-chart" width="600" height="400"></canvas>
    `;

    // Call function to create graph with dynamic data
    createGraph(data);
}

// Function to create graph using Chart.js with dynamic data and moving averages
function createGraph(data) {
    const ctx = document.getElementById('stock-chart').getContext('2d');

    const labels = data.timestamps;
    const prices = data.prices;
    const ma5 = data.MA_5;
    const ma30 = data.MA_30;

    // Create arrays to hold trade markers
    const buySignals = [];
    const sellSignals = [];
    const holdingPeriods = [];

    // Populate trade markers and hold periods based on signals
    data.Deals.forEach(deal => {
        if (deal.action === 'Buy') {
            buySignals.push({ x: deal.date, y: deal.price });
        } else if (deal.action === 'Sell') {
            sellSignals.push({ x: deal.date, y: deal.price });
        }
    });

    // Populate hold periods based on JSON data
    data.HoldPeriods.forEach(period => {
        holdPeriods.push({
            xMin: period.start,
            xMax: period.end,
            backgroundColor: 'rgba(255, 255, 0, 0.2)', // Light yellow color for hold periods
            borderColor: 'rgba(255, 165, 0, 0.5)', // Orange border for hold periods
            borderWidth: 1,
            label: {
                display: true,
                content: 'Holding Period',
                position: 'start'
            }
        });
    });

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${data.ticker} Price`,
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: '5-Period Moving Average',
                    data: ma5,
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: '30-Period Moving Average',
                    data: ma30,
                    borderColor: 'rgba(75, 75, 192, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'Buy Signal',
                    data: buySignals,
                    pointStyle: 'triangle',
                    pointBackgroundColor: 'green',
                    showLine: false,
                    pointRadius: 4
                },
                {
                    label: 'Sell Signal',
                    data: sellSignals,
                    pointStyle: 'triangle',
                    pointBackgroundColor: 'red',
                    showLine: false,
                    pointRadius: 4,
                    rotation: 180
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Date/Time' },
                    ticks: {
                        maxTicksLimit: 10,
                        maxRotation: 30,
                        autoSkip: true
                    }
                },
                y: {
                    title: { display: true, text: 'Price' }
                }
            },
            plugins: {
                annotation: {
                    annotations: holdPeriods
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchStockData);
