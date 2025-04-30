'use client'

import React from 'react';
import NavBar from "../Components/NavBar";
import { Container, Typography } from '@mui/material';
import DataGridCliente from './Components/DataGridCliente';
import { ClienteProvider } from './Hooks/ClienteContext';

export default function ClientePage() {

    return (
        <>
            <ClienteProvider>
                <NavBar />
                <Container>
                    <Typography variant="h3" color='primary' gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
                        Gestión de clientes
                    </Typography>
                    <DataGridCliente />
                </Container>
            </ClienteProvider>
        </>
    );
}