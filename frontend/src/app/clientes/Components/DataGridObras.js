import SnackbarComponent from '@/app/Components/SnackBarComponent';
import { Search, SearchIconWrapper, StyledInputBase } from '@/app/styles/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useObras } from '../Hooks/useObras';
import EstadoChip from './EstadoChip';
import ObraModal from './ObraModal';

/**
 * DataGridObras Component
 * Displays a list of "obras" (projects) in a professional, interactive data grid.
 * Allows users to search, add, edit, and delete obras.
 *
 * @param {string} modo - Determines the mode of the component ("pedido" or default).
 * @param {function} onObraSelect - Callback function to handle obra selection (used in "pedido" mode).
 */
const DataGridObras = ({ modo, onObraSelect}) => {
  // Custom hook to manage the state and logic for obras
  const {
    obras,
    snackbar,
    obraModalOpen,
    obraSeleccionada,
    searchTerm,
    modoModal,
    handleSearch,
    openObraModal,
    closeObraModal,
    handleAdd,
    handleEdit,
    handleDelete,
    closeSnackbar,
    seleccionarObra,
  } = useObras();

  // Define the columns for the DataGrid
  const columns = [
    { field: 'direccion', headerName: 'Dirección', flex: 1 },
    { field: 'lat', headerName: 'Latitud', flex: 1 },
    { field: 'lng', headerName: 'Longitud', flex: 1 },
    { field: 'presupuesto', headerName: 'Presupuesto', flex: 1 },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params) => <EstadoChip estado={params.value} />, // Use EstadoChip for estado
    },
    ...(modo !== 'pedido'
      ? [
          {
            field: 'acciones',
            headerName: 'Opciones',
            sortable: false,
            renderCell: (params) => (
              <Box>
                {/* Edit Button */}
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => openObraModal(params.row, 'modificar')}
                >
                  <SettingsIcon />
                </IconButton>
                {/* Delete Button */}
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(params.row.tempId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box marginTop={1}>
      {/* AppBar for Search and Action Buttons */}
      <AppBar position="static">
        <Toolbar>
          {/* Search Input */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar obra…"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          {/* Action Button: Add or Select Obra */}
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 'auto' }}
            startIcon={modo !== 'pedido' ? <DomainAddIcon /> : <NavigateNextIcon />}
            onClick={() => {
              if (modo === 'pedido') {
                onObraSelect(obraSeleccionada); // Select obra in "pedido" mode
              } else {
                openObraModal(null, 'nuevo'); // Open modal to add a new obra
              }
            }}
          >
            {modo === 'pedido' ? 'Siguiente' : 'Nuevo'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* DataGrid to Display Obras */}

      <DataGrid
        rows={obras}
        columns={columns}
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.tempId} // Use tempId as unique identifier
        disableMultipleRowSelection
        onRowSelectionModelChange={(ids) => {
          const selectedId = ids[0];
          const selectedObra = obras.find((obra) => obra.id === selectedId);
          seleccionarObra(selectedObra || null); // Track the selected row
      }}
        localeText={{
          noRowsLabel: 'No se encontraron resultados',
          MuiTablePagination: { labelRowsPerPage: 'Obras por página:' },
        }}
        sx={{ width: '100%' }}
      />
      {/* Modal for Adding/Editing Obras */}
      <ObraModal
        open={obraModalOpen}
        onClose={closeObraModal}
        onAdd={handleAdd}
        onEdit={handleEdit}
        obraParametro={obraSeleccionada}
        modo={modoModal}
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

export default DataGridObras;