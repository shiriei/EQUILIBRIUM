
import { fetchApi } from './index';

export const calculateFreeFall = (data) => fetchApi('/physics/free-fall', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const calculateProjectile = (data) => fetchApi('/physics/projectile', {
  method: 'POST',
  body: JSON.stringify(data)
});
