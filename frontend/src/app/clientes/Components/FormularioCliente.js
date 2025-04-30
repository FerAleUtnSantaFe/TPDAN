'use client';

import React from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import NavBar from '@/app/Components/NavBar';
import DataGridUsuarios from './DataGridUsuarios';
import DataGridObras from './DataGridObras';
import { useFormularioCliente } from '../Hooks/useFormularioCliente';
import SnackbarComponent from '@/app/Components/SnackBarComponent';
import { useClienteContext } from '../Hooks/ClienteContext';

/*
 * FormularioCliente Component
 * Handles the creation and modification of a client.
 * @param {string} modo - Determines if the form is in "nuevo" (new) or "modificar" (edit) mode.
 */
const FormularioCliente = ({ modo }) => {
  const { clienteSeleccionado } = useClienteContext(); // Access ClienteContext
  const {
    errors,
    alert,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormularioCliente(modo);

  return (
    <>
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Container */}
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        {/* Title */}
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          align="center"
        >
          {modo === 'nuevo'
            ? 'Gestión de Clientes: Nuevo Cliente'
            : 'Gestión de Clientes: Modificar Cliente'}
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Client Details Section */}
          <Card sx={{ marginBottom: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalles del Cliente
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CUIT"
                    name="cuit"
                    value={clienteSeleccionado.cuit}
                    onChange={handleChange}
                    error={!!errors.cuit}
                    helperText={errors.cuit}
                    InputProps={{
                      readOnly: modo === 'modificar', // Read-only in edit mode
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    name="correoElectronico"
                    type="email"
                    value={clienteSeleccionado.correoElectronico}
                    onChange={handleChange}
                    error={!!errors.correoElectronico}
                    helperText={errors.correoElectronico}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={clienteSeleccionado.nombre}
                    onChange={handleChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Máximo Descubierto"
                    name="maximoDescubierto"
                    type="number"
                    value={clienteSeleccionado.maximoDescubierto}
                    onChange={handleChange}
                    error={!!errors.maximoDescubierto}
                    helperText={errors.maximoDescubierto}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Máxima Cantidad de Obras"
                    name="maximoDeObras"
                    type="number"
                    value={clienteSeleccionado.maximoDeObras}
                    onChange={handleChange}
                    error={!!errors.maximoDeObras}
                    helperText={errors.maximoDeObras}
                  />
                </Grid>
                {modo === 'modificar' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Obras Activas"
                      name="obrasActivas"
                      value={clienteSeleccionado.obrasActivas}
                      InputProps={{
                        readOnly: true, // Read-only
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Users Section */}
          <Card sx={{ marginBottom: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usuarios
              </Typography>
              <DataGridUsuarios />
            </CardContent>
          </Card>

          {/* Obras Section */}
          <Card sx={{ marginBottom: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Obras
              </Typography>
              <DataGridObras />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {modo === 'nuevo' ? 'Crear Cliente' : 'Guardar Cambios'}
          </Button>
        </form>
      </Container>

      {/* Snackbar for Notifications */}
      <SnackbarComponent
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default FormularioCliente;