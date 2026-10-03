
import { fetchApi } from './index';

export const balanceEquation = (data) => fetchApi('/chemistry/balance', {
  method: 'POST',
  body: JSON.stringify(data)
});
