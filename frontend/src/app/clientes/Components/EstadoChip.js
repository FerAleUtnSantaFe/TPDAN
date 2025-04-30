import React from 'react';
import { Chip } from '@mui/material';

/**
 * EstadoChip Component
 * Renders a colored chip based on the estado value.
 *
 * @param {string} estado - The estado value (e.g., "PENDIENTE", "HABILITADA", "FINALIZADA").
 * @returns {JSX.Element} - The chip component with the appropriate color and label.
 */
const EstadoChip = ({ estado }) => {
  const estadoColors = {
    PENDIENTE: 'warning',
    HABILITADA: 'success',
    FINALIZADA: 'error',
  };

  return (
    <Chip
      label={estado}
      color={estadoColors[estado] || 'default'}
      sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
    />
  );
};

export default EstadoChip;