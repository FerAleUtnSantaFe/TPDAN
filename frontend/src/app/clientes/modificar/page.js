'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Select, FormControl, InputLabel, MenuItem  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NavBar from '@/app/Components/NavBar';
import { useSearchParams } from 'next/navigation';

const ModificarCliente = () => {

  const [formData, setFormData] = useState({
    cuil: '',
    correo: '',
    nombre: '',
    maximoDescubierto: '',
    maximoObras: '',
    obras: [],
    usuarios: []
  });

  const [estado, setEstado] = useState('');
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openObraModal, setOpenObraModal] = useState(false);
  const [newUser, setNewUser] = useState({ dni: '', nombre: '', apellido: '', correo: '' });
  const [newObra, setNewObra] = useState({ direccion: '', latitud: '', longitud: '', presupuesto: '', estado: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    
    const searchParams = useSearchParams();
    const usuariosParam = searchParams.get('usuarios');
    const obrasParam = searchParams.get('obras');

    let usuarios = [];
    let obras = [];

    try {
        usuarios = usuariosParam ? JSON.parse(decodeURIComponent(usuariosParam)) : [];
        obras = obrasParam ? JSON.parse(decodeURIComponent(obrasParam)) : [];
    } catch (error) {
        console.error("Error al parsear los parámetros de URL:", error);
    }

    const usuariosConId = usuarios.map(user => ({
        ...user,
        id: user.id || Date.now() + Math.random() 
    }));
    const obrasConId = obras.map(obra => ({
        ...obra,
        id: obra.id || Date.now() + Math.random()
    }));

    setFormData({
        cuil: searchParams.get('cuil') || '',
        nombre: searchParams.get('nombre') || '',
        correo: searchParams.get('correo') || '',
        maximoDescubierto: searchParams.get('maximoDescubierto') || '',
        maximoObras: searchParams.get('maximoObras') || '',
        obras: obrasConId,
        usuarios: usuariosConId
    });
    console.log(obrasConId);
    console.log(usuariosConId);
  }, []);

  const handleEstadoChange = (event) => {
    setEstado(event.target.value);
  };

  const validateFields = (fields) => {
    let errors = {};
    Object.keys(fields).forEach(key => {
      if (!fields[key]) errors[key] = true;
    });
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleAddUser = () => {
    const newErrors = validateFields(newUser);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setFormData({ ...formData, usuarios: [...formData.usuarios, { id: Date.now(), ...newUser }] });
    cleanFormData();
    setOpenUserModal(false);
    setAlert({ open: true, message: 'Obra agregada correctamente', severity: 'success' });
  };

  const handleDeleteUser = (id) => {
    setFormData({ ...formData, usuarios: formData.usuarios.filter(user => user.id !== id) });
  };

  const handleAddObra = () => {
    const newErrors = validateFields(newObra);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setFormData({ ...formData, obras: [...formData.obras, { id: Date.now(), ...newObra }] });
    cleanFormData();
    setOpenObraModal(false);
    setAlert({ open: true, message: 'Obra agregada correctamente', severity: 'success' });
  };

  const handleDeleteObra = (id) => {
    setFormData({ ...formData, obras: formData.obras.filter(obra => obra.id !== id) });
  };

  const cleanFormData = () =>{
    setNewObra({ direccion: '', latitud: '', longitud: '', presupuesto: '', estado: '' });
    setNewUser({ dni: '', nombre: '', apellido: '', correo: '' });
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
    <div>
      <NavBar />
      <Container>
        <Typography variant="h3" gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
          Gestión de clientes: Modificar Cliente
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth slotProps={{ readOnly: true }} label="CUIL" name="cuil" value={formData.cuil} margin="normal" />
          <TextField fullWidth slotProps={{ readOnly: true }} label="Correo" name="correo" type="email" value={formData.correo} onChange={handleChange} margin="normal" />
          <TextField fullWidth slotProps={{ readOnly: true }} label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} margin="normal" />
          <TextField fullWidth slotProps={{ readOnly: true }} label="Máximo Descubierto" name="maximoDescubierto" type="number" value={formData.maximoDescubierto} onChange={handleChange} margin="normal" />
          <TextField fullWidth slotProps={{ readOnly: true }} label="Máxima Cantidad de Obras" name="maximoObras" type="number" value={formData.maximoObras} onChange={handleChange} margin="normal" />

          <Button variant="contained" color="success" startIcon={<PersonAddIcon />} onClick={() => setOpenUserModal(true)} sx={{ marginTop: 2, marginBottom: 1 }}>
            Agregar Usuario
          </Button>
          <DataGrid rows={formData.usuarios} 
            columns={[
            { field: 'dni', headerName: 'DNI', flex: 1 },
            { field: 'nombre', headerName: 'Nombre', flex: 1 },
            { field: 'apellido', headerName: 'Apellido', flex: 1 },
            { field: 'correo', headerName: 'Correo', flex: 1 },
            { field: 'acciones', headerName: '', sortable: false, renderCell: (params) => (
              <Button color="error" onClick={() => handleDeleteUser(params.row.id)}>
                <DeleteIcon />
              </Button>
            ) }
          ]} pageSize={5}
          pageSizeOptions={[5, 10, 20]}
          localeText={{
            noRowsLabel: 'No se encontraron resultados',
            MuiTablePagination: {
              labelRowsPerPage: 'Usuarios por página:',
            }
          }}
          sx={{ width: '100%' }} />

          <Button variant="contained" color="success" startIcon={<DomainAddIcon />} onClick={() => setOpenObraModal(true)} sx={{ marginTop: 2, marginBottom: 1 }}>
            Agregar Obra
          </Button>
          <DataGrid rows={formData.obras} 
            columns={[
            { field: 'direccion', headerName: 'Dirección', flex: 1 },
            { field: 'latitud', headerName: 'Latitud', flex: 1 },
            { field: 'longitud', headerName: 'Longitud', flex: 1 },
            { field: 'presupuesto', headerName: 'Presupuesto', flex: 1 },
            { field: 'estado', headerName: 'Estado', flex: 1 },
            { field: 'acciones', headerName: '', sortable: false, renderCell: (params) => (
              <Button color="error" onClick={() => handleDeleteObra(params.row.id)}>
                <DeleteIcon />
              </Button>
            ) }
          ]} pageSize={5}
          pageSizeOptions={[5, 10, 20]}
          localeText={{
            noRowsLabel: 'No se encontraron resultados',
            MuiTablePagination: {
              labelRowsPerPage: 'Obras por página:',
            }
          }}
          sx={{
                width: '100%',
          }} />

          <Button type="submit" variant="contained" color="primary" size='large' sx={{ marginTop: 2 }}>
            Crear
          </Button>
        </form>
      </Container>

      {/* Modal de Usuario */}
      <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <DialogTitle>Agregar Usuario</DialogTitle>
        <DialogContent>
          <TextField label="DNI" fullWidth name="dni" type='number' value={newUser.dni} onChange={e => setNewUser({ ...newUser, dni: e.target.value })} margin="normal"  error={!!errors.dni}/>
          <TextField label="Nombre" fullWidth name="nombre" value={newUser.nombre} onChange={e => setNewUser({ ...newUser, nombre: e.target.value })} margin="normal" error={!!errors.nombre}/>
          <TextField label="Apellido" fullWidth name="apellido" value={newUser.apellido} onChange={e => setNewUser({ ...newUser, apellido: e.target.value })} margin="normal"  error={!!errors.apellido}/>
          <TextField label="Correo" fullWidth name="correo" type="email" value={newUser.correo} onChange={e => setNewUser({ ...newUser, correo: e.target.value })} margin="normal" error={!!errors.correo}/>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => {setOpenUserModal(false), cleanFormData();}}>Cancelar</Button>
          <Button color="primary" onClick={handleAddUser}>Aceptar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Obra */}
      <Dialog open={openObraModal} onClose={() => setOpenObraModal(false)}>
        <DialogTitle>Agregar Obra</DialogTitle>
        <DialogContent>
          <TextField label="Direccion" fullWidth name="direccion" value={newObra.direccion} onChange={e => setNewObra({ ...newObra, direccion: e.target.value })} margin="normal" error={!!errors.direccion}/>
          <TextField label="Latitud" fullWidth name="latitud" type='number' value={newObra.latitud} onChange={e => setNewObra({ ...newObra, latitud: e.target.value })} margin="normal" error={!!errors.latitud}/>
          <TextField label="Longitud" fullWidth name="longitud" type='number' value={newObra.longitud} onChange={e => setNewObra({ ...newObra, longitud: e.target.value })} margin="normal" error={!!errors.longitud}/>
          <TextField label="Presupuesto" fullWidth name="presupuesto" type='number' value={newObra.presupuesto} onChange={e => setNewObra({ ...newObra, presupuesto: e.target.value })} margin="normal" error={!!errors.presupuesto}/>
          <FormControl fullWidth margin="normal" error={!!errors.estado}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={estado}
              label="Estado"
              onChange={handleEstadoChange}
            >
              <MenuItem value={1}>HABILITADA</MenuItem>
              <MenuItem value={2}>PENDIENTE</MenuItem>
              <MenuItem value={3}>FINALIZADA</MenuItem>
            </Select>
          </FormControl>        
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => {setOpenObraModal(false), cleanFormData();}}>Cancelar</Button>
          <Button color="primary" onClick={handleAddObra}>Aceptar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </div>
    </Suspense>
  );
};

export default ModificarCliente;
