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
        <p>Total Trades: ${data.TotalTrades}</p>
        <p>Win Rate: ${(data.WinRate * 100).toFixed(2)}%</p>
        <p>Cumulative Return: ${(data.CumulativeReturn).toFixed(2)}%</p>
        <canvas id="stock-chart" width="600" height="400"></canvas>
    `;

    // Call function to create graph with dynamic data
    createGraph(data);
}

// Function to create graph using Chart.js with dynamic data and moving averages
function createGraph(data) {
    const ctx = document.getElementById('stock-chart').getContext('2d');

    // Extract labels (timestamps) and data points (prices and moving averages) dynamically from the JSON data
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
            // Buy signal
            buySignals.push({ x: labels[index], y: prices[index] });
            holdingStart = index; // Start of holding period
        } else if (signal === -1 && holdingStart !== null) {
            // Sell signal
            sellSignals.push({ x: labels[index], y: prices[index] });

            // Add holding period from the buy signal to the sell signal
            holdingPeriods.push({
                start: holdingStart,
                end: index,
                data: prices.slice(holdingStart, index + 1)
            });
            holdingStart = null; // Reset holding start
        }
    });

    // Create a new chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Dynamic labels
            datasets: [
                {
                    label: `${data.ticker} Price`,
                    data: prices, // Dynamic data points
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: 0, // Remove points from the price line
                    pointHoverRadius: 0 // Remove points on hover
                },
                {
                    label: '5-Period Moving Average',
                    data: ma5,
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0, // Remove points from the 5-period moving average
                    pointHoverRadius: 0 // Remove points on hover
                },
                {
                    label: '30-Period Moving Average',
                    data: ma30,
                    borderColor: 'rgba(75, 75, 192, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0, // Remove points from the 30-period moving average
                    pointHoverRadius: 0 // Remove points on hover
                },
                {
                    label: 'Buy Signal',
                    data: buySignals,
                    pointStyle: 'triangle',
                    pointBackgroundColor: 'green',
                    showLine: false,
                    pointRadius: 8 // Keep points for buy signals
                },
                {
                    label: 'Sell Signal',
                    data: sellSignals,
                    pointStyle: 'triangle',
                    pointBackgroundColor: 'red',
                    showLine: false,
                    pointRadius: 8, // Keep points for sell signals
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
                        maxRotation: 30, // Rotate labels by 30 degrees
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
