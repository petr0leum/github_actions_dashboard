async function fetchStockData() {
    const stock = document.getElementById('stock').value;
    try {
        const response = await fetch(`data/${stock}_data.json`); // Ensure the path is correct
        const data = await response.json();
        displayStockData(data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        document.getElementById('stock-data').innerHTML = `<p>Error loading data. Please try again later.</p>`;
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

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${data.ticker} Price`,
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date/Time' }},
                y: { title: { display: true, text: 'Price' }}
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchStockData);
