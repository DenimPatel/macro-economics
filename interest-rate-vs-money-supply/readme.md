# US Macroeconomic Analysis: M2 Supply, Interest Rates, and S&P 500

This repository contains a Python script (`monthly_chart.py`) for analyzing and visualizing the relationship between US M2 money supply, the Federal Funds Rate, and the S&P 500 index from 2000 to 2025. The script generates a three-panel chart that breaks down different monetary policy phases, making it easy to see how these key indicators interact over time.

## Features

-   **Three-Panel Visualization**:
    1.  **M2 Money Supply**: Tracks the growth of M2 supply over time, with annotations for the percentage change during each monetary phase.
    2.  **S&P 500 Index**: Shows the S&P 500's performance, also annotated with the percentage change for each phase.
    3.  **M2 vs. Fed Funds Rate**: A scatter plot illustrating the trajectory of monetary policy by mapping M2 supply against the interest rate.
-   **Monetary Policy Phases**: The script divides the 25-year period into nine distinct phases, such as "Pre-9/11," "Financial Crisis," "COVID-19," and "Inflation Fight," each with a unique color for clarity.
-   **Recession Shading**: Automatically highlights US recession periods on the charts for additional context.
-   **Data Caching**: Fetches S&P 500 data from Yahoo Finance and caches it locally for 30 days to reduce redundant API calls and speed up subsequent runs.

## Getting Started

Follow these instructions to set up your local environment and run the script.

### Prerequisites

-   Python 3.6 or higher
-   `pip` for installing packages

### Installation

1.  **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Create and Activate a Virtual Environment**

    It's highly recommended to use a virtual environment to manage dependencies and avoid conflicts with other projects.

    -   **On macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    -   **On Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  **Install Required Packages**

    All the necessary libraries are listed in the `requirements.txt` file. Install them with a single command:

    ```bash
    pip install -r requirements.txt
    ```

### Usage

Once you have set up the environment and installed the dependencies, you can run the script from your terminal:

```bash
python monthly_chart.py
```

The script will:
1.  Check for cached S&P 500 data. If the cache is older than 30 days or doesn't exist, it will fetch fresh data from Yahoo Finance.
2.  Process the data, assign monetary phases, and calculate percentage changes.
3.  Generate and display the three-panel chart.

The chart will open in a new window. You can save it as an image file from there.

## Data

-   `us_money_market_monthly_2000_2025.csv`: The core dataset containing monthly M2 money supply and Federal Funds Rate data.
-   **S&P 500 Data**: Fetched automatically from Yahoo Finance (`^GSPC` ticker).

## Files

-   `monthly_chart.py`: The main Python script for generating the visualization.
-   `requirements.txt`: A list of Python libraries required to run the script.
-   `sp500_cache.pkl`: A cached file to store S&P 500 data locally.
-   `sp500_cache_date.txt`: A text file that stores the date of the last cache update.

---
