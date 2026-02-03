# ✈️ AeroTanker Calculator

A specialized fuel tankering and weight calculator designed for Airbus **A320** and **A321** aircraft. This tool helps pilots and flight dispatchers quickly compute fuel tanking capabilities and weight limits across multiple flight sectors.

[![GitHub Pages](https://img.shields.io/badge/Deployed%20to-GitHub%20Pages-blue?style=flat-square&logo=github)](https://GabriPalmyro.github.io/aerotanker-app/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## 🚀 Features

- **Multi-Aircraft Support**: Toggle between **A320** and **A321** with automatic limit updates.
- **Engine Variants**: Supports both **CEO** (Current Engine Option) and **NEO** (New Engine Option) configurations.
- **Smart Weight Calculation**:
    - **TOW (Takeoff Weight)**: Computed from Zero Fuel Weight (ZFW) + Tanker fuel.
    - **LWG (Landing Weight)**: Computed from TOW minus Sector 1 consumption.
- **Limit Validation**: Real-time validation against **MTOW** (Maximum Takeoff Weight) and **MLW** (Maximum Landing Weight).
- **Tank Allowed Logic**: Automatically calculates the maximum fuel that can be tanked based on weight constraints.
- **Unit Flexibility**: Handles Taxi fuel in Tons (e.g., 0.2) and sector fuel in KG for precision.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Lucide-inspired aviation UI)
- **Build Tool**: Vite
- **Deployment**: GitHub Pages (gh-pages)

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GabriPalmyro/aerotanker-app.git
   cd aerotanker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the production-ready assets in the `dist/` folder.
- `npm run deploy`: Builds and deploys the application to GitHub Pages.

## ⚠️ Disclaimer

**FOR SIMULATION AND INFORMATIONAL PURPOSES ONLY.**  
This tool is NOT certified for actual flight operations. Always verify all weight and balance data using official load sheets and approved aircraft documentation. The author is not responsible for any misuse or errors resulting from the use of this application.

---

<p align="center">Built with 💙 by <a href="https://github.com/GabriPalmyro">GabriPalmyro</a></p>
