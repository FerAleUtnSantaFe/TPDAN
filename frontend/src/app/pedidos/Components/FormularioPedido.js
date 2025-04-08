'use client';

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert, List, ListItem, ListItemText } from '@mui/material';
import { createPedido } from '@/app/APIs/PedidosAPI';
import { useRouter } from 'next/navigation';


const FormularioPedido = ({ cliente, obra, listaProductos }) => {
    const router = useRouter();
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [pedido, setPedido] = useState({
        fecha: new Date().toISOString(),
        numeroPedido: Math.floor(Math.random() * 1000000), // Genera un número de pedido aleatorio
        usuario: 'Usuario Actual', // Cambiar por el usuario actual
        observaciones: 'Sin observaciones',
        total: listaProductos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0), // Calcula el total
        estadosPedido: [],
        estado: 'ACEPTADO',
        obra: obra,
        cliente: cliente,
        listaProductos: listaProductos,
    });


    const handleFinalizar = async () => {
        try {
            const pedidoData = {
                ...pedido,
                cliente: cliente.id.toString(), // Asegúrate de que el ID del cliente sea una cadena
                obra: obra.id.toString(), // Asegúrate de que el ID de la obra sea una cadena
                listaProductos: listaProductos.map(producto => ({ id: producto.id.toString() , cantidad: producto.cantidad, precio: producto.precio })), // Asegúrate de que la lista de productos tenga el formato correcto
            };

            console.log('Datos y formato del pedido:'); // Verifica los datos del pedido antes de enviarlos
            console.log(pedidoData); // Verifica los datos del pedido antes de enviarlos
            const result = await createPedido(pedidoData); // Llama a la API para crear el pedido
            if (result) {
                setAlert({ open: true, message: 'Pedido creado correctamente', severity: 'success' });
                setTimeout(() => {
                    router.push('/pedidos'); // Redirige a la lista de clientes
                }, 3000);
            } else {
                setAlert({ open: true, message: 'Error al crear el pedido', severity: 'error' });
            }
        } catch (error) {
            console.error('Error al crear el pedido', error);
            setAlert({ open: true, message: 'Error crear el pedido', severity: 'error' });
        }
    };

    return (
        <div>
            <Container>
                <Typography variant="h3" gutterBottom color="primary" sx={{ margin: 1, textAlign: 'center' }}>
                    Detalle del Pedido
                </Typography>

                {/* Información del Cliente */}
                <Typography variant="h5" gutterBottom color="secondary">
                    Información del Cliente
                </Typography>
                <TextField
                    fullWidth
                    label="Nombre"
                    value={cliente.nombre}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="CUIT"
                    value={cliente.cuit}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Correo Electrónico"
                    value={cliente.correoElectronico}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />

                {/* Información de la Obra */}
                <Typography variant="h5" gutterBottom color="secondary" sx={{ marginTop: 3 }}>
                    Información de la Obra
                </Typography>
                <TextField
                    fullWidth
                    label="ID de la Obra"
                    value={obra.id}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Dirección"
                    value={obra.direccion}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />

                {/* Lista de Productos */}
                <Typography variant="h5" gutterBottom color="secondary" sx={{ marginTop: 3 }}>
                    Productos
                </Typography>
                <List>
                    {(Array.isArray(listaProductos) ? listaProductos : []).map((producto, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`${producto.nombre} - Cantidad: ${producto.cantidad}`}
                                secondary={`Precio: $${producto.precio}`}
                            />
                        </ListItem>
                    ))}
                </List>

                {/* Información del Pedido */}
                <Typography variant="h5" gutterBottom color="secondary" sx={{ marginTop: 3 }}>
                    Información del Pedido
                </Typography>
                <TextField
                    fullWidth
                    label="Fecha"
                    value={pedido.fecha}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Número de Pedido"
                    value={pedido.numeroPedido}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Usuario"
                    value={pedido.usuario}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Observaciones"
                    value={pedido.observaciones}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Total"
                    value={`$${pedido.total}`}
                    margin="normal"
                    slotProps={{ readOnly: true }}
                />

                {/* Botón Finalizar */}
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ marginTop: 3 }}
                    onClick={handleFinalizar}
                >
                    Finalizar
                </Button>
            </Container>

            <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
                <Alert severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default FormularioPedido;