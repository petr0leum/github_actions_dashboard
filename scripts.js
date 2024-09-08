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
        <!-- Placeholder for graph -->
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

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${data.ticker} Price`,
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2
                },
                {
                    label: '5-Period Moving Average',
                    data: ma5,
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5]
                },
                {
                    label: '30-Period Moving Average',
                    data: ma30,
                    borderColor: 'rgba(75, 75, 192, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true, // Enable responsive resizing
            maintainAspectRatio: false, // Allow chart to resize dynamically
            scales: {
                x: {
                    title: { display: true, text: 'Date/Time' },
                    ticks: {
                        maxTicksLimit: 10,
                        maxRotation: 0,
                        autoSkip: true
                    }
                },
                y: {
                    title: { display: true, text: 'Price' }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchStockData);
