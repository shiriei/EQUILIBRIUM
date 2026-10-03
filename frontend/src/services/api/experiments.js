
import { fetchApi } from './index';

export const createExperiment = (data) => fetchApi('/experiments', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const recordPrediction = (id, data) => fetchApi(`/experiments/${id}/prediction`, {
  method: 'POST',
  body: JSON.stringify(data)
});

export const completeExperiment = (id, data) => fetchApi(`/experiments/${id}/complete`, {
  method: 'POST',
  body: JSON.stringify(data)
});
