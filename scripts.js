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

    // Populate trade markers and holding periods based on signals
    let holdingStart = null;
    data.Signals.forEach((signal, index) => {
        if (signal === 1) {
            buySignals.push({ x: labels[index], y: prices[index] });
            holdingStart = index;
        } else if (signal === -1 && holdingStart !== null) {
            sellSignals.push({ x: labels[index], y: prices[index] });

            holdingPeriods.push({
                start: holdingStart,
                end: index,
                data: prices.slice(holdingStart, index + 1)
            });
            holdingStart = null;
        }
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
                    pointRadius: 3
                },
                {
                    label: 'Sell Signal',
                    data: sellSignals,
                    pointStyle: 'triangle',
                    pointBackgroundColor: 'red',
                    showLine: false,
                    pointRadius: 3,
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
                    annotations: holdingPeriods.map((period, i) => ({
                        type: 'box',
                        xMin: period.start,
                        xMax: period.end,
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        borderColor: 'rgba(0, 255, 0, 0.3)',
                        borderWidth: 1,
                        label: {
                            content: `Holding ${i + 1}`,
                            enabled: true,
                            position: 'start'
                        }
                    }))
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchStockData);
