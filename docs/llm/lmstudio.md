# LM Studio Integration

This document describes how the backend communicates with the local LLM.

- **LLM**: Gemma
- **Host**: LM Studio running a local OpenAI-compatible API server.
- **Server Address**: `http://127.0.0.1:1234`
- **Model Identifier**: `google/gemma-3-4b`
*(Note: The actual GGUF filename `gemma-3-4b-it-Q4_K_M.gguf` is NOT used as the API identifier).*

## Setup Instructions
1. Download and install LM Studio.
2. Load the `google/gemma-3-4b` model.
3. Start the Local Server on port `1234`.
4. The EQUILIBRIUM backend uses the following environment variables (defined in `.env`):
   ```env
   LM_STUDIO_BASE_URL=http://127.0.0.1:1234/v1
   LM_STUDIO_MODEL=google/gemma-3-4b
   LM_STUDIO_TIMEOUT=120
   LM_STUDIO_API_KEY=lm-studio
   ```

## API Endpoints
- **GET** `/api/v1/gemma/health`: Returns LM Studio server status and model availability.
- **POST** `/api/v1/gemma/chat`: Generic chat completion interface.
- **POST** `/api/v1/gemma/explain`: Constructs an educational explanation around scientific results, heavily constrained by a system prompt to prevent numerical hallucinations.

## Testing Commands
**Test LM Studio API Directly:**
```powershell
curl http://127.0.0.1:1234/v1/models
```
```powershell
curl http://127.0.0.1:1234/v1/chat/completions `
  -H "Content-Type: application/json" `
  -d '{"model":"google/gemma-3-4b","messages":[{"role":"user","content":"Explain gravity in simple terms."}]}'
```

**Test EQUILIBRIUM Backend Integration:**
```powershell
curl http://127.0.0.1:8000/api/v1/gemma/health
```
```powershell
curl -X POST http://127.0.0.1:8000/api/v1/gemma/chat `
  -H "Content-Type: application/json" `
  -d '{"message": "Explain Newtons first law to a high school student in simple language."}'
```
```powershell
curl -X POST http://127.0.0.1:8000/api/v1/gemma/explain `
  -H "Content-Type: application/json" `
  -d '{
  "topic": "physics",
  "experiment": { "planet": "Moon", "gravity": 1.62, "height": 20 },
  "student_prediction": "The object will fall at the same speed as on Earth.",
  "actual_result": { "impact_time": 4.97, "impact_velocity": 8.05 },
  "detected_misconception": null
}'
```

## Common Errors
- `503 Service Unavailable`: Typically occurs if LM Studio is not running, or the model is not loaded.
- `Connection Error`: Ensure the LM Studio server is started and the port matches `1234`.
- EQUILIBRIUM handles offline states gracefully; core scientific features continue working without Gemma.
