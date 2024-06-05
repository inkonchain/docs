import React from 'react';
import { addNetwork } from './AddNetworkScript';

const AddNetworkButton = () => {
  return (
    <button
      onClick={addNetwork}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f5f5f5',
        color: '#333',
        transition: 'backgroundColor 0.3s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
    >
      Add Ink Sepolia Network
    </button>
  );
};

export default AddNetworkButton;
