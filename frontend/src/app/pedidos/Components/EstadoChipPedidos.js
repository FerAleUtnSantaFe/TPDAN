import React from 'react';
import { Chip } from '@mui/material';

/**
 * EstadoChipPedidos Component
 * Renders a colored chip based on the estado value for pedidos.
 *
 * @param {string} estado - The estado value (e.g., "ACEPTADO", "CANCELADO").
 * @returns {JSX.Element} - The chip component with the appropriate color and label.
 */
const EstadoChipPedidos = ({ estado }) => {
  const estadoColors = {
    ACEPTADO: 'success',
    CANCELADO: 'error',
    EN_PREPARACION: 'warning',
    ENTREGADO: 'success',
    RECHAZADO: 'error',
    RECIBIDO: 'warning',
  };

  return (
    <Chip
      label={estado}
      color={estadoColors[estado] || 'default'}
      sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
    />
  );
};

export default EstadoChipPedidos;