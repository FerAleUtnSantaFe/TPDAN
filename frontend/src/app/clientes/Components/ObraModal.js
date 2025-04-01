import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ObraModal = ({ open, onClose, onAdd }) => {
  const [newObra, setNewObra] = useState({ direccion: '', lat: '', lng: '', presupuesto: '', estado: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewObra({ ...newObra, [name]: value });

    // Limpiar el error del campo si se corrige
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!newObra.direccion) newErrors.direccion = true;
    if (!newObra.lat) newErrors.lat = true;
    if (!newObra.lng) newErrors.lng = true;
    if (!newObra.presupuesto) newErrors.presupuesto = true;
    if (!newObra.estado) newErrors.estado = true;
    return newErrors;
  };

  const handleAdd = () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd(newObra);
    handleClose(); // Limpia los campos y cierra el modal
  };

  const handleClose = () => {
    setNewObra({ direccion: '', lat: '', lng: '', presupuesto: '', estado: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h3" color="primary" gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
        Agregar Obra
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Dirección"
          fullWidth
          name="direccion"
          value={newObra.direccion}
          onChange={handleChange}
          margin="normal"
          error={!!errors.direccion}
          helperText={errors.direccion ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Latitud"
          fullWidth
          name="lat"
          type="number"
          value={newObra.lat}
          onChange={handleChange}
          margin="normal"
          error={!!errors.lat}
          helperText={errors.lat ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Longitud"
          fullWidth
          name="lng"
          type="number"
          value={newObra.lng}
          onChange={handleChange}
          margin="normal"
          error={!!errors.lng}
          helperText={errors.lng ? 'Este campo es obligatorio' : ''}
        />
        <TextField
          label="Presupuesto"
          fullWidth
          name="presupuesto"
          type="number"
          value={newObra.presupuesto}
          onChange={handleChange}
          margin="normal"
          error={!!errors.presupuesto}
          helperText={errors.presupuesto ? 'Este campo es obligatorio' : ''}
        />
        <FormControl fullWidth margin="normal" error={!!errors.estado}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={newObra.estado}
            onChange={handleChange}
          >
            <MenuItem value="HABILITADA">HABILITADA</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="FINALIZADA">FINALIZADA</MenuItem>
          </Select>
          {errors.estado && <p style={{ color: 'red', fontSize: '0.8rem' }}>Este campo es obligatorio</p>}
        </FormControl>
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

export default ObraModal;