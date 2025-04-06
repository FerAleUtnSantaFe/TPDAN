'use client';

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Box, IconButton, Snackbar, Toolbar, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';
import { SearchIconWrapper, StyledInputBase, Search } from '@/app/styles/styles';
import { useState, useEffect } from 'react';
import { cargarClientes, eliminarCliente } from '../Controllers/DataGridClienteController';

export default function DataGridCliente({ modo, onClienteSelect }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [clientes, setClientes] = useState([]);
    const [clientesOriginales, setClientesOriginales] = useState([]); // Estado para los clientes originales
    const [clienteSeleccionado, setClienteSeleccionado] = useState({});

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await cargarClientes();
                setClientes(data);
                setClientesOriginales(data); // Guardar los clientes originales
            } catch (error) {
                console.error('Error al cargar los clientes:', error);
            }
        };
        fetchClientes();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        if (value === '') {
            // Si el campo de búsqueda está vacío, restaurar los clientes originales
            setClientes(clientesOriginales);
        } else {
            // Filtrar los clientes según el término de búsqueda
            const filtered = clientesOriginales.filter(cliente =>
                cliente.cuit.toLowerCase().includes(value) ||
                cliente.nombre.toLowerCase().includes(value) ||
                cliente.correoElectronico.toLowerCase().includes(value) ||
                cliente.maximoDescubierto.toString().includes(value) ||
                cliente.maximoDeObras.toString().includes(value)
            );
            setClientes(filtered);
        }
    };

    const handleDelete = async (cliente) => {
        if (window.confirm(`¿Está seguro de que desea eliminar el cliente ${cliente.nombre}?`)) {
            const result = await eliminarCliente(cliente.id);
            if (result) {
                setSnackbar({ open: true, message: 'Cliente eliminado con éxito', severity: 'success' });
                const updatedClientes = await cargarClientes();
                setClientes(updatedClientes);
                setClientesOriginales(updatedClientes); // Actualizar los clientes originales
            } else {
                setSnackbar({ open: true, message: 'Error al eliminar el cliente en base de datos', severity: 'error' });
            }
        }
    };

    // Configuración de las columnas
    const columns = [
        { field: 'cuit', headerName: 'CUIL', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'correoElectronico', headerName: 'Correo', flex: 1 },
        { field: 'maximoDeObras', headerName: 'Obras Activas', flex: 1 },
        { field: 'maximoDescubierto', headerName: 'Descubierto', flex: 1 },
        ...(modo !== 'pedido' ? [ // Si el modo no es "pedido", agrega la columna "opciones"
            {
                field: 'opciones',
                headerName: 'Opciones',
                sortable: false,
                flex: 1,
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
            }
        ] : [])
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
                            placeholder="Buscar cliente…"
                            value={searchTerm}
                            onChange={handleSearch}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ ml: 'auto' }}
                        startIcon={modo !== 'pedido' ? <PersonAddIcon /> : <NavigateNextIcon />}
                        onClick={() => {
                            if (modo === 'pedido') {
                                if (clienteSeleccionado !== '') {
                                    onClienteSelect(clienteSeleccionado);
                                } else {
                                    setSnackbar({ open: true, message: 'Debe seleccionar un cliente para continuar', severity: 'warning' });
                                }
                            } else {
                                router.push('/clientes/nuevo');
                            }
                        }}
                    >
                        {modo === 'pedido' ? 'Siguiente' : 'Nuevo'}
                    </Button>
                </Toolbar>
            </AppBar>

            <DataGrid
                rows={clientes}
                columns={columns}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableMultipleRowSelection
                onRowSelectionModelChange={(newSelection) => {
                    setClienteSeleccionado(clientesOriginales.find(cliente => cliente.id === newSelection[0]) || {});
                }}
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