import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Box, IconButton, Snackbar, Toolbar, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { useState, useEffect } from 'react';
import { SearchIconWrapper, StyledInputBase, Search } from '@/app/styles/styles';
import ObraModal from './ObraModal';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const DataGridObras = ({ obrasIniciales, modo, onObraSelect }) => {

  const [obras, setObras] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [obraModalOpen, setObraModalOpen] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState({});
  const [obrasOriginales, setObrasOriginales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (obrasIniciales && Array.isArray(obrasIniciales)) {
      const formattedData = obrasIniciales.map((obra) => ({
        id: obra.id,
        direccion: obra.direccion,
        lat: obra.lat,
        lng: obra.lng,
        presupuesto: obra.presupuesto,
        estado: obra.estado
      }));
      setObras(formattedData);
      setObrasOriginales(formattedData); // Guardar las obras originales
    }
  }, [obrasIniciales]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === '') {
      // Si el campo de búsqueda está vacío, restaurar los clientes originales
      setObras(obrasOriginales);
    } else {
      const filtered = obrasOriginales.filter(obra =>
        obra.direccion.toLowerCase().includes(value) ||
        obra.lat.toString().includes(value) ||
        obra.lng.toString().includes(value) ||
        obra.presupuesto.toString().includes(value) ||
        obra.estado.toLowerCase().includes(value)
      );
      setObras(filtered);
    }
  };

  const openObraModal = (obra = null) => {
    setObraSeleccionada(obra);
    setObraModalOpen(true);
  };

  const closeObraModal = () => {
    setObraSeleccionada(null);
    setObraModalOpen(false);
  };

  const handleAdd = (nuevaObra) => {
    setObras(obras => [...obras, { id: Date.now(), ...nuevaObra }]);
    setSnackbar({ open: true, message: 'Obra agregada correctamente', severity: 'success' });
    closeObraModal();
  };

  const handleEdit = (obraEditada) => {
    setObras(obras => obras.map(obra => obra.id === obraSeleccionada.id ? { ...obraSeleccionada, ...obraEditada } : obra));
    setSnackbar({ open: true, message: 'Obra editada correctamente', severity: 'success' });
    closeObraModal();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar esta obra?');
    if (!confirmDelete) return;
    setObras(obras => obras.filter(obra => obra.id !== id));
    setObrasOriginales(obras => obras.filter(obra => obra.id !== id));
    setSnackbar({ open: true, message: 'Obra eliminada correctamente', severity: 'success' });
  };

  const columns = [
    { field: 'direccion', headerName: 'Dirección', flex: 1 },
    { field: 'lat', headerName: 'Latitud', flex: 1 },
    { field: 'lng', headerName: 'Longitud', flex: 1 },
    { field: 'presupuesto', headerName: 'Presupuesto', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    ...(modo !== 'pedido' ? [{
      field: 'acciones',
      headerName: 'Opciones',
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => openObraModal(params.row)}>
            <SettingsIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }] : []),
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
              placeholder="Buscar obra…"
              value={searchTerm}
              onChange={handleSearch}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 'auto' }}
            startIcon={modo !== 'pedido' ? <DomainAddIcon /> : <NavigateNextIcon />}
            onClick={() => {
              if (modo === 'pedido') {
                onObraSelect();
              } else {
                openObraModal();
              }
            }}
          >
            {modo === 'pedido' ? 'Siguiente' : 'Nuevo'}
          </Button>
        </Toolbar>
      </AppBar>
      <DataGrid
        rows={obras}
        columns={columns}
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableMultipleRowSelection
        localeText={{
          noRowsLabel: 'No se encontraron resultados',
          MuiTablePagination: {
            labelRowsPerPage: 'Obras por página:',
          },
        }}
        sx={{ width: '100%' }}
      />
      <ObraModal
        open={obraModalOpen}
        onClose={closeObraModal}
        onAdd={handleAdd}
        onEdit={handleEdit}
        obraParametro={obraSeleccionada}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default DataGridObras;
