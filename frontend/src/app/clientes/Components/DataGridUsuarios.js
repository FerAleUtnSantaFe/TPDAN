import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Box, IconButton, Snackbar, Toolbar, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { SearchIconWrapper, StyledInputBase, Search } from '@/app/styles/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UsuarioModal from './UsuarioModal';

const DataGridUsuarios = ({ usuariosIniciales, setUsuariosIniciales }) => {

  const [usuarios, setUsuarios] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [usuariosModalOpen, setUsuariosModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (usuariosIniciales && Array.isArray(usuariosIniciales)) {
      const formattedData = usuariosIniciales.map((usuario, index) => ({
        tempId: usuario.id || Date.now()-index,
        id: usuario.id,
        dni: usuario.dni,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correoElectronico: usuario.correoElectronico
      }));
      setUsuarios(formattedData);
    }
  }, [usuariosIniciales]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    if (value === '') {
      // Si el campo de búsqueda está vacío, restaurar los clientes originales
      setUsuarios(usuariosIniciales);
    } else {
      const filtered = usuariosIniciales.filter(usuario =>
        usuario.dni.toLowerCase().includes(value) ||
        usuario.nombre.toLowerCase().includes(value) ||
        usuario.correoElectronico.toLowerCase().includes(value)
      );
      setUsuarios(filtered);
    }
  };

  const openUsuarioModal = (usuario = null) => {
    setUsuarioSeleccionado(usuario);
    setUsuariosModalOpen(true);
  };

  const closeUsuarioModal = () => {
    setUsuarioSeleccionado(null);
    setUsuariosModalOpen(false);
  };

  const handleAdd = (newUser) => {
 
    const newUsuario = { tempId: Date.now(), id: null, ...newUser };
    console.log(newUsuario);
    const updatedUsuarios = [...usuarios, newUsuario];
    setUsuarios(updatedUsuarios);
    setUsuariosIniciales(updatedUsuarios);
    setSnackbar({ open: true, message: 'Usuario agregado correctamente', severity: 'success' });
    closeUsuarioModal();
  };

  const handleEdit = (newUser) => {
    const updatedUsuarios = usuarios.map((usuario) =>
      usuario.tempId === usuarioSeleccionado.tempId // Comparar usando el ID temporal
        ? { ...usuarioSeleccionado, ...newUser }
        : usuario
    )
    setUsuarios(updatedUsuarios);
    setUsuariosIniciales(updatedUsuarios);
    setSnackbar({ open: true, message: 'Usuario editado correctamente', severity: 'success' });
    closeUsuarioModal();
  }

  const handleDelete = (tempId) => {
    const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar el usuario?`);
    if (!confirmDelete) return;
    const updatedUsuarios = usuarios.filter((usuario) => usuario.tempId !== tempId);
    setUsuarios(updatedUsuarios);
    setUsuariosIniciales(updatedUsuarios);
    setSnackbar({ open: true, message: 'Usuario eliminado correctamente', severity: 'success' });
  };

  const columns = [
    { field: 'dni', headerName: 'DNI', flex: 1 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'correoElectronico', headerName: 'Correo', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Opciones',
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => openUsuarioModal(params.row)}>
            <SettingsIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row.tempId)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    },
  ];

  return (
    <Box marginTop={1}>
      <AppBar position="static">
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar usuario…"
              value={searchTerm}
              onChange={handleSearch}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 'auto' }}
            startIcon={<PersonAddIcon />}
            onClick={() => openUsuarioModal()}
          >
            Nuevo
          </Button>
        </Toolbar>
      </AppBar>
      <DataGrid
        rows={usuarios}
        columns={columns}
        getRowId={(row) => row.tempId} // Usar tempId como identificador único
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
        disableMultipleRowSelection
        localeText={{
          noRowsLabel: 'No se encontraron resultados',
          MuiTablePagination: {
            labelRowsPerPage: 'Obras por página:',
          },
        }}
        sx={{
          width: '100%',
        }} />
      <UsuarioModal
        open={usuariosModalOpen}
        onClose={closeUsuarioModal}
        onAdd={handleAdd}
        onEdit={handleEdit}
        usuarioParametro={usuarioSeleccionado}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

    </Box>
  );

};

export default DataGridUsuarios;