async function fetchStockData() {
    const stock = document.getElementById('stock').value;
    const response = await fetch(`data/${stock}_data.json`); // Assuming data is saved as JSON
    const data = await response.json();
    
    // Process and display data
    displayStockData(data);
}

function displayStockData(data) {
    const stockDataDiv = document.getElementById('stock-data');
    stockDataDiv.innerHTML = `
        <h2>${data.ticker} Stock Data</h2>
        <p>Latest Close Price: ${data.latest_close}</p>
        <!-- Add more elements to display other analysis data -->
    `;
}

document.addEventListener('DOMContentLoaded', fetchStockData);
