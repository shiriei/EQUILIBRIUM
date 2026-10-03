
import { fetchApi } from './index';

export const calculateIdealGas = (data) => fetchApi('/thermodynamics/ideal-gas', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const calculateRealGas = (data) => fetchApi('/thermodynamics/real-gas', {
  method: 'POST',
  body: JSON.stringify(data)
});
