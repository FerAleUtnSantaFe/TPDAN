'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material/styles';
import NavBar from "../Components/NavBar";
import { AppBar, Box, Toolbar, Button, Typography, IconButton, Snackbar, Select, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InputBase from '@mui/material/InputBase';

export default function PedidosPage() {
    const [rows, setRows] = React.useState([]);
    const [searchParams, setSearchParams] = React.useState({ cuil: '', estado: '' });
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    const handleSearchChange = (event) => {
        setSearchParams({ ...searchParams, [event.target.name]: event.target.value });
    };

    const handleEdit = (pedido) => {
        router.push(`/pedidos/modificar?id=${pedido.id}`);
    };

    const handleDelete = async (pedido) => {
        const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar el pedido ${pedido.nro_pedido}?`);
        if (!confirmDelete) return;
        try {
            setSnackbar({ open: true, message: 'Pedido eliminado con éxito', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar el pedido', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'nro_pedido', headerName: 'Nro Pedido', flex: 1 },
        { field: 'fecha', headerName: 'Fecha', flex: 1 },
        { field: 'cuil', headerName: 'CUIL', flex: 1 },
        { field: 'id_obra', headerName: 'ID Obra', flex: 1 },
        { field: 'estado', headerName: 'Estado', flex: 1 },
        { field: 'total', headerName: 'Total', flex: 1 },
        {
            field: 'opciones', headerName: 'Opciones', sortable: false, flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
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
            <NavBar />
            <Container>
                <Typography variant="h3" color='primary' gutterBottom sx={{ margin: 2, textAlign: 'center' }}>
                    Gestión de pedidos
                </Typography>
                <Box sx={{ flexGrow: 1}}>
                    <AppBar position="static">
                        <Toolbar>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Buscar por CUIL"
                                    name="cuil"
                                    value={searchParams.cuil}
                                    onChange={handleSearchChange}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledSelect
                                    name="estado"
                                    value={searchParams.estado}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar por ESTADO"
                                    displayEmpty>
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="Habilitado">Habilitado</MenuItem>
                                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                                    <MenuItem value="Finalizado">Finalizado</MenuItem>
                                </StyledSelect>
                            </Search>
                            <Button variant="contained" color="success" sx={{ ml: 'auto' }} startIcon={<AddCircleIcon />} onClick={() => router.push('/pedidos/nuevo')}> Nuevo </Button>
                        </Toolbar>
                    </AppBar>
                </Box>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    disableMultipleRowSelection
                    localeText={{
                        noRowsLabel: 'No se encontraron pedidos',
                        MuiTablePagination: { labelRowsPerPage: 'Pedidos por página:' }
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

// Estilos personalizados
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
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    color: 'inherit',
    width: '100%',    
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.15) },
    '& .MuiSelect-select': {
        padding: theme.spacing(1, 1, 1, 1),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
}));

