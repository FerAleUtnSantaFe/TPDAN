import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const UsuarioModal = ({ open, onClose, onAdd }) => {
  const [newUser, setNewUser] = useState({ dni: '', nombre: '', apellido: '', correoElectronico: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    // Limpiar el error del campo si se corrige
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!newUser.dni) newErrors.dni = true;
    if (!newUser.nombre) newErrors.nombre = true;
    if (!newUser.apellido) newErrors.apellido = true;
    if (!newUser.correoElectronico) newErrors.correoElectronico = true;
    return newErrors;
  };

  const handleAdd = () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd(newUser);
    handleClose(); // Limpia los campos y cierra el modal
  };

  const handleClose = () => {
    setNewUser({ dni: '', nombre: '', apellido: '', correoElectronico: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h3" color='primary' gutterBottom sx={{ margin: 1, textAlign: 'center' }}>Agregar Usuario</DialogTitle>
      <DialogContent>
        <TextField
          label="DNI"
          fullWidth
          name="dni"
          type="number"
          value={newUser.dni}
          onChange={handleChange}
          margin="normal"
          error={!!errors.dni}
          helperText={errors.dni ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Nombre"
          fullWidth
          name="nombre"
          value={newUser.nombre}
          onChange={handleChange}
          margin="normal"
          error={!!errors.nombre}
          helperText={errors.nombre ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Apellido"
          fullWidth
          name="apellido"
          value={newUser.apellido}
          onChange={handleChange}
          margin="normal"
          error={!!errors.apellido}
          helperText={errors.apellido ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Correo"
          fullWidth
          name="correoElectronico"
          type="email"
          value={newUser.correoElectronico}
          onChange={handleChange}
          margin="normal"
          error={!!errors.correoElectronico}
          helperText={errors.correoElectronico ? 'Este campo es obligatorio' : ''}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleAdd}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioModal;