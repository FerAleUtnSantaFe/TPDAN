import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Button, IconButton, Snackbar, Select, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import InputBase from '@mui/material/InputBase';
import { findPedidos } from '@/app/APIs/PedidosAPI';

function DataGridPedidos() {

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pedidos, setPedidos] = useState([]);
    useEffect(() => {
        cargarPedidos();
    }, []);

    async function cargarPedidos() {
        const data = await findPedidos();
        const formattedData = data.map((pedido) => ({
            id: pedido.id,
            nro_pedido: pedido.nro_pedido,
            fecha: pedido.fecha,
            cuit: pedido.cuit,
            id_obra: pedido.id_obra,
            estado: pedido.estado,
            total: pedido.total,
        }));
        setPedidos(formattedData);
    }

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = pedidos.filter(pedido =>
            pedido.cuit.toLowerCase().includes(searchTerm) ||
            pedido.estado.toLowerCase().includes(searchTerm)
        );
        setClientes(filtered);
    };

    const handleEdit = (pedido) => {
        // modal aaasheeeeeeeeeeeeeeeee de modificar el estado nomassssssssssss aaaaaaaaaaaaaaaaaaaashiiiiiiiiiiiii tomi sos alto feka
    };

    // CAMBIAR NOMBRES!!!!!!!!!!!!!!
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'nro_pedido', headerName: 'Nro Pedido', flex: 1 },
        { field: 'fecha', headerName: 'Fecha', flex: 1 },
        { field: 'cuit', headerName: 'CUIT', flex: 1 },
        { field: 'id_obra', headerName: 'ID Obra', flex: 1 },
        { field: 'estado', headerName: 'Estado', flex: 1 },
        { field: 'total', headerName: 'Total', flex: 1 },
        {
            field: 'editar', headerName: 'Editar', sortable: false, flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                </Box>
            )
        },
    ];

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Buscar por CUIL"
                            name="cuil"
                            value={searchTerm.cuil}
                            onChange={handleSearch}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledSelect
                            name="estado"
                            value={searchTerm.estado}
                            onChange={handleSearch}
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
            <DataGrid rows={pedidos} columns={columns} pageSize={5} />
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>                        
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </Box>    
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

export default DataGridPedidos;