# 🛡️ SafeSewer

> **AI-Powered Safety & Emergency Response Platform for Confined-Space Workers**

SafeSewer is a digital safety ecosystem engineered to eliminate fatalities for municipal and industrial workers operating in hazardous subterranean confined spaces (sewer chambers, manholes, drainage culverts, and utility vaults).

---

## 🌟 Key Features

### 1. 🎛️ Safety Command Center (`/dashboard`)
* **Real-time 6-Gas HUD**: Continuous electrochemical tracking for $\text{H}_2\text{S}$ (Hydrogen Sulfide), $\text{CH}_4$ (Methane LEL), $\text{O}_2$ (Oxygen Volume), Temperature, 6-Axis IMU Kinematics, and GPS Lock.
* **4 Operational KPIs**: Active Jobs, Safe Workers Below, Caution Warnings, and Critical Atmospheric Alarms.
* **AI Safety Intelligence**: Neural anomaly score ($0\text{--}100$) and automatic mitigation recommendations.
* **Environmental Sensor Trends**: Interactive Recharts time-series graph with $1\text{H} / 6\text{H} / 24\text{H}$ filters and threshold reference lines.

### 2. 🗺️ Subterranean GIS Map (`/map`)
* Vector map of Indore municipal chambers (MG Road Chamber #27, Vijay Nagar, Rajwada, Bypass Road).
* Live status radar pulses (Green = Safe, Amber = Warning, Red = Critical).
* Drainage pipeline mesh overlay and interactive telemetry popups.

### 3. 🚨 Emergency SOS & Topside Siren (`/worker` & Topbar)
* **Real Acoustic Siren**: Web Audio API dual-tone industrial emergency siren ($110\text{dB}$ simulation).
* **1-Click Panic SOS**: 3-stage animated dispatch notifying Indore Municipal Quick Response Rescue Cell with GPS pinpoint and chamber depth ($6.8\text{ m}$).

### 4. 👷 Worker Mobile-First Safety HUD (`/worker`)
* Android-style safety application interface with `SAFE TO WORK` indicator.
* **AI Computer Vision PPE Check (`/worker/ppe`)**: Automated camera scan auditing 6 mandatory gear items (Helmet, SCBA Respirator, Gloves, Boots, Gas Clip, Harness) with a 92% confidence pass badge.

### 5. 🔍 Forensic Incident Timelines (`/incidents`)
* Minute-by-minute unalterable timeline reconstruction ($10:31\text{ Gas Spike} \to 10:32\text{ Notified} \to 10:33\text{ Dispatched} \to 10:35\text{ Evacuated} \to 10:40\text{ Resolved}$).

### 6. 📊 Reports & Compliance (`/reports`)
* Historical incident frequencies, gas distribution charts, and simulated **Executive PDF / CSV Export**.

---

## 🚀 Tech Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tooling**: Vite
* **Styling**: Tailwind CSS with custom safety color palette & Dark Mode
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **Audio Engine**: Web Audio API Synthesizer

---

## 📦 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Launch
```bash
# Clone repository
git clone <YOUR_GITHUB_REPO_URL>
cd ss

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎮 Interactive Demo Controls

* **Trigger Toxic $\text{H}_2\text{S}$ Spike (38 ppm)**: Topbar $\to$ `Simulate` $\to$ `Trigger Toxic H₂S Spike`
* **Flush Atmosphere**: Topbar $\to$ `Simulate` $\to$ `Flush & Normalize Atmosphere`
* **Test Acoustic Siren**: Topbar $\to$ `Test Siren` / `Volume Mute/Unmute`
* **Demo Ticker**: Toggle `DEMO MODE` in Topbar for 4-second live sensor fluctuations.
* **Theme**: Toggle ☀️ Light Mode / 🌙 Dark Slate Mode in the header.

---

## 📄 Documentation

Comprehensive system dossier and user guide is available in [SafeSewer_System_Documentation_and_User_Guide.pdf](./SafeSewer_System_Documentation_and_User_Guide.pdf).

---

## ⚖️ Compliance Standards
* OSHA 1910.146 (Permit-Required Confined Spaces)
* Bureau of Indian Standards (BIS Subterranean Safety Guidelines)
