# EQUILIBRIUM Backend

This directory contains the FastAPI backend for EQUILIBRIUM.

It is responsible for:
- Performing all scientific computations deterministically using Python libraries (NumPy, SciPy, CoolProp).
- Exposing REST APIs for the frontend.
- Managing data for student experiments.
- Running machine learning models (scikit-learn) for misconception detection.
- Communicating with the local LLM (LM Studio / Gemma) to generate explanations.

**Note:** The ML training code and Gemma calls are decoupled from the API routes and UI.
