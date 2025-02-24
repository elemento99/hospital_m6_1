import React from 'react';
import { Spinner } from 'react-bootstrap';
import { LoadingSpinnerProps } from '../types/components';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  variant = 'primary'
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: '1rem', height: '1rem' };
      case 'lg': return { width: '3rem', height: '3rem' };
      default: return { width: '2rem', height: '2rem' };
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <Spinner
        animation="border"
        variant={variant}
        role="status"
        style={getSize()}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner; 