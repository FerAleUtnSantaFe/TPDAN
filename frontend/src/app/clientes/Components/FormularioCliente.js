'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import NavBar from '@/app/Components/NavBar';
import DataGridUsuarios from './DataGridUsuarios';
import DataGridObras from './DataGridObras';
import { createCliente, updateCliente, findbyIdCliente } from '../../APIs/ClientesAPI';
import { useRouter, useSearchParams } from 'next/navigation';

const FormularioCliente = ({ modo }) => {
  const [formularioCliente, setFormularioCliente] = useState({
    id: '',
    cuit: '',
    correoElectronico: '',
    nombre: '',
    maximoDescubierto: '',
    maximoDeObras: '',
    obrasActivas: '',
    obras: [],
    usuarios: []
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (modo === 'modificar') {
      const fetchCliente = async () => {
        const id = searchParams.get('id'); // Obtiene el ID de la URL
        if (id) {
          try {
            const cliente = await findbyIdCliente(id); // Llama a la API con el ID
            if (cliente) {
              setFormularioCliente({
                cuit: cliente.cuit,
                nombre: cliente.nombre,
                correoElectronico: cliente.correoElectronico,
                maximoDescubierto: cliente.maximoDescubierto,
                maximoDeObras: cliente.maximoDeObras,
                obrasActivas: cliente.obrasActivas,
                obras: cliente.obras || [],
                usuarios: cliente.usuarios || []
              });
            } else {
              setAlert({ open: true, message: 'Cliente no encontrado', severity: 'error' });
            }
          } catch (error) {
            console.error('Error al obtener el cliente:', error);
            setAlert({ open: true, message: 'Error al cargar el cliente', severity: 'error' });
          }
        }
      };
      fetchCliente();
    }
  }, [modo, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioCliente({ ...formularioCliente, [name]: value });

    // Validar números positivos
    if (['cuit', 'maximoDescubierto', 'maximoDeObras'].includes(name) && value < 0) {
      setErrors({ ...errors, [name]: 'El valor debe ser un número positivo' });
      return;
    }
    // Limpiar el error del campo si se corrige
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formularioCliente.cuit) newErrors.cuit = 'Este campo es obligatorio';
    if (!formularioCliente.correoElectronico) newErrors.correoElectronico = 'Este campo es obligatorio';
    if (!formularioCliente.nombre) newErrors.nombre = 'Este campo es obligatorio';
    if (!formularioCliente.maximoDescubierto) newErrors.maximoDescubierto = 'Este campo es obligatorio';
    if (!formularioCliente.maximoDeObras) newErrors.maximoDeObras = 'Este campo es obligatorio';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let result;
      if (modo === 'nuevo') {
        result = await createCliente(formularioCliente); // Llama a la API para crear el cliente
      } else if (modo === 'modificar') {
        const id = searchParams.get('id'); // Obtiene el ID del cliente desde los parámetros de la URL
        result = await updateCliente(id, formularioCliente); // Llama a la API para actualizar el cliente
      }

      if (result) {
        setAlert({ open: true, message: `Cliente ${modo === 'nuevo' ? 'creado' : 'actualizado'} correctamente`, severity: 'success' });
        setTimeout(() => {
          router.push('/clientes'); // Redirige a la lista de clientes
        }, 3000);
      } else {
        setAlert({ open: true, message: `Error al ${modo === 'nuevo' ? 'crear' : 'actualizar'} el cliente`, severity: 'error' });
      }
    } catch (error) {
      console.error(`Error al ${modo === 'nuevo' ? 'crear' : 'actualizar'} el cliente:`, error);
      setAlert({ open: true, message: `Error al ${modo === 'nuevo' ? 'crear' : 'actualizar'} el cliente`, severity: 'error' });
    }
  };

  return (
    <div>
      <NavBar />
      <Container>
        <Typography variant="h3" gutterBottom color="primary" sx={{ margin: 1, textAlign: 'center' }}>
          {modo === 'nuevo' ? 'Gestión de clientes: Nuevo Cliente' : 'Gestión de clientes: Modificar Cliente'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="CUIT"
            name="cuit"
            value={formularioCliente.cuit}
            onChange={handleChange}
            margin="normal"
            error={!!errors.cuit}
            helperText={errors.cuit}
            slotProps={{
              readOnly: modo === 'modificar', // Solo lectura si es modificar
            }}
          />
          <TextField
            fullWidth
            label="Correo"
            name="correoElectronico"
            type="email"
            value={formularioCliente.correoElectronico}
            onChange={handleChange}
            margin="normal"
            error={!!errors.correoElectronico}
            helperText={errors.correoElectronico}
          />
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formularioCliente.nombre}
            onChange={handleChange}
            margin="normal"
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
          <TextField
            fullWidth
            label="Máximo Descubierto"
            name="maximoDescubierto"
            type="number"
            value={formularioCliente.maximoDescubierto}
            onChange={handleChange}
            margin="normal"
            error={!!errors.maximoDescubierto}
            helperText={errors.maximoDescubierto}
          />
          <TextField
            fullWidth
            label="Máxima Cantidad de Obras"
            name="maximoDeObras"
            type="number"
            value={formularioCliente.maximoDeObras}
            onChange={handleChange}
            margin="normal"
            error={!!errors.maximoDeObras}
            helperText={errors.maximoDeObras}
          />
          {modo === 'modificar' && (
            <TextField
              fullWidth
              label="Obras Activas"
              name="obrasActivas"
              value={formularioCliente.obrasActivas}
              margin="normal"
              slotProps={{
                readOnly: true, // Solo lectura
              }}
            />
          )}

          <DataGridUsuarios usuariosIniciales={formularioCliente.usuarios} />

          <DataGridObras obrasIniciales={formularioCliente.obras} />

          <Button type="submit" variant="contained" color="primary" size="large" sx={{ marginTop: 2 }}>
            {modo === 'nuevo' ? 'Crear' : 'Guardar'}
          </Button>
        </form>
      </Container>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default FormularioCliente;