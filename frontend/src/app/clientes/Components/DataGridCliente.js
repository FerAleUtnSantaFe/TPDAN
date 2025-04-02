import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Box, IconButton, Snackbar, Toolbar, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { deleteCliente, findClientes } from '../APIs/ClientesAPI';
import { useRouter } from 'next/navigation';

export default function DataGridCliente() {

    const router = useRouter();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [clientes, setClientes] = React.useState([]);

    React.useEffect(() => {
        cargarClientes();
    }, []);

    async function cargarClientes() {
        const data = await findClientes();
        const formattedData = data.map((cliente) => ({
            id: cliente.id,
            cuit: cliente.cuit,
            nombre: cliente.nombre,
            correoElectronico: cliente.correoElectronico,
            maximoDescubierto: cliente.maximoDescubierto,
            maximoDeObras: cliente.maximoDeObras,
        }));
        setClientes(formattedData);
    }

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = clientes.filter(cliente =>
            cliente.cuit.toLowerCase().includes(searchTerm) ||
            cliente.nombre.toLowerCase().includes(searchTerm) ||
            cliente.correoElectronico.toLowerCase().includes(searchTerm) ||
            cliente.maximoDescubierto.toString().includes(searchTerm) ||
            cliente.maximoDeObras.toString().includes(searchTerm)
        );
        setClientes(filtered);
    };

    const handleDelete = async (cliente) => {
        const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar el cliente ${cliente.nombre}?`);
        if (!confirmDelete) return;
 
        try {
            const result = await deleteCliente(cliente.id);
            if (result) {
                setSnackbar({ open: true, message: 'Cliente eliminado con éxito', severity: 'success' });
                await cargarClientes();
            } else {
                setSnackbar({ open: true, message: 'Error al eliminar el cliente en base de datos', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar el cliente', severity: 'error' });
        }
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Buscar cliente…"
                            value={searchTerm}
                            onChange={handleSearch}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Button variant="contained" color="success" sx={{ ml: 'auto' }} startIcon={<AddCircleIcon />} onClick={() => router.push('/clientes/nuevo')}>
                        Nuevo
                    </Button>
                </Toolbar>
            </AppBar>


            <DataGrid
                rows={clientes}
                columns={[
                    { field: 'cuit', headerName: 'CUIL', flex: 1 },
                    { field: 'nombre', headerName: 'Nombre', flex: 1 },
                    { field: 'correoElectronico', headerName: 'Correo', flex: 1 },
                    { field: 'maximoDeObras', headerName: 'Obras Activas', flex: 1 },
                    { field: 'maximoDescubierto', headerName: 'Descubierto', flex: 1 },
                    {
                        field: 'opciones', headerName: 'Opciones', sortable: false, flex: 1,
                        renderCell: (params) => (
                            <Box>
                                <IconButton size="small" color="primary" onClick={() => router.push(`/clientes/modificar?id=${params.row.id}`)}>
                                    <SettingsIcon />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )
                    },
                ]}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableMultipleRowSelection
                localeText={{
                    noRowsLabel: 'No se encontraron resultados',
                    MuiTablePagination: { labelRowsPerPage: 'Clientes por página:' }
                }}
                sx={{ width: '100%' }}
            />

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
    marginLeft: 0,
    width: '100%',
    minWidth: 200,
    [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(1), width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: { width: '12ch', '&:focus': { width: '20ch' } },
    },
}));