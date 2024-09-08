async function fetchStockData() {
    const stock = document.getElementById('stock').value;
    const stockDataDiv = document.getElementById('stock-data');
    
    stockDataDiv.innerHTML = `<p>Loading data for ${stock}...</p>`;

    try {
        const response = await fetch(`data/${stock}_data.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayStockData(data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        stockDataDiv.innerHTML = `<p>Error loading data. Please try again later.</p>`;
    }
}

function displayStockData(data) {
    const stockDataDiv = document.getElementById('stock-data');

    if (!data || Object.keys(data).length === 0) {
        stockDataDiv.innerHTML = `<p>No data available for this stock.</p>`;
        return;
    }

    stockDataDiv.innerHTML = `
        <h2>${data.ticker} Stock Data</h2>
        <p>Latest Close Price: ${data.latest_close}</p>
        <canvas id="stock-chart"></canvas>
    `;

    createGraph(data);
}

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
            responsive: true,
            maintainAspectRatio: false,
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
