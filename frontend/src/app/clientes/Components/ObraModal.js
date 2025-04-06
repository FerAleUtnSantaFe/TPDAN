import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ObraModal = ({ open, onClose, onAdd, onEdit, obraParametro}) => {
  const [obra, setObra] = useState({ direccion: '', lat: '', lng: '', presupuesto: '', estado: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (obraParametro) {
      setObra(obraParametro);
    } else {
      setObra({ direccion: '', lat: '', lng: '', presupuesto: '', estado: '' });
    }
    setErrors({});
  }, [obraParametro, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObra({ ...obra, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!obra.direccion) newErrors.direccion = true;
    if (!obra.lat) newErrors.lat = true;
    if (!obra.lng) newErrors.lng = true;
    if (!obra.presupuesto) newErrors.presupuesto = true;
    if (!obra.estado) newErrors.estado = true;
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (obraParametro) {
      onEdit(obra);
    } else {
      onAdd(obra);
    }
    handleClose();
  };

  const handleClose = () => {
    setObra({ direccion: '', lat: '', lng: '', presupuesto: '', estado: '' });
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
          value={obra.direccion}
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
          value={obra.lat}
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
          value={obra.lng}
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
          value={obra.presupuesto}
          onChange={handleChange}
          margin="normal"
          error={!!errors.presupuesto}
          helperText={errors.presupuesto ? 'Este campo es obligatorio' : ''}
        />
        <FormControl fullWidth margin="normal" error={!!errors.estado}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={obra.estado}
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
        <Button color="primary" onClick={handleSubmit}>
        {obraParametro ? 'Guardar' : 'Aceptar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ObraModal;