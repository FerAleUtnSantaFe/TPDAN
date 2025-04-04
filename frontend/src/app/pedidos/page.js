'use client';

import * as React from 'react';
import NavBar from "../Components/NavBar";
import { Typography } from '@mui/material';
import { Container } from '@mui/material';
import DataGridPedidos from './Components/DataGridPedidos';

export default function PedidosPage() {
    return (
        <div>
            <NavBar />
            <Container>
                <Typography variant="h3" color='primary' gutterBottom sx={{ margin: 2, textAlign: 'center' }}>
                    Gestión de pedidos
                </Typography>
                <DataGridPedidos/>
            </Container>
        </div>
    );
}
