# EQUILIBRIUM Official Resources & Development Policy

This document contains the official reference links, library choices, and strict development policies for EQUILIBRIUM.

## Official Libraries and Documentation

### Frontend / Visualization
- **React**: [https://react.dev/](https://react.dev/)
- **Vite**: [https://vite.dev/](https://vite.dev/)
- **Three.js**: [https://threejs.org/](https://threejs.org/) | [Docs](https://threejs.org/docs/) (For 3D scientific visualization)
- **Chart.js**: [https://www.chartjs.org/](https://www.chartjs.org/) | [Docs](https://www.chartjs.org/docs/latest/) (For scientific graphs)

### Chemistry
- **RDKit.js**: [https://github.com/rdkit/rdkit-js](https://github.com/rdkit/rdkit-js) | [Docs](https://docs.rdkitjs.com/) | [NPM](https://www.npmjs.com/package/@rdkit/rdkit)
  - *Usage*: Molecular structure handling and 2D depiction. Do NOT use as the 3D engine.
- **3Dmol.js**: [https://github.com/3dmol/3Dmol.js](https://github.com/3dmol/3Dmol.js) | [Docs](https://3dmol.org/doc/)
  - *Usage*: Interactive 3D molecular visualization.

### Thermodynamics
- **CoolProp**: [https://github.com/CoolProp/CoolProp](https://github.com/CoolProp/CoolProp) | [Docs](https://coolprop.org/)
  - *Usage*: Thermophysical properties and real-fluid calculations. Runs only in the Python backend.

### Backend
- **FastAPI**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/) (Backend API)
- **Uvicorn**: [https://www.uvicorn.org/](https://www.uvicorn.org/) (Development server)
- **Pydantic**: [https://docs.pydantic.dev/](https://docs.pydantic.dev/) (Request/response validation)

### Machine Learning
- **scikit-learn**: [https://scikit-learn.org/](https://scikit-learn.org/) | [Docs](https://scikit-learn.org/stable/)
  - *Usage*: Initial simple supervised ML prototypes (Logistic Regression, Decision Tree, Random Forest) for misconception detection. No neural networks initially.
- **NumPy**: [https://numpy.org/](https://numpy.org/) (Numerical computation)
- **pandas**: [https://pandas.pydata.org/](https://pandas.pydata.org/) (Dataset processing)
- **SciPy**: [https://scipy.org/](https://scipy.org/) (Scientific/numerical utilities)
- **joblib**: [https://joblib.readthedocs.io/](https://joblib.readthedocs.io/) (Saving/loading scikit-learn models)

### Local LLM
- **LM Studio**: [https://lmstudio.ai/](https://lmstudio.ai/) | [REST API Docs](https://lmstudio.ai/docs/developer/rest) | [OpenAI-compat Docs](https://lmstudio.ai/docs/developer/openai-compat)
  - *Usage*: Gemma model host. Strictly for natural-language educational explanation.

## Scientific Reference Sources
- **NIST Chemistry WebBook**: [https://webbook.nist.gov/](https://webbook.nist.gov/) | [Docs](https://webbook.nist.gov/chemistry/) (Thermochemical and thermophysical data)
- **PubChem**: [https://pubchem.ncbi.nlm.nih.gov/](https://pubchem.ncbi.nlm.nih.gov/) | [PUG REST API](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest) (Chemical identifiers and properties)
- **NASA Planetary Fact Sheet**: [https://nssdc.gsfc.nasa.gov/planetary/factsheet/](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) (Planetary properties for physics)

> **IMPORTANT**: Never invent scientific constants or reference values. Store imported values in `data/reference/` and record the source URL and attribution.

## Core Development Policies

### Architecture
Gemma is **NOT** the scientific calculation engine. The architecture flows exactly as follows:
`Student` → `EQUILIBRIUM UI` → `Scientific Engine` → `Scientific Result` → `Student Experiment Data` → `ML Model` → `Possible misconception/pattern` → `Gemma via LM Studio` → `Natural-language educational explanation`

### Development Phasing & Installation Rule
- **Do not install all libraries immediately.**
- Install libraries only when their corresponding module is being implemented.
- **First Milestone**: PHYSICS → GRAVITY LABORATORY
  - Required Stack: React, Vite, Chart.js, FastAPI, NumPy, Pydantic, Uvicorn.
  - Three.js is optional depending on 3D requirements.
  - RDKit.js, 3Dmol.js, CoolProp, Cantera, ML, and LLM integrations must remain untouched.

### Data Policy
- **Scientific Reference Data**: Only from authoritative sources (NASA, NIST, PubChem).
- **Student Interaction Data**: Generated intrinsically by EQUILIBRIUM usage (parameters, predictions, confidence, etc.).
- **ML Training Rule**: Do NOT download external datasets (e.g., Kaggle) or generate fake datasets. Training occurs only after student data schema is designed and legitimate labelled data is collected.
