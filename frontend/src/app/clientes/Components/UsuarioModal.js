import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const UsuarioModal = ({ open, onClose, onAdd, onEdit, usuarioParametro }) => {
  const [usuario, setUsuario] = useState({ dni: '', nombre: '', apellido: '', correoElectronico: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (usuarioParametro) {
      setUsuario(usuarioParametro);
    } else {
      setUsuario({ dni: '', nombre: '', apellido: '', correoElectronico: '' });
    }
    setErrors({});
  }, [usuarioParametro, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!usuario.dni) newErrors.dni = true;
    if (!usuario.nombre) newErrors.nombre = true;
    if (!usuario.apellido) newErrors.apellido = true;
    if (!usuario.correoElectronico) newErrors.correoElectronico = true;
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (usuarioParametro) {
      onEdit(usuario);
    } else {
      onAdd(usuario);
    }
    handleClose();
  };

  const handleClose = () => {
    setUsuario({ dni: '', nombre: '', apellido: '', correoElectronico: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h3" color='primary' gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
        {usuarioParametro ? 'Editar Usuario' : 'Agregar Usuario'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="DNI"
          fullWidth
          name="dni"
          type="number"
          value={usuario.dni}
          onChange={handleChange}
          margin="normal"
          error={!!errors.dni}
          helperText={errors.dni ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Nombre"
          fullWidth
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          margin="normal"
          error={!!errors.nombre}
          helperText={errors.nombre ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Apellido"
          fullWidth
          name="apellido"
          value={usuario.apellido}
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
          value={usuario.correoElectronico}
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
        <Button color="primary" onClick={handleSubmit}>
          {usuario ? 'Guardar' : 'Aceptar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioModal;