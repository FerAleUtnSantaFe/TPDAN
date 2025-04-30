import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Box, IconButton, Toolbar, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UsuarioModal from './UsuarioModal';
import { useUsuarios } from '../Hooks/useUsuarios';
import { SearchIconWrapper, StyledInputBase, Search } from '@/app/styles/styles';
import SnackbarComponent from '@/app/Components/SnackBarComponent';

const DataGridUsuarios = () => {
  const {
    usuarios,
    snackbar,
    usuariosModalOpen,
    usuarioSeleccionado,
    handleSearch,
    openUsuarioModal,
    closeUsuarioModal,
    handleAdd,
    handleEdit,
    handleDelete,
    closeSnackbar,
  } = useUsuarios();

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
      ),
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
              placeholder="Buscar usuario..."
              onChange={(e) => handleSearch(e.target.value)}
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
        getRowId={(row) => row.tempId}
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
        disableMultipleRowSelection
        localeText={{ noRowsLabel: 'No se encontraron resultados' }}
        sx={{ width: '100%' }}
      />
      <UsuarioModal
        open={usuariosModalOpen}
        onClose={closeUsuarioModal}
        onAdd={handleAdd}
        onEdit={handleEdit}
        usuarioParametro={usuarioSeleccionado}
      />
      {/* Snackbar for Notifications */}
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Box>
  );
};

export default DataGridUsuarios;