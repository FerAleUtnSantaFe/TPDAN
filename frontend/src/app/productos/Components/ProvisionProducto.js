"use client";

import { provisionProducto } from "@/app/APIs/ProductosAPI"; // Asegúrate de importar la función correctamente
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useState } from "react";


export default function ProvisionProductoModal({ open, onClose }) {
    const [productoId, setProductoId] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleProvision = async () => {
        setError("");
        if (!productoId || !precio || !stock) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        setLoading(true);
        try {
            await provisionProducto(productoId, { precio, stock });
            onClose();

        } catch (e) {
            setError(e.message || "Error al realizar la provisión.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setProductoId("");
        setPrecio("");
        setStock("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle variant="h3" gutterBottom>Nueva provisión de producto</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                    <TextField
                        label="ID del producto"
                        type="number"
                        value={productoId}
                        onChange={(e) => setProductoId(e.target.value)}
                        required
                    />
                    <TextField
                        label="Nuevo precio"
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />
                    <TextField
                        label="Stock a agregar"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error" disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleProvision}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Realizar Provisión"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}