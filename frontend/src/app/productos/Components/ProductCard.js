import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsIcon from "@mui/icons-material/Settings";
import {
    Box,
    Card,
    CardContent,
    IconButton,
    Typography,
} from "@mui/material";
import { useState } from "react";

export default function ProductCard({
    producto,
    handleEdit,
    handleDelete,
    onCantidadChange,
    isPedidoMode,
}) {
    const [cantidad, setCantidad] = useState(0);
    const [hovered, setHovered] = useState(false);

    const handleAdd = () => {
        const nuevaCantidad = cantidad + 1;
        setCantidad(nuevaCantidad);
        if (onCantidadChange) onCantidadChange(producto, nuevaCantidad);
    };

    const handleRemove = () => {
        if (cantidad > 0) {
            const nuevaCantidad = cantidad - 1;
            setCantidad(nuevaCantidad);
            if (onCantidadChange) onCantidadChange(producto, nuevaCantidad);
        }
    };

    const tieneDescuento = producto.descuentoPromocional > 0;

    const precioAnterior = tieneDescuento
        ? producto.precio / (1 - producto.descuentoPromocional / 100)
        : producto.precio;

    return (
        <Card
            sx={{
                width: hovered ? 300 : 270,
                height: hovered ? 300 : 250,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra sutil
                transition: "all 0.3s ease-in-out", // Transición para el hover
                backgroundColor: isPedidoMode
                    ? (producto.stockActual > 0 ? "white" : "#f5f5f5") // Fondo gris si no hay stock
                    : "white",
                opacity: isPedidoMode
                    ? (producto.stockActual > 0 ? 1 : 0.6) // Reducir opacidad si no hay stock
                    : 1,
                pointerEvents: isPedidoMode
                    ? (producto.stockActual > 0 ? "auto" : "none") // Deshabilitar interacciones si no hay stock
                    : "auto",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Imagen */}
            < Box
                component="img"
                src={`/productos/icons/${producto.categoria.toLowerCase()}.png`}
                alt={producto.nombre}
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* Contenido textual */}
            <CardContent
                sx={{
                    paddingBottom: 0,
                    paddingRight: "110px",
                }}
            >
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        lineHeight: "1.2em",
                        marginBottom: 0.5,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                    }}
                >
                    {producto.nombre}
                </Typography>
                {hovered && (
                    <>
                        <Typography variant="body2" color="text.secondary">
                            {producto.descripcion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Categoría: {producto.categoria}
                        </Typography>
                    </>
                )}
            </CardContent>

            {/* Precio y descuento */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 1,
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                }}
            >
                {tieneDescuento ? (
                    <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                        <Box
                            component="span"
                            sx={{
                                color: "red",
                                textDecoration: "line-through",
                                marginRight: 1,
                            }}
                        >
                            ${precioAnterior.toFixed(2)}
                        </Box>
                        <Box component="span" sx={{ color: "green" }}>
                            ${producto.precio.toFixed(2)}
                        </Box>
                    </Typography>
                ) : (
                    <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontFamily: "monospace" }}
                    >
                        ${producto.precio.toFixed(2)}
                    </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                    Stock: {producto.stockActual}
                </Typography>
            </Box>

            {/* Controles */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 0.5,
                    padding: 0.5,
                }}
            >
                {isPedidoMode ? (
                    <>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={handleRemove}
                            disabled={cantidad === 0}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1">{cantidad}</Typography>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={handleAdd}
                            disabled={cantidad === producto.stockActual}
                        >
                            <AddIcon />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(producto.id)}
                        >
                            <SettingsIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(producto.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
            </Box>
        </Card >
    );
}