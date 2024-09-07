async function fetchStockData() {
    const stock = document.getElementById('stock').value;
    const response = await fetch(`data/${stock}_data.json`);
    const data = await response.json();
    
    displayStockData(data);
}

function displayStockData(data) {
    const stockDataDiv = document.getElementById('stock-data');
    stockDataDiv.innerHTML = `
        <h2>${data.ticker} Stock Data</h2>
        <p>Latest Close Price: ${data.latest_close}</p>
    `;
}

document.addEventListener('DOMContentLoaded', fetchStockData);
