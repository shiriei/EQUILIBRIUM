# EQUILIBRIUM

EQUILIBRIUM is an interactive virtual science laboratory for exploring physics, thermodynamics, and chemistry through simulations, experiments, visualizations, and AI-assisted explanations.

The project combines a deterministic scientific backend with a modern interactive frontend so students can predict outcomes, run experiments, inspect models, and receive contextual explanations without sacrificing scientific rigor.

## Why this project exists

EQUILIBRIUM is designed to help learners:

- make predictions before running an experiment
- compare expected vs. observed behavior
- explore models and datasets in a visual, interactive way
- investigate physics, thermodynamics, and chemistry through guided simulations
- use local AI-powered explanations to support learning without bypassing the science

## Core features

- Interactive simulations for scientific concepts
- Predict-before-experiment workflows
- Visualization dashboards for experimental results
- Deterministic computation in the backend for scientific reliability
- REST API for frontend integration
- AI-assisted explanation layer using local model access (LM Studio / Gemma)
- Machine-learning support for misconception detection and educational analysis
- 2D and 3D scientific views using React, Three.js, and related visualization libraries

## Architecture

EQUILIBRIUM is split into a few focused modules:

- frontend: React + Vite application for the user experience
- backend: FastAPI API that performs scientific calculations and orchestration
- data: datasets and supporting materials for experiments
- docs: project documentation and design notes
- models: model assets or training-related artifacts

The application follows a clean separation of responsibilities:

- the frontend renders experiments and interfaces
- the backend performs calculations and serves API endpoints
- ML and LLM logic are kept separate from the UI and core scientific paths

## Repository structure

```text
EQUILIBRIUM/
├── README.md
├── .env.example
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
├── data/
├── docs/
├── models/
├── LICENSE
└── .gitignore
```

## Tech stack

### Frontend

- React
- Vite
- React Router
- Three.js / React Three Fiber
- Chart.js
- RDKit.js and 3Dmol.js

### Backend

- FastAPI
- Uvicorn
- NumPy
- Pandas
- SciPy
- CoolProp
- scikit-learn
- Pydantic
- HTTPX

### AI / local model support

- LM Studio
- Gemma / local model endpoints
- optional ML-based educational analysis

## Getting started

### 1) Clone the repository

```bash
git clone https://github.com/shiriei/EQUILIBRIUM.git
cd EQUILIBRIUM
```

### 2) Configure environment variables

Copy the example environment file and adjust the values if needed:

```bash
cp .env.example .env
```

The example configuration includes defaults for the API server and LM Studio integration:

```env
ENVIRONMENT=development
API_PORT=8000
FRONTEND_URL=http://localhost:5173
LM_STUDIO_BASE_URL=http://127.0.0.1:1234/v1
LM_STUDIO_MODEL=google/gemma-3-4b
LM_STUDIO_TIMEOUT=120
LM_STUDIO_API_KEY=lm-studio
```

### 3) Set up the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs will be available at:

- http://localhost:8000/docs
- http://localhost:8000/openapi.json

### 4) Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will typically run at:

- http://localhost:5173

## Local AI / LM Studio note

Some explanation and analysis features depend on a local LM Studio server. If you want those features enabled:

1. Start LM Studio locally.
2. Point `LM_STUDIO_BASE_URL` to your local endpoint.
3. Ensure the configured model is available in your local runtime.

The backend is designed to use the local model for educational explanations while keeping the core scientific calculations deterministic and explicit.

## Documentation

For more detailed project-specific notes, see:

- backend/README.md
- frontend/README.md
- docs/

## License

This project is licensed under the terms of the repository license.

## Contributing

Contributions are welcome. If you are improving the scientific logic, frontend UX, documentation, or model integration, please keep the separation between deterministic science and AI-assisted interpretation clear and well-tested.

## Project status

EQUILIBRIUM is a research and education-oriented interactive science platform with a strong emphasis on scientific correctness, visualization, and guided learning.
