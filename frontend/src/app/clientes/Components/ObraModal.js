import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import EstadoChip from './EstadoChip';

/**
 * ObraModal Component
 * Handles the creation and modification of an "obra" (project).
 * Includes a professional and beautiful way to update the "estado" field.
 *
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onAdd - Function to add a new obra.
 * @param {function} onEdit - Function to edit an existing obra.
 * @param {object|null} obraParametro - The obra to edit (null for a new obra).
 * @param {string} modo - The mode of the modal ("nuevo" or "modificar").
 */
const ObraModal = ({ open, onClose, onAdd, onEdit, obraParametro, modo }) => {
  // Local state for the obra being created or edited
  const [obra, setObra] = useState({
    direccion: '',
    lat: '',
    lng: '',
    presupuesto: '',
    estado: 'PENDIENTE', // Default state for new obras
  });

  // Local state for form validation errors
  const [errors, setErrors] = useState({});

  /**
   * Initializes the obra state when the modal opens.
   * If editing, pre-fills the form with the obra's data.
   */
  useEffect(() => {
    if (obraParametro) {
      setObra(obraParametro); // Pre-fill form for editing
    } else {
      setObra({
        direccion: '',
        lat: '',
        lng: '',
        presupuesto: '',
        estado: 'PENDIENTE', // Default state for new obras
      });
    }
    setErrors({}); // Clear errors when modal opens
  }, [obraParametro, open]);

  /**
   * Handles changes to form inputs.
   * Updates the local obra state and clears validation errors for the field.
   *
   * @param {object} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the obra state
    setObra((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors for the field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  /**
   * Validates the form fields to ensure all required fields are filled.
   *
   * @returns {object} - An object containing validation errors.
   */
  const validateFields = () => {
    const newErrors = {};

    if (!obra.direccion) newErrors.direccion = 'La dirección es obligatoria.';
    if (!obra.lat) newErrors.lat = 'La latitud es obligatoria.';
    if (!obra.lng) newErrors.lng = 'La longitud es obligatoria.';
    if (!obra.presupuesto) newErrors.presupuesto = 'El presupuesto es obligatorio.';

    return newErrors;
  };

  /**
   * Handles form submission.
   * Validates the form and calls the appropriate parent function (onAdd or onEdit).
   */
  const handleSubmit = () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set validation errors
      return;
    }

    if (modo === 'modificar') {
      onEdit(obra); // Call parent function to edit the obra
    } else {
      onAdd(obra); // Call parent function to add a new obra
    }

    handleClose(); // Close the modal after submission
  };

  /**
   * Closes the modal and resets the form state.
   */
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  /**
   * Determines the available options for the "estado" field based on the current estado.
   *
   * @returns {Array} - The list of available options for the "estado" field.
   */
  const getEstadoOptions = () => {
    switch (obra.estado) {
      case 'PENDIENTE':
        return ['HABILITADA', 'FINALIZADA'];
      case 'HABILITADA':
        return ['PENDIENTE', 'FINALIZADA'];
      case 'FINALIZADA':
        return []; // No options available for FINALIZADA
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Modal Title */}
      <DialogTitle>
        {modo === 'nuevo' ? 'Agregar Obra' : 'Modificar Obra'}
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent>
        {/* Dirección Field */}
        <TextField
          label="Dirección"
          fullWidth
          name="direccion"
          value={obra.direccion}
          onChange={handleChange}
          margin="normal"
          error={!!errors.direccion}
          helperText={errors.direccion}
        />

        {/* Latitud Field */}
        <TextField
          label="Latitud"
          fullWidth
          name="lat"
          type="number"
          value={obra.lat}
          onChange={handleChange}
          margin="normal"
          error={!!errors.lat}
          helperText={errors.lat}
        />

        {/* Longitud Field */}
        <TextField
          label="Longitud"
          fullWidth
          name="lng"
          type="number"
          value={obra.lng}
          onChange={handleChange}
          margin="normal"
          error={!!errors.lng}
          helperText={errors.lng}
        />

        {/* Presupuesto Field */}
        <TextField
          label="Presupuesto"
          fullWidth
          name="presupuesto"
          type="number"
          value={obra.presupuesto}
          onChange={handleChange}
          margin="normal"
          error={!!errors.presupuesto}
          helperText={errors.presupuesto}
        />

        {/* Estado Field */}
        <Box marginTop={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              label="Estado"
              value={obra.estado}
              onChange={handleChange}
              disabled={modo !== 'modificar'} // Only allow selection in "modificar" mode
              renderValue={(selected) => <EstadoChip estado={selected} />} // Render the selected chip
            >
              {getEstadoOptions().map((option) => (
                <MenuItem key={option} value={option}>
                  <EstadoChip estado={option} /> {/* Render chips as options */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {modo === 'nuevo' ? 'Agregar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ObraModal;