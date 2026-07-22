<div align="center">
  <img src="https://img.shields.io/badge/ZeroHarm%20AI-Predict.%20Explain.%20Prevent.-0284c7?style=for-the-badge&logo=shield" alt="ZeroHarm AI" />
  <h1 align="center">ZeroHarm AI: Industrial Safety Intelligence</h1>
  <p align="center">
    <strong>Agentic AI Orchestration for Heavy Industry</strong>
  </p>
</div>

<br />

## 🚨 The Problem: The "Hidden SIMOPS" Catastrophe
In heavy industries (mining, oil & gas, metallurgy), catastrophic accidents rarely happen due to a single failure. They occur when **Simultaneous Operations (SIMOPS)** dangerously overlap with environmental degradation. Traditional systems flash red, but they lack the contextual intelligence to correlate a dropping ventilation fan, rising methane, and an active hot-work (welding) permit in the same zone. They are reactive and disconnected.

## 🛡️ The Solution: ZeroHarm AI
ZeroHarm AI is an enterprise-grade intelligence layer powered by a Swarm of specialized LangGraph AI Agents. It acts as a continuous **Compound Risk Detection** engine. It ingests high-frequency telemetry (SCADA/IoT), cross-references digital permits (PTW), evaluates statutory safety regulations (e.g., DGMS), and triggers autonomous emergency interventions *before* an accident occurs.

---

## 🏗️ Enterprise Architecture

### 1. The Backend (Python / FastAPI / LangGraph)
A robust asynchronous Multi-Agent Intelligence engine.
- **WebSocket Telemetry Stream:** Ingests live sensor data at high frequencies, simulating Edge AI IoT deployments.
- **LangGraph State Machine:** The AI Orchestrator that coordinates the Stream Agent, Compliance Agent, and Risk Agent.
- **Response Agent:** Triggers API callbacks to isolate physical valves and trigger evacuations when a compound risk exceeds threshold.

### 2. The Frontend (Next.js 14 / Zustand / Recharts)
A zero-latency, highly professional Classic Enterprise Dashboard.
- **Real-Time Data Engine:** Live telemetry simulation generating realistic 1Hz data streams to prove non-static responsiveness.
- **Live Plant Overview:** Dynamic spatial visualization with absolute-positioned status markers reacting to live SIMOPS threats.
- **Explainable KPIs & Trends:** Recharts Donut and Line charts rendering compound risk scores instantly from WebSocket payloads.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Clone the Repository
```bash
git clone https://github.com/devbyskd/ET_AI.git
cd ET_AI
```

### 2. Start the AI Backend
Open a terminal and start the FastAPI engine:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start the Command Center UI
Open a **second** terminal and start the Next.js frontend:
```bash
cd frontend
npm install
npm run dev
```

### 4. 🎬 Trigger The Live Demo
1. Open your browser to [http://localhost:3000](http://localhost:3000).
2. The dashboard will initialize and stream live nominal telemetry at 1Hz.
3. Open a **third** terminal and run the disaster simulation script to inject the SIMOPS conflict:
   ```bash
   cd backend
   python tests/test_simulation.py
   ```
4. Watch the Multi-Agent swarm evaluate the escalating compound risk, instantly spike the UI risk trends to 94%, and drop the Emergency Strobe Modal across the screen!

---

<div align="center">
  <i>Built for the ET AI Hackathon 2026 by TEAM ABMS</i><br/>
  <strong>Predict. Explain. Prevent.</strong>
</div>
