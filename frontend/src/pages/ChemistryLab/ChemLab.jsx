
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { balanceEquation } from '../../services/api/chemistry';

export function ChemLab() {
  const [molecule, setMolecule] = useState('C2H5OH');
  const viewerRef = useRef(null);
  
  useEffect(() => {
    if (window.$3Dmol && viewerRef.current) {
      viewerRef.current.innerHTML = '';
      let viewer = window.$3Dmol.createViewer(viewerRef.current, { backgroundColor: 'white' });
      
      // Fetch structural data from PubChem
      fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${molecule}/SDF`)
        .then(res => res.text())
        .then(sdf => {
          viewer.addModel(sdf, 'sdf');
          viewer.setStyle({}, { stick: {} });
          viewer.zoomTo();
          viewer.render();
        })
        .catch(err => console.error("Could not fetch molecule from PubChem", err));
    }
  }, [molecule]);

  const handleBalance = async () => {
    try {
      await balanceEquation({});
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="lab-layout">
      <div className="lab-controls">
        <h2 style={{ marginBottom: '8px' }}>Chemistry Lab</h2>
        <Card title="Molecule Explorer">
          <div className="form-group">
            <label className="form-label">Enter Molecule Name or Formula</label>
            <input className="form-control" value={molecule} onChange={e => setMolecule(e.target.value)} />
          </div>
        </Card>
        
        <Card title="Equation Balancer">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Balance a chemical equation via the backend engine.
          </p>
          <Button onClick={handleBalance} style={{width: '100%'}}>Balance Equation</Button>
        </Card>
      </div>
      
      <div className="lab-workspace">
        <Card title="3D Molecule Viewer (3Dmol.js)" className="major-panel lab-visualization">
          <div ref={viewerRef} style={{ width: '100%', height: '100%' }}></div>
        </Card>
      </div>
    </div>
  );
}
