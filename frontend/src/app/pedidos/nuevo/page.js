'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material/styles';
import NavBar from "../../Components/NavBar";
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
import { fetchClientes, deleteCliente } from '../../clientes/APIs/ClientesAPI';
import Link from 'next/link';
import { Container } from '@mui/material';

export default function PedidosPage() {
    const paginationModel = { page: 0, pageSize: 5 };
    const [rows, setRows] = React.useState([]);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    const columns = [
        { field: 'cuil', headerName: 'CUIL', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'correo', headerName: 'Correo', flex: 1 },
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
    ];

    const handleEdit = (cliente) => {
        const queryString = new URLSearchParams({
            cuil: cliente.cuil,
            nombre: cliente.nombre,
            correo: cliente.correo,
            maximoDescubierto: cliente.maximoDescubierto,
            maximoObras: cliente.maximoObras,
            obras: JSON.stringify(cliente.obras),
            usuarios: JSON.stringify(cliente.usuarios)
        }).toString();

        router.push(`/clientes/modificar?${queryString}`);
    };

    async function clientesFetch() {
        const data = await fetchClientes();
        const formattedData = data.map((cliente, index) => ({
            id: index + 1,
            cuil: cliente.cuil,
            nombre: cliente.nombre,
            correo: cliente.correo,
            maximoDescubierto: cliente.maximoDescubierto,
            maximoObras: cliente.maximoObras,
            obras: cliente.obras,
            usuarios: cliente.usuarios,
        }));
        setRows(formattedData);
    }

    const handleDelete = async (cliente) => {
        const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar el cliente con CUIL: ${cliente.cuil} y Nombre: ${cliente.nombre}?`);
        if (!confirmDelete) return;

        try {
            const data = await deleteCliente(cliente.cuil);
            setSnackbar({ open: true, message: 'Cliente eliminado con éxito', severity: 'success' });
            const formattedData = data.map((cliente, index) => ({
              id: index + 1,
              cuil: cliente.cuil,
              nombre: cliente.nombre,
              correo: cliente.correo,
              maximoDescubierto: cliente.maximoDescubierto,
              maximoObras: cliente.maximoObras,
              obras: cliente.obras,
              usuarios: cliente.usuarios,
          }));
          setRows(formattedData);
            
          //  clientesFetch(); // Recargar lista de clientes
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar el cliente', severity: 'error' });
        }
    };

    return (
        <div>
            <NavBar />
            <Container>
                <Typography variant="h3" gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
                    Gestión de pedidos
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
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                            <Button variant="contained" sx={{ ml: 'auto' }} onClick={clientesFetch}>Buscar</Button>
                            <Link href="/clientes/nuevo" passHref>
                                <Button variant="contained" color="success" sx={{ ml: '1rem' }}> Nuevo </Button>
                            </Link>
                        </Toolbar>
                    </AppBar>
                </Box>

                <DataGrid
                    rows={rows}
                    columns={columns}
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

                {/* Snackbar para mostrar mensajes */}
                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </MuiAlert>
                </Snackbar>
            </Container>
        </div>
    );
}

// Estilos para la barra de búsqueda
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