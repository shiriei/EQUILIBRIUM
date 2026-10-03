
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { fetchApi } from '../../services/api';
import { getGemmaExplanation } from '../../services/api/gemma';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PLANETS = [
  { name: 'Earth', g: 9.81 },
  { name: 'Moon', g: 1.62 },
  { name: 'Mars', g: 3.71 },
  { name: 'Jupiter', g: 24.79 },
  { name: 'Custom', g: 9.81 }
];

const SHAPES = ['Sphere', 'Cube', 'Flat Plate', 'Cylinder', 'Disc'];
const SURFACES = [
  { name: 'Concrete', restitution: 0.3 },
  { name: 'Rubber', restitution: 0.8 },
  { name: 'Sand', restitution: 0.05 },
  { name: 'Custom', restitution: 0.5 }
];

export function PhysicsLab() {
  // Experiment State
  const [question, setQuestion] = useState('');
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState('Medium');
  
  // Object
  const [shape, setShape] = useState('Sphere');
  const [mass, setMass] = useState(1.0);
  const [dimension, setDimension] = useState(0.2); // generic dimension
  
  // Environment
  const [planet, setPlanet] = useState(PLANETS[0]);
  const [customG, setCustomG] = useState(9.81);
  const [height, setHeight] = useState(20.0);
  const [airResistance, setAirResistance] = useState(true);
  const [cd, setCd] = useState(0.47); // Sphere
  
  // Surface
  const [surface, setSurface] = useState(SURFACES[0]);
  const [customRestitution, setCustomRestitution] = useState(0.3);
  
  // App State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeGraph, setActiveGraph] = useState('Position');
  const [aiLoading, setAiLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  
  // Simulation
  const canvasRef = useRef(null);
  const [simTime, setSimTime] = useState(0);

  // Update Cd when shape changes
  useEffect(() => {
    if (shape === 'Sphere') setCd(0.47);
    else if (shape === 'Cube') setCd(1.05);
    else if (shape === 'Flat Plate') setCd(1.28);
    else if (shape === 'Cylinder') setCd(0.82);
    else if (shape === 'Disc') setCd(1.17);
  }, [shape]);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    setExplanation(null);
    try {
      const g = planet.name === 'Custom' ? customG : planet.g;
      const res = await fetchApi('/physics/experiment/drop', {
        method: 'POST',
        body: JSON.stringify({
          question,
          prediction,
          confidence,
          object_config: {
            shape,
            mass_kg: mass,
            dimensions: { diameter_m: dimension, width_m: dimension, radius_m: dimension/2, height_m: dimension }
          },
          environment: {
            planet: planet.name,
            gravity_mps2: g,
            air_resistance: airResistance,
            drag_coefficient: cd
          },
          initial_conditions: {
            height_m: height,
            velocity_mps: 0.0
          },
          surface: {
            surface_type: surface.name,
            restitution: surface.name === 'Custom' ? customRestitution : surface.restitution,
            friction: 0.5
          }
        })
      });
      setResult(res);
      runSimulation(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = (res) => {
    const canvas = canvasRef.current;
    if (!canvas || !res.time_series) return;
    const ctx = canvas.getContext('2d');
    
    let frame = 0;
    const times = res.time_series.time;
    const positions = res.time_series.position;
    const totalFrames = times.length;
    const startY = height;
    
    const animate = () => {
      if (frame >= totalFrames) frame = totalFrames - 1;
      const t = times[frame];
      const y = positions[frame];
      setSimTime(t);
      
      const progress = 1 - (y / startY); 
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const style = getComputedStyle(document.body);
      const borderColor = style.getPropertyValue('--border-strong').trim() || '#475569';
      const accentColor = style.getPropertyValue('--physics-accent').trim() || '#60a5fa';

      // ground
      ctx.fillStyle = borderColor;
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      
      // object
      const maxH = canvas.height - 40; 
      const drawY = 20 + (maxH * progress);
      
      ctx.fillStyle = accentColor;
      if (shape === 'Cube' || shape === 'Flat Plate') {
        ctx.fillRect(canvas.width/2 - 15, drawY - 15, 30, 30);
      } else {
        ctx.beginPath();
        ctx.arc(canvas.width/2, drawY, 15, 0, 2*Math.PI);
        ctx.fill();
      }

      if (frame < totalFrames - 1) {
        frame += Math.max(1, Math.floor(totalFrames / 150)); // speed control
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleExplain = async () => {
    setAiLoading(true);
    try {
      const g = planet.name === 'Custom' ? customG : planet.g;
      const data = await getGemmaExplanation({
        topic: "physics_drop_experiment",
        experiment: { shape, mass, height, g, airResistance, cd },
        student_prediction: prediction,
        actual_result: result
      });
      setExplanation(data.response);
    } catch (err) {
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const generateChartData = () => {
    if (!result || !result.time_series) return null;
    const ts = result.time_series;
    
    const style = getComputedStyle(document.body);
    const accent = style.getPropertyValue('--physics-accent').trim() || '#60a5fa';
    const warning = style.getPropertyValue('--warning').trim() || '#f59e0b';

    let data = [];
    let label = '';
    let color = accent;

    if (activeGraph === 'Position') {
      data = ts.position; label = 'Position (m)'; color = accent;
    } else if (activeGraph === 'Velocity') {
      data = ts.velocity; label = 'Velocity (m/s)'; color = warning;
    } else if (activeGraph === 'Acceleration') {
      data = ts.acceleration; label = 'Acceleration (m/s²)'; color = '#10b981';
    } else if (activeGraph === 'Forces') {
      return {
        labels: ts.time.map(t => t.toFixed(2)),
        datasets: [
          { label: 'Net Force (N)', data: ts.net_force, borderColor: accent },
          { label: 'Drag Force (N)', data: ts.drag_force, borderColor: warning }
        ]
      };
    }

    return {
      labels: ts.time.map(t => t.toFixed(2)),
      datasets: [
        { label, data, borderColor: color }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { point: { radius: 0 } },
    scales: {
      x: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#CBD5E1' } },
      y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#CBD5E1' } }
    },
    plugins: {
      legend: { labels: { color: '#F8FAFC' } },
      tooltip: { backgroundColor: '#172238', titleColor: '#F8FAFC', bodyColor: '#F8FAFC' }
    }
  };

  return (
    <div className="lab-layout">
      {/* LEFT: EXPERIMENT BUILDER */}
      <div className="lab-controls">
        <div>
          <h1 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.8rem', letterSpacing: '1px' }}>PHYSICS LABORATORY</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Build your own experiment.</p>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Experiment Type</label>
          <select 
            className="form-control" 
            value="free-fall" 
            onChange={() => {}}
            style={{ cursor: 'pointer' }}
          >
            <option value="free-fall">Free Fall / Drop Experiment</option>
          </select>
        </div>

        <Card title="1. Your Question">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <textarea 
              className="form-control" 
              value={question} 
              onChange={e => setQuestion(e.target.value)}
              rows="2"
              placeholder="What do you want to investigate? (e.g. Does a heavier ball fall faster?)"
            />
          </div>
        </Card>

        <Card title="2. Prediction">
          <div className="form-group">
            <textarea 
              className="form-control" 
              value={prediction} 
              onChange={e => setPrediction(e.target.value)}
              rows="3"
              placeholder="What do you predict will happen?"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confidence</label>
            <select className="form-control" value={confidence} onChange={e => setConfidence(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </Card>

        <Card title="3. Object">
          <div className="form-group">
            <label className="form-label">Shape</label>
            <select className="form-control" value={shape} onChange={e => setShape(e.target.value)}>
              {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mass (kg)</label>
            <div className="slider-container">
              <input type="range" min="0.1" max="100" step="0.1" value={mass} onChange={e => setMass(Number(e.target.value))} />
              <span className="slider-value">{mass.toFixed(1)}</span>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Primary Dimension (m)</label>
            <div className="slider-container">
              <input type="range" min="0.01" max="5.0" step="0.01" value={dimension} onChange={e => setDimension(Number(e.target.value))} />
              <span className="slider-value">{dimension.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card title="4. Environment">
          <div className="form-group">
            <label className="form-label">Planet / Gravity</label>
            <select className="form-control" value={planet.name} onChange={e => setPlanet(PLANETS.find(p => p.name === e.target.value))}>
              {PLANETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            {planet.name === 'Custom' && (
               <input type="number" className="form-control" value={customG} onChange={e => setCustomG(Number(e.target.value))} style={{marginTop: '8px'}} placeholder="Gravity (m/s²)" />
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Release Height (m)</label>
            <div className="slider-container">
              <input type="range" min="1" max="200" step="1" value={height} onChange={e => setHeight(Number(e.target.value))} />
              <span className="slider-value">{height}</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Air Resistance / Drag</label>
            <select className="form-control" value={airResistance ? 'ON' : 'OFF'} onChange={e => setAirResistance(e.target.value === 'ON')}>
              <option value="OFF">OFF</option>
              <option value="ON">ON</option>
            </select>
          </div>
          {airResistance && (
            <div className="form-group" style={{ marginBottom: 0, paddingLeft: '16px', borderLeft: '2px solid var(--border)' }}>
              <label className="form-label">Drag Coefficient (Cd)</label>
              <input type="number" className="form-control" value={cd} onChange={e => setCd(Number(e.target.value))} step="0.01" />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Auto-set based on shape, but you can override.</div>
            </div>
          )}
        </Card>

        <Card title="5. Surface / Collision">
          <div className="form-group">
            <label className="form-label">Surface Material</label>
            <select className="form-control" value={surface.name} onChange={e => setSurface(SURFACES.find(s => s.name === e.target.value))}>
              {SURFACES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
            {surface.name === 'Custom' && (
               <input type="number" className="form-control" value={customRestitution} onChange={e => setCustomRestitution(Number(e.target.value))} style={{marginTop: '8px'}} placeholder="Restitution (0-1)" step="0.1" max="1" min="0" />
            )}
          </div>
        </Card>

        <div style={{ background: 'var(--surface-panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>EXPERIMENT SUMMARY</div>
          <div>Object: {shape} ({mass.toFixed(1)} kg)</div>
          <div>Drop: {height}m on {planet.name}</div>
          <div>Air Resistance: {airResistance ? `ON (Cd=${cd})` : 'OFF'}</div>
          <div>Surface: {surface.name}</div>
        </div>

        <Button variant="primary" onClick={handleRun} disabled={loading} style={{width: '100%', padding: '16px', fontSize: '1.1rem'}}>
          {loading ? 'Running...' : 'RUN EXPERIMENT'}
        </Button>
      </div>

      {/* RIGHT: RESULTS & VISUALIZATION */}
      <div className="lab-workspace">
        <div className="panels-grid">
          <Card title="Simulation" className="major-panel lab-visualization">
            <div className="lab-visualization-content">
              <canvas ref={canvasRef} width="400" height="300" style={{ width: '100%', height: '100%' }} />
              {result && (
                <div style={{position: 'absolute', top: 20, left: 20, color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                  Time: {simTime.toFixed(2)}s
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Live Graphs" className="major-panel">
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Position', 'Velocity', 'Acceleration', 'Forces'].map(g => (
                <button 
                  key={g}
                  onClick={() => setActiveGraph(g)}
                  style={{
                    padding: '4px 12px', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border)',
                    background: activeGraph === g ? 'var(--accent)' : 'transparent',
                    color: activeGraph === g ? '#FFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <div style={{ height: '240px' }}>
              {result ? <Line data={generateChartData()} options={chartOptions} /> : <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '80px' }}>Run experiment to see graphs</div>}
            </div>
          </Card>
        </div>

        {result && (
          <Card title="Experiment Results" className="major-panel">
            <div className="panels-grid">
              
              {/* Motion Results */}
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-separator)', paddingBottom: '8px' }}>Motion</h4>
                <p style={{ marginBottom: '8px' }}>Time to impact: <span className="value-highlight">{result.time_to_impact.toFixed(3)}</span> <span className="unit-highlight">s</span></p>
                <p style={{ marginBottom: '8px' }}>Final velocity: <span className="value-highlight">{result.final_velocity.toFixed(2)}</span> <span className="unit-highlight">m/s</span></p>
                <p style={{ marginBottom: '8px' }}>Max acceleration: <span className="value-highlight">{result.max_acceleration.toFixed(2)}</span> <span className="unit-highlight">m/s²</span></p>
              </div>
              
              {/* Collision Results */}
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-separator)', paddingBottom: '8px' }}>Collision</h4>
                <p style={{ marginBottom: '8px' }}>Impact velocity: <span className="value-highlight">{result.impact_velocity.toFixed(2)}</span> <span className="unit-highlight">m/s</span></p>
                <p style={{ marginBottom: '8px' }}>Est. Bounce height: <span className="value-highlight">{result.bounce_height.toFixed(2)}</span> <span className="unit-highlight">m</span></p>
                <p style={{ marginBottom: '8px' }}>Energy lost: <span className="value-highlight">{result.energy_lost.toFixed(1)}</span> <span className="unit-highlight">J</span></p>
              </div>

            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-separator)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Prediction vs Result</h4>
              <div style={{ background: 'var(--surface-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Your Prediction</div>
                <div style={{ color: 'var(--text-primary)' }}>{prediction || "No prediction entered."}</div>
              </div>
              
              <div className="ai-panel">
                <div className="ai-badge">Explained by local Gemma AI</div>
                {!explanation ? (
                  <Button variant="primary" onClick={handleExplain} disabled={aiLoading}>
                    {aiLoading ? 'Thinking...' : 'Explain My Experiment'}
                  </Button>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', lineHeight: 1.6 }}>{explanation}</div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
