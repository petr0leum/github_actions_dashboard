# 📈 Automated Stock Insights Dashboard

An interactive web dashboard that automates daily stock data fetching, analysis, and visualization using GitHub Actions. 

## 🚀 Project Overview

This project uses GitHub Actions to automatically fetch stock data daily, perform basic analysis (like moving averages and trend detection), and generate visualizations. The results are displayed on a dynamic web page hosted with GitHub Pages, allowing users to interact with the data and explore different stocks.

### Key Features

- **Automated Data Fetching**: Retrieves daily stock data using APIs (e.g., Yahoo Finance) without manual intervention.
- **Data Analysis**: Computes basic stock analytics, such as moving averages and trend indicators.
- **Interactive Web Dashboard**: Displays the latest stock data and visualizations, allowing users to select different stocks and view historical data.
- **Continuous Integration/Continuous Deployment (CI/CD)**: Uses GitHub Actions to automate the entire workflow, from fetching data to publishing the web page.

## 📊 Usage

### Accessing the Dashboard

The dashboard is automatically deployed using GitHub Pages. You can access it at:

[https://petr0leum.github.io/github_actions_dashboard/](https://petr0leum.github.io/github_actions_dashboard/)

### Interacting with the Dashboard

- **Select a Stock**: Use the dropdown menu to select different stocks.
- **View Analysis**: The page displays the latest data and analysis for the selected stock.
- **Run Custom Analysis**: Modify the scripts and push changes to see them reflected automatically on the dashboard.

## 🛠️ Getting Started

### Prerequisites

To run this project locally or contribute, you will need:

- **Python 3.10**: For data fetching and analysis scripts.
- **Git**: For version control.
- **GitHub Account**: To clone the repository and use GitHub Actions.
- **Basic Knowledge of HTML/CSS/JavaScript**: To understand and modify the web interface.

## 🤖 How GitHub Actions Works

The project uses GitHub Actions to automate the following steps:

1. **Fetch Stock Data**: A Python script fetches daily stock data from a financial API.
2. **Analyze Data**: The data is processed, and key metrics are calculated (e.g., moving averages).
3. **Generate Visualizations**: Plots and visualizations are generated and saved.
4. **Publish Results**: The updated data and visualizations are committed back to the repository and published to GitHub Pages.

### Workflow File

The workflow file is located at `.github/workflows/stock_analysis.yml`. It is triggered daily at 1 AM UTC and can also be run manually.

## 📈 Example Output

![Sample Stock Analysis](data/sample_output.png)

## 🌟 Future Improvements

- **Add More Advanced Analytics**: Implement additional analysis, like volatility, RSI, or Bollinger Bands.
- **Real-Time Data Updates**: Integrate real-time data fetching and visualization using WebSockets.
- **User Authentication**: Allow users to log in and save their stock preferences.
- **Custom Alerts**: Notify users when specific stock conditions are met (e.g., price drops below a certain threshold).
