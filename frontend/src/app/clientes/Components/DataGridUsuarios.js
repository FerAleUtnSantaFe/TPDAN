import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UsuarioModal from './UsuarioModal';

const DataGridUsuarios = ({ usuariosIniciales }) => {

  const [usuarios, setUsuarios] = React.useState(usuariosIniciales);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [usuariosModalOpen, setUsuariosModalOpen] = React.useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = React.useState(null);

  // Manejar apertura y cierre del modal
  const handleOpenModal = (usuario = null) => {
      setUsuarioSeleccionado(usuario);
      setUsuariosModalOpen(true);
  };

  const handleCloseModal = () => {
      setUsuarioSeleccionado(null);
      setUsuariosModalOpen(false);
  };

  // Manejar agregar o modificar usuario
  const handleGuardarUsuario = (usuario) => {
      if (usuarioSeleccionado) {
          // Modificar usuario existente
          setUsuarios((prevUsuarios) =>
              prevUsuarios.map((u) => (u.id === usuario.id ? usuario : u))
          );
          setSnackbar({ open: true, message: 'Usuario modificado con éxito', severity: 'success' });
      } else {
          // Agregar nuevo usuario
          setUsuarios((prevUsuarios) => [...prevUsuarios, { ...usuario, id: Date.now() }]);
          setSnackbar({ open: true, message: 'Usuario agregado con éxito', severity: 'success' });
      }
      handleCloseModal();
  };

  // Manejar eliminación de usuario
  const handleEliminarUsuario = (usuarioId) => {
      setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.id !== usuarioId));
      setSnackbar({ open: true, message: 'Usuario eliminado con éxito', severity: 'success' });
  };


  const handleAdd = (newUser) => {
    setFormularioCliente({ usuarios: [usuarios, { id: Date.now(), ...newUser }] });
    setAlert({ open: true, message: 'Usuario agregado correctamente', severity: 'success' });
  };

  const handleEdit = () => {
    
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar el usuario?`);
    if (!confirmDelete) return;

    setFormularioCliente({ ...formularioCliente, usuarios: formularioCliente.usuarios.filter(user => user.id !== id) });
    setAlert({ open: true, message: 'Usuario eliminado correctamente', severity: 'success' });
  };

  const columns = [
    { field: 'dni', headerName: 'DNI', flex: 1 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'correoElectronico', headerName: 'Correo', flex: 1 },
    {
      field: 'acciones',
      headerName: '',
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <SettingsIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
          </IconButton>
        </Box>
          )
    },
  ];

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        startIcon={<PersonAddIcon />}
        onClick={() => setOpenUserModal(true)}
        sx={{ marginTop: 2, marginBottom: 1 }}>
        Agregar Usuario
      </Button>
      <DataGrid
        rows={usuarios}
        columns={columns}
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        localeText={{
          noRowsLabel: 'No se encontraron resultados',
          MuiTablePagination: {
            labelRowsPerPage: 'Obras por página:',
          },
        }}
        sx={{
          width: '100%',
        }} />
      <UsuarioModal open={openUserModal} onClose={() => setOpenUserModal(false)} onAdd={handleAddUser} />
    </div>
  );

};

export default DataGridUsuarios;