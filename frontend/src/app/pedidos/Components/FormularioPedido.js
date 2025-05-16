"use client";

import { createPedido } from "@/app/APIs/PedidosAPI";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FormularioPedido = ({ cliente, obra, listaProductos }) => {
    const router = useRouter();
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "",
    });
    const [pedido, setPedido] = useState({
        fecha: new Date().toISOString(),
        numeroPedido: Math.floor(Math.random() * 1000000), // Genera un número de pedido aleatorio
        usuario: "Usuario Actual", // Cambiar por el usuario actual
        observaciones: "Sin observaciones",
        total: listaProductos.reduce(
            (total, producto) => total + producto.precio * producto.cantidad,
            0
        ), // Calcula el total
        estadosPedido: [],
        estado: "RECIBIDO",
        obra: obra,
        cliente: cliente,
        listaProductos: listaProductos,
    });

    const handleFinalizar = async () => {
        try {
            const pedidoData = {
                ...pedido,
                cliente: cliente.id,
                obra: obra.id,
                listaProductos: listaProductos.map((producto) => ({
                    id: producto.id,
                    cantidad: producto.cantidad,
                    precio: producto.precio,
                })), // Asegúrate de que la lista de productos tenga el formato correcto
            };

            const result = await createPedido(pedidoData); // Llama a la API para crear el pedido
            if (result) {
                setAlert({
                    open: true,
                    message: "Pedido creado correctamente",
                    severity: "success",
                });
                setTimeout(() => {
                    router.push("/pedidos"); // Redirige a la lista de clientes
                }, 3000);
            } else {
                setAlert({
                    open: true,
                    message: "Error al crear el pedido",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Error al crear el pedido", error);
            setAlert({
                open: true,
                message: "Error crear el pedido",
                severity: "error",
            });
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Card sx={{ width: "100%", maxWidth: 700, boxShadow: 4 }}>
                <CardContent>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{ textAlign: "center", fontWeight: 700, mb: 3 }}
                    >
                        Detalle del Pedido
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Información del Cliente */}
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Información del Cliente
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={cliente?.nombre || ""}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="CUIT"
                                value={cliente?.cuit || ""}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                value={cliente?.correoElectronico || ""}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Información de la Obra */}
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Información de la Obra
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="ID de la Obra"
                                value={obra?.id || ""}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dirección"
                                value={obra?.direccion || ""}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Lista de Productos */}
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Productos del Pedido
                    </Typography>
                    <List dense>
                        {(Array.isArray(listaProductos) ? listaProductos : []).map(
                            (producto, index) => (
                                <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <span>
                                                    {producto.nombre} (x{producto.cantidad})
                                                </span>
                                                <span>
                                                    ${producto.precio.toFixed(2)} c/u &nbsp;|&nbsp; Total: $
                                                    {(producto.precio * producto.cantidad).toFixed(2)}
                                                </span>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            )
                        )}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Información del Pedido */}
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Información del Pedido
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Fecha"
                                value={pedido.fecha}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Número de Pedido"
                                value={pedido.numeroPedido}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Usuario"
                                value={pedido.usuario}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Estado"
                                value={pedido.estado}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Observaciones"
                                value={pedido.observaciones}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Total"
                                value={`$${pedido.total.toFixed(2)}`}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                    </Grid>

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
                </CardContent>
            </Card>
        

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default FormularioPedido;
