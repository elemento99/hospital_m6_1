import React from 'react';
import { Alert } from 'react-bootstrap';
import { ErrorAlertProps } from '../types/components';

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Alert variant="danger" dismissible onClose={onClose}>
      {message}
    </Alert>
  );
};

export default ErrorAlert; 