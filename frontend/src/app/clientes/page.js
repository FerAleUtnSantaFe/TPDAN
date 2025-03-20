'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
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
import { fetchClientes } from './ClientesAPI';

const columns = [
    { field: 'pos', headerName: 'posicion', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'opciones', headerName: 'Opciones', sortable: false, width: 100,
        renderCell: (params) => (
            <Box>
                <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => handleEdit(params.row)}
                >
                    <SettingsIcon />
                </IconButton>
                <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(params.row.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        )
    },
];


export default function ClientePage() {

    const paginationModel = { page: 0, pageSize: 5 };

    const [rows, setRows] = React.useState([]);
    
    async function clientesFetch() {
        const data = await fetchClientes();
        const formattedData = data.map((cliente, index) => ({
            id: index + 1, // Necesario para DataGrid
            pos: index + 1,
            nombre: cliente.nombre,
            email: cliente.email,
        }));
        setRows(formattedData);
    }
    
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        minWidth: 200,
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
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
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
      }));

    return (
        <Paper sx={{ 
            width: '100%', 
            p: 2, 
            minHeight: 300, 
            height: rows.length > 0 ? 400 + rows.length * 30 : 500, // Se ajusta dinámicamente
            transition: 'height 0.3s ease-in-out'
            }}>
          <NavBar/>
          <Typography variant="h3" gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
            Gestion de clientes
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
                </Toolbar>
            </AppBar>
          </Box>

          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
      );
}

