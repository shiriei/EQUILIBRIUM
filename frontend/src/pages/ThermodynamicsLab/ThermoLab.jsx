
import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { calculateIdealGas, calculateRealGas } from '../../services/api/thermo';
import { getGemmaExplanation } from '../../services/api/gemma';

export function ThermoLab() {
  const [pressure, setPressure] = useState(101325); // Pa
  const [temperature, setTemperature] = useState(298); // K
  const [volume, setVolume] = useState(1.0); // m^3
  const [moles, setMoles] = useState(40.87); // mol
  
  const [loading, setLoading] = useState(false);
  const [realDensity, setRealDensity] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const handleIdealGas = async (solveFor) => {
    setLoading(true);
    try {
      const payload = { 
        pressure: solveFor === 'P' ? null : pressure,
        volume: solveFor === 'V' ? null : volume,
        temperature: solveFor === 'T' ? null : temperature,
        moles: solveFor === 'n' ? null : moles
      };
      const res = await calculateIdealGas(payload);
      setPressure(res.pressure);
      setVolume(res.volume);
      setTemperature(res.temperature);
      setMoles(res.moles);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRealGas = async () => {
    try {
      const res = await calculateRealGas({ fluid: 'Air', temperature, pressure });
      setRealDensity(res.density);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExplain = async () => {
    try {
      const res = await getGemmaExplanation({
        topic: "thermodynamics",
        experiment: { pressure, volume, temperature, moles },
        student_prediction: "N/A",
        actual_result: { ideal_density: (moles*0.02897)/volume, real_density: realDensity }
      });
      setExplanation(res.response);
    } catch(err) {
      alert(err.message);
    }
  };

  return (
    <div className="lab-layout">
      <div className="lab-controls">
        <h2 style={{ marginBottom: '8px' }}>Thermodynamics Lab</h2>
        <Card title="Ideal Gas Law (PV = nRT)">
          <div className="form-group">
            <label className="form-label">Pressure (Pa)</label>
            <input type="number" className="form-control" value={pressure} onChange={e => setPressure(Number(e.target.value))} />
            <Button onClick={() => handleIdealGas('P')} style={{marginTop: '4px', width: '100%'}}>Solve for P</Button>
          </div>
          <div className="form-group">
            <label className="form-label">Volume (m³)</label>
            <input type="number" className="form-control" value={volume} onChange={e => setVolume(Number(e.target.value))} />
            <Button onClick={() => handleIdealGas('V')} style={{marginTop: '4px', width: '100%'}}>Solve for V</Button>
          </div>
          <div className="form-group">
            <label className="form-label">Temperature (K)</label>
            <input type="number" className="form-control" value={temperature} onChange={e => setTemperature(Number(e.target.value))} />
            <Button onClick={() => handleIdealGas('T')} style={{marginTop: '4px', width: '100%'}}>Solve for T</Button>
          </div>
          <div className="form-group">
            <label className="form-label">Moles (mol)</label>
            <input type="number" className="form-control" value={moles} onChange={e => setMoles(Number(e.target.value))} />
            <Button onClick={() => handleIdealGas('n')} style={{marginTop: '4px', width: '100%'}}>Solve for n</Button>
          </div>
        </Card>
      </div>
      
      <div className="lab-workspace">
        <Card title="Ideal vs Real Gas Comparison" className="major-panel">
          <div style={{ marginBottom: '24px' }}>
            <p>Ideal Gas Density (Approx Air): <span className="value-highlight">{((moles * 0.02897) / volume).toFixed(4)}</span><span className="unit-highlight">kg/m³</span></p>
            <Button variant="primary" onClick={handleRealGas} style={{marginTop: '16px'}}>Calculate Real Fluid Density (CoolProp)</Button>
            {realDensity && <p style={{ marginTop: '16px' }}>Real Gas Density (Air): <span className="value-highlight">{realDensity.toFixed(4)}</span><span className="unit-highlight">kg/m³</span></p>}

          </div>
          
          {realDensity && (
            <div className="ai-panel" style={{ padding: '16px', borderRadius: '8px' }}>
              <div className="ai-badge">Explained by local Gemma AI</div>
              {!explanation ? (
                <Button variant="primary" onClick={handleExplain}>Explain Ideal vs Real Difference</Button>
              ) : (
                <p style={{ whiteSpace: 'pre-wrap' }}>{explanation}</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
