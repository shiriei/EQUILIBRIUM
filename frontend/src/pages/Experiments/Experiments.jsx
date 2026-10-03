
import React from 'react';
import { Card } from '../../components/common/Card';

export function Experiments() {
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Experiment History</h1>
      <Card title="Past Experiments">
        <p style={{ color: 'var(--text-secondary)' }}>
          Your completed experiments will appear here. No experiments found.
        </p>
      </Card>
    </div>
  );
}
