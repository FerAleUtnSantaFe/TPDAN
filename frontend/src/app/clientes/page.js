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
                    <Typography variant="h1" gutterBottom sx={{ margin: 2, textAlign: 'center' }}>
                        Gestión de clientes
                    </Typography>
                    <DataGridCliente />
                </Container>
            </ClienteProvider>
        </>
    );
}