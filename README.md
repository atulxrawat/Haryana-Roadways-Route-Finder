# 🚌 Haryana Roadways Network Analysis Dashboard

An end-to-end Business Intelligence project built using **Power BI**, **Power Query**, **DAX**, **Python**, and an **AI-assisted HTML/CSS/JavaScript web application** for exploring Haryana Roadways bus services.

The project transforms raw timetable PDFs into an interactive analytics solution, enabling users to analyze the transportation network through a Power BI dashboard and search routes through a companion web application.

## 🚀 Live Website
**[soon](soon)**

---

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| Data extraction | Python [pdfplumber / Camelot / Tabula – mention which one you used] |
| Data transformation | Power Query, Python [pandas] |
| Data modeling & measures | Power BI, DAX |
| Visualization | Power BI |
| Web app | HTML, CSS, JavaScript (AI-assisted) |
| Hosting | GitHub Pages |

---

## 🔄 Project Workflow

```
Timetable PDFs → Python (table extraction) → Data Cleaning → Clean Dataset (CSV)
        → Power Query → DAX Measures → Power BI Dashboard
                      ↘ JSON/CSV → Route Finder Web App
```

---

## 💡 Project Components

### 📊 1. Power BI Dashboard
Designed for business intelligence and operational analysis.

- Interactive KPIs
- Route Analysis
- Time Analysis
- Operator Analysis
- Drill-through
- Dynamic Filtering
- Business Insights

### 🌐 2. Route Finder Web Application
Designed for quick route searching.

- Search buses between cities
- Dynamic filtering
- Responsive UI
- Fast client-side search
- Built using HTML, CSS & JavaScript

The web application was developed using an AI-assisted workflow to accelerate front-end development, while the application logic, integration with the cleaned dataset, testing, and customization were completed as part of this project.

---

## 🔍 Key Insights

- **Busiest route:** [route name] with [X] daily services
- **Peak hour:** [time] with [X] services
- **Largest operator:** [name], accounting for [X]% of all services
- **Top source city:** [city] with [X] departures
- **Time distribution:** [X]% of services run in the morning, [X]% in the evening
- [Add any other finding that surprised you]

---

## 📊 Dashboard Pages

### 1️⃣ Executive Summary
Provides a complete overview of the transportation network.

**KPIs:** Total Services · Total Routes · Cities Covered · Total Origin Cities · Total Service Types

**Visuals:** Top Source Cities · Top Destination Cities · Services by Time Category · Top Operators by Services · Route Summary Table

![Executive Summary](Images/executive%20summary.png)

### 2️⃣ Route Analysis
Analyzes route popularity and frequency.

**KPIs:** Total Routes · Busiest Route · Average Bus Services per Route · First Departure · Last Departure

**Visuals:** Top Routes by Services · Route Frequency Distribution · Treemap of Top Source Cities · Services by Time Category

![Route Analysis](Images/route%20analysis.png)

### 3️⃣ Time Analysis
Analyzes service availability throughout the day.

**KPIs:** Peak Hour · Peak Time Slot · Morning Service % · Average Bus Services per Hour · Evening Service %

**Visuals:** Distribution of Time Category by Operators · Routes vs Services by Hour · Time Analysis of Destination Cities

![Time Analysis](Images/time%20analysis.png)

### 4️⃣ Operator Analysis
Compares operators based on coverage and operational performance.

**KPIs:** Total Operators · Largest Operator · Largest Operator Share (%) · Average Services per Operator · Average Routes per Operator

**Visuals:** Operator Coverage (Origin vs Destination Cities) · Top Operators by Network Coverage · Operator-wise Time Slot Distribution · Operator Performance Summary

![Operator Analysis](Images/operator%20analysis.png)

---

## 🌐 Web Application

A lightweight web-based route finder built with HTML, CSS and JavaScript.

**Functionalities**
- Route Search
- Dynamic Filters
- Source & Destination Selection
- Service Type Filtering
- Time Category Filtering
- Responsive Interface

**AI-Assisted Development**
The front-end interface was developed using an AI-assisted workflow to accelerate HTML, CSS, and JavaScript development. The application was customized, integrated, tested, and refined to work with the cleaned dataset.

---

## 🧹 Data Cleaning

The raw timetable PDFs required extensive preprocessing before analysis.

- Extracting tables from PDF files
- Standardizing column names
- Cleaning inconsistent city names
- Standardizing operator names
- Removing duplicate records
- Handling missing values
- Converting departure time into Time datatype
- Creating custom Time Categories (e.g., Morning, Afternoon, Evening, Night)
- Preparing a clean analytical dataset

**Data source:** Haryana Roadways timetable PDFs [add source/website and the date the data was collected]

---

## 📊 Dashboard Features

- Interactive Slicers
- Bookmarks
- Navigation Buttons
- Collapsible Filter Panel
- Dynamic KPI Cards
- Tooltips
- Synced Slicers

---

## 📁 Repository Structure

```
├── Dashboard/   # Power BI (.pbix) file
├── Images/      # Dashboard screenshots
├── data/        # Cleaned dataset
├── docs/        # Web application (GitHub Pages)
└── README.md
```

---

## ▶️ How to Use

1. **Web app:** open the live website above and select source, destination and filters.
2. **Dashboard:** download the `.pbix` file from the `Dashboard` folder and open it in Power BI Desktop.

---

## ⚠️ Disclaimer

This is a personal portfolio project based on publicly available timetable data. Schedules may change, so please verify with official Haryana Roadways sources before travelling.

---

## 👤 Author

**Atul Rawat**
