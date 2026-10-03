
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { AiProvider } from '../../contexts/AiContext';

export function MainLayout() {
  return (
    <AiProvider>
      <div className="app-container">
        <Header />
        <main className="main-content-area">
          <Outlet />
        </main>
        <footer className="main-footer">
          <div className="footer-inner">
            <div style={{ fontWeight: 600, letterSpacing: '1px', marginBottom: '8px' }}>
              EQUILIBRIUM
            </div>
            <div style={{ marginBottom: '16px' }}>
              Interactive Science Laboratory
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              Physics &middot; Thermodynamics &middot; Chemistry
            </div>
          </div>
        </footer>
      </div>
    </AiProvider>
  );
}
