
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home/Home';
import { PhysicsLab } from './pages/PhysicsLab/PhysicsLab';
import { ThermoLab } from './pages/ThermodynamicsLab/ThermoLab';
import { ChemLab } from './pages/ChemistryLab/ChemLab';
import { Experiments } from './pages/Experiments/Experiments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="physics" element={<PhysicsLab />} />
          <Route path="thermodynamics" element={<ThermoLab />} />
          <Route path="chemistry" element={<ChemLab />} />
          <Route path="experiments" element={<Experiments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
