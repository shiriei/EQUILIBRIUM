
import { fetchApi } from './index';

export const checkGemmaHealth = () => fetchApi('/gemma/health', { method: 'GET' });

export const getGemmaExplanation = (data) => fetchApi('/gemma/explain', {
  method: 'POST',
  body: JSON.stringify(data)
});
