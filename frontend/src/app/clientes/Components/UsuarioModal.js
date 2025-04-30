import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';

/**
 * UsuarioModal Component
 * Handles the creation and modification of a "usuario" (user).
 * Communicates with its parent (DataGridUsuarios) to save or update the usuario.
 *
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onAdd - Function to add a new usuario.
 * @param {function} onEdit - Function to edit an existing usuario.
 * @param {object|null} usuarioParametro - The usuario to edit (null for a new usuario).
 */
const UsuarioModal = ({ open, onClose, onAdd, onEdit, usuarioParametro }) => {
  // Local state for the usuario being created or edited
  const [usuario, setUsuario] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    correoElectronico: '',
  });

  // Local state for form validation errors
  const [errors, setErrors] = useState({});

  /**
   * Initializes the usuario state when the modal opens.
   * If editing, pre-fills the form with the usuario's data.
   */
  useEffect(() => {
    if (usuarioParametro) {
      setUsuario(usuarioParametro); // Pre-fill form for editing
    } else {
      setUsuario({
        dni: '',
        nombre: '',
        apellido: '',
        correoElectronico: '',
      }); // Reset form for adding a new usuario
    }
    setErrors({}); // Clear errors when modal opens
  }, [usuarioParametro, open]);

  /**
   * Handles changes to form inputs.
   * Updates the local usuario state and clears validation errors for the field.
   *
   * @param {object} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the usuario state
    setUsuario((prev) => ({
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

    if (!usuario.dni) newErrors.dni = 'El DNI es obligatorio.';
    if (!usuario.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!usuario.apellido) newErrors.apellido = 'El apellido es obligatorio.';
    if (!usuario.correoElectronico)
      newErrors.correoElectronico = 'El correo electrónico es obligatorio.';

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

    if (usuarioParametro) {
      onEdit(usuario); // Call parent function to edit the usuario
    } else {
      onAdd(usuario); // Call parent function to add a new usuario
    }

    handleClose(); // Close the modal after submission
  };

  /**
   * Closes the modal and resets the form state.
   */
  const handleClose = () => {
    setUsuario({
      dni: '',
      nombre: '',
      apellido: '',
      correoElectronico: '',
    }); // Reset form state
    setErrors({}); // Clear errors
    onClose(); // Call parent function to close the modal
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Modal Title */}
      <DialogTitle>
        {usuarioParametro ? 'Editar Usuario' : 'Agregar Usuario'}
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent>
        {/* DNI Field */}
        <TextField
          label="DNI"
          fullWidth
          name="dni"
          type="number"
          value={usuario.dni}
          onChange={handleChange}
          margin="normal"
          error={!!errors.dni}
          helperText={errors.dni}
        />

        {/* Nombre Field */}
        <TextField
          label="Nombre"
          fullWidth
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          margin="normal"
          error={!!errors.nombre}
          helperText={errors.nombre}
        />

        {/* Apellido Field */}
        <TextField
          label="Apellido"
          fullWidth
          name="apellido"
          value={usuario.apellido}
          onChange={handleChange}
          margin="normal"
          error={!!errors.apellido}
          helperText={errors.apellido}
        />

        {/* Correo Electrónico Field */}
        <TextField
          label="Correo Electrónico"
          fullWidth
          name="correoElectronico"
          type="email"
          value={usuario.correoElectronico}
          onChange={handleChange}
          margin="normal"
          error={!!errors.correoElectronico}
          helperText={errors.correoElectronico}
        />
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {usuarioParametro ? 'Guardar' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioModal;