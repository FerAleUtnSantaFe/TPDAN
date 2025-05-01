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
import { findPedidos, updatePedido } from '@/app/APIs/PedidosAPI';
import EstadoChipPedidos from './EstadoChipPedidos';
import EstadoModalPedidos from './EstadoPedidoModal';

function DataGridPedidos() {

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pedidos, setPedidos] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState(null); // Track the selected pedido for editing
    const [modalOpen, setModalOpen] = useState(false); // Track the modal state

    useEffect(() => {
        cargarPedidos();
    }, []);

    async function cargarPedidos() {
        const data = await findPedidos();
        const formattedData = data.map((pedido) => ({
            id: pedido.id,
            numeroPedido: pedido.numeroPedido,
            fecha: pedido.fecha,
            cliente: pedido.cliente,
            obra: pedido.obra,
            estado: pedido.estado,
            total: pedido.total,
        }));
        setPedidos(formattedData);
    }

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = pedidos.filter(pedido =>
            pedido.cliente.toLowerCase().includes(searchTerm) ||
            pedido.estado.toLowerCase().includes(searchTerm)
        );
        setPedidos(filtered);
    };

    const handleEdit = (pedido) => {
        setSelectedPedido(pedido); // Set the selected pedido
        setModalOpen(true); // Open the modal
    };

    const handleSaveEstado = async (newEstado) => {
        try {
            const updatedPedido = await updatePedido(selectedPedido.id, { estado: newEstado });
            setPedidos((prevPedidos) =>
                prevPedidos.map((p) => (p.id === selectedPedido.id ? { ...p, estado: newEstado } : p))
            );
            setSnackbar({ open: true, message: `Estado actualizado a ${newEstado}`, severity: 'success' });
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
            setSnackbar({ open: true, message: 'Error al actualizar el estado', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'numeroPedido', headerName: 'Nro Pedido', flex: 1 },
        { field: 'fecha', headerName: 'Fecha', flex: 1 },
        { field: 'cliente', headerName: 'ID cliente', flex: 1 },
        { field: 'obra', headerName: 'ID Obra', flex: 1 },
        {
            field: 'estado',
            headerName: 'Estado',
            flex: 1,
            renderCell: (params) => <EstadoChipPedidos estado={params.value} />, // Use EstadoChipPedidos
        },
        { field: 'total', headerName: 'Total', flex: 1 },
        {
            field: 'editar',
            headerName: 'Editar',
            sortable: false,
            flex: 1,
            renderCell: (params) => (
                <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <>
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
                            <MenuItem value="ACEPTADO">ACEPTADO</MenuItem>
                            <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                            <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                            <MenuItem value="EN_PREPARACION">EN_PREPARACION</MenuItem>
                            <MenuItem value="ENTREGADO">ENTREGADO</MenuItem>
                            <MenuItem value="RECIBIDO">RECIBIDO</MenuItem>
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
            {selectedPedido && (
                <EstadoModalPedidos
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveEstado}
                    currentEstado={selectedPedido.estado}
                    availableEstados={
                        selectedPedido.estado === 'ACEPTADO'
                            ? ['CANCELADO']
                            : selectedPedido.estado === 'EN_PREPARACION'
                                ? ['ENTREGADO', 'CANCELADO']
                                : []
                    }
                />
            )}
        </>
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