'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material/styles';
import NavBar from "../Components/NavBar";
import { AppBar, Box, Toolbar, Button, Typography, TextField, IconButton, Snackbar, Select, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Container, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InputBase from '@mui/material/InputBase';
import Link from 'next/link';

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
                <Typography variant="h3" gutterBottom sx={{ margin: 2, textAlign: 'center' }}>
                    Gestión de Pedidos
                </Typography>

                <Box sx={{ flexGrow: 1, mb: 2 }}>
                    <AppBar position="static" sx={{ p: 2 }}>
                        <Toolbar>
                            <Grid container spacing={2} alignItems="center">
                                {/* Buscar por CUIL */}
                                <Grid item xs={12} sm={4} md={3}>
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
                                </Grid>

                                {/* Buscar por Estado con Select */}
                                <Grid item xs={12} sm={4} md={3}>
                                    <Search>
                                        <StyledSelect
                                            name="estado"
                                            value={searchParams.estado}
                                            onChange={handleSearchChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Buscar por Estado</MenuItem>
                                            <MenuItem value="Habilitado">Habilitado</MenuItem>
                                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                                            <MenuItem value="Finalizado">Finalizado</MenuItem>
                                        </StyledSelect>
                                    </Search>
                                </Grid>

                                {/* Botón Nuevo alineado a la derecha */}
                                <Grid item xs={12} sm={4} md={6} textAlign="right">
                                    <Link href="/pedidos/nuevo" passHref>
                                        <Button variant="contained" color="success" startIcon={<AddCircleIcon />}>
                                            Nuevo
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
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
    width: '100%',
    minWidth: 200,
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
    paddingLeft: theme.spacing(4),
    '& .MuiSelect-select': {
        padding: theme.spacing(1, 1, 1, 1),
    },
}));

