
import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkGemmaHealth } from '../services/api/gemma';

const AiContext = createContext();

export function AiProvider({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkGemmaHealth()
      .then(res => setStatus(res.available ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <AiContext.Provider value={{ status }}>
      {children}
    </AiContext.Provider>
  );
}

export const useAi = () => useContext(AiContext);
