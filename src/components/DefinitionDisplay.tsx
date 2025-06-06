import React from 'react';

interface DefinitionDisplayProps {
  definition: string;
  onCancel?: () => void;
  onAdd?: () => void;
}

const DefinitionDisplay: React.FC<DefinitionDisplayProps> = ({ definition, onCancel, onAdd }) => {
  return (
    <div>
      <h2>Generated description:</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p>{definition}</p>
        <button onClick={onAdd}>Add</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default DefinitionDisplay;
