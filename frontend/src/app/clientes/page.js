'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material/styles';
import NavBar from "../Components/NavBar";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { findClientes, deleteCliente } from './APIs/ClientesAPI';
import { Container } from '@mui/material';

/* 
               HASTA AHORA ESTA EL CRUD ECHO, SOLO PARA DATOS CORRECTOS, FALTARIA MANEJO DE EXCEPCIONES DE BACKEND
*/

export default function ClientePage() {
    const paginationModel = { page: 0, pageSize: 5 };
    const [clientes, setClientes] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    React.useEffect(() => {
        cargarClientes();
    }, []);

    async function cargarClientes() {
        const data = await findClientes()
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
            cliente.cuit.toLowerCase().includes(value) ||
            cliente.nombre.toLowerCase().includes(value) ||
            cliente.correoElectronico.toLowerCase().includes(value) ||
            cliente.maximoDescubierto.toString().includes(value) ||
            cliente.maximoDeObras.toString().includes(value)
        );
        setClientes(filtered);
    };

    const handleEdit = (cliente) => {
        router.push(`/clientes/modificar?id=${cliente.id}`);
    };

    const handleDelete = async (cliente) => {
        const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar el cliente ${cliente.nombre}?`);
        if (!confirmDelete) return;

        try {
            await deleteCliente(cliente.cuil);
            setSnackbar({ open: true, message: 'Cliente eliminado con éxito', severity: 'success' });
            cargarClientes();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar el cliente', severity: 'error' });
        }
    };

    return (
        <div>
            <NavBar />
            <Container>
                <Typography variant="h3" color='primary' gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
                    Gestión de clientes
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
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
                            <Button variant="contained" color="success" sx={{ ml: 'auto' }} startIcon={<AddCircleIcon />} onClick={() => router.push('/clientes/nuevo')}> Nuevo </Button>
                        </Toolbar>
                    </AppBar>
                </Box>

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
                                    <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
                                        <SettingsIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )
                        },
                    ]}
                    initialState={{ pagination: { paginationModel } }}
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
            </Container>
        </div>
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
