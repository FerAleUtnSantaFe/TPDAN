import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * SnackBar Component
 * Displays notifications with different severities.
 * @param {boolean} open - Whether the snackbar is open.
 * @param {string} message - The message to display.
 * @param {string} severity - The severity of the alert ('success', 'warning', 'error').
 * @param {function} onClose - Function to close the snackbar.
 */
const SnackbarComponent = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;