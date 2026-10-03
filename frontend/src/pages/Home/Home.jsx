
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Thermometer, FlaskConical, ArrowRight } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">EQUILIBRIUM</h1>
        <p className="hero-subtitle">
          Understand science by experimenting.
        </p>
        
        <div className="workflow-container">
          <div className="workflow-step">Predict</div>
          <ArrowRight size={18} className="workflow-arrow" />
          <div className="workflow-step">Experiment</div>
          <ArrowRight size={18} className="workflow-arrow" />
          <div className="workflow-step">Observe</div>
          <ArrowRight size={18} className="workflow-arrow" />
          <div className="workflow-step">Compare</div>
          <ArrowRight size={18} className="workflow-arrow" />
          <div className="workflow-step" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Understand</div>
        </div>
      </section>
      
      {/* Laboratory Cards Grid */}
      <section className="lab-section">
        
        {/* Physics Card */}
        <div className="lab-card" style={{ '--card-accent': 'var(--physics-accent)' }}>
          <div className="lab-icon">
            <Zap size={32} />
          </div>
          <h2 className="lab-title">Physics Laboratory</h2>
          <p className="lab-desc">
            Explore motion, gravity, forces and trajectories through interactive experiments.
          </p>
          <ul className="lab-features">
            <li><span className="feature-dot"></span> Gravity & Free Fall</li>
            <li><span className="feature-dot"></span> Projectile Motion</li>
            <li><span className="feature-dot"></span> Motion & Forces</li>
          </ul>
          <button 
            className="lab-btn"
            onClick={() => navigate('/physics')} 
          >
            Open Physics Lab <ArrowRight size={16} />
          </button>
        </div>
        
        {/* Thermodynamics Card */}
        <div className="lab-card" style={{ '--card-accent': 'var(--thermo-accent)' }}>
          <div className="lab-icon">
            <Thermometer size={32} />
          </div>
          <h2 className="lab-title">Thermodynamics Laboratory</h2>
          <p className="lab-desc">
            Investigate temperature, pressure, volume and the behavior of gases.
          </p>
          <ul className="lab-features">
            <li><span className="feature-dot"></span> Ideal Gas</li>
            <li><span className="feature-dot"></span> Real Fluid Properties</li>
            <li><span className="feature-dot"></span> Particle Simulation</li>
          </ul>
          <button 
            className="lab-btn"
            onClick={() => navigate('/thermodynamics')} 
          >
            Open Thermodynamics <ArrowRight size={16} />
          </button>
        </div>
        
        {/* Chemistry Card */}
        <div className="lab-card" style={{ '--card-accent': 'var(--chem-accent)' }}>
          <div className="lab-icon">
            <FlaskConical size={32} />
          </div>
          <h2 className="lab-title">Chemistry Laboratory</h2>
          <p className="lab-desc">
            Explore molecular structures, 3D molecules and chemical equations.
          </p>
          <ul className="lab-features">
            <li><span className="feature-dot"></span> Molecule Explorer</li>
            <li><span className="feature-dot"></span> 3D Molecular Viewer</li>
            <li><span className="feature-dot"></span> Equation Balancer</li>
          </ul>
          <button 
            className="lab-btn"
            onClick={() => navigate('/chemistry')} 
          >
            Open Chemistry Lab <ArrowRight size={16} />
          </button>
        </div>
        
      </section>
    </div>
  );
}
