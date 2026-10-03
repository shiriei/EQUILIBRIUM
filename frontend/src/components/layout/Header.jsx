
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAi } from '../../contexts/AiContext';
import { Sun, Moon, Atom } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { status } = useAi();
  
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <Atom size={28} color="var(--accent)" /> EQUILIBRIUM
        </div>
        
        <nav className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/physics" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Physics</NavLink>
          <NavLink to="/thermodynamics" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Thermodynamics</NavLink>
          <NavLink to="/chemistry" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Chemistry</NavLink>
          <NavLink to="/experiments" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Experiments</NavLink>
        </nav>
        
        <div className="navbar-actions">
          <div className={`ai-status-badge ${status === 'online' ? 'online' : 'offline'}`}>
            <span className="ai-status-dot"></span>
            {status === 'online' ? 'Local AI Ready' : 'Local AI Offline'}
          </div>
          
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
