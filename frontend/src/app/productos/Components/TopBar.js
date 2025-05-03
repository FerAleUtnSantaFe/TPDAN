import AddIcon from "@mui/icons-material/Add";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function TopBar({
    isPedidoMode,
    onListaProductosSelect,
    productosSeleccionados,
    orden,
    setOrden,
    actualizarProductosFiltrados, // Nueva prop para actualizar los productos al cambiar el orden
    productosOriginales, // Productos originales para reordenar
}) {
    const GenerarPedido = () => {
        onListaProductosSelect(productosSeleccionados);
    };

    const router = useRouter();

    const handleNew = () => {
        router.push("/productos/nuevo");
    };

    const handleOrdenChange = (e) => {
        const nuevoOrden = e.target.value;
        setOrden(nuevoOrden); // Cambia el criterio de orden automáticamente
        const productosOrdenados = [...productosOriginales].sort((a, b) => {
            if (a.stockActual > 0 && b.stockActual === 0) return -1;
            if (a.stockActual === 0 && b.stockActual > 0) return 1;

            if (nuevoOrden === "nombre") {
                return a.nombre.localeCompare(b.nombre);
            } else if (nuevoOrden === "precioAsc") {
                return a.precio - b.precio;
            } else if (nuevoOrden === "precioDesc") {
                return b.precio - a.precio;
            }
            return 0;
        });
        actualizarProductosFiltrados(productosOrdenados); // Actualiza los productos filtrados
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 1,
                backgroundColor: "#f5f5f5",
                gap: 2,
                borderBottom: "1px solid #ccc",
                marginTop: "10px", // Espacio superior para que no se superponga con la ProgressBar
                width: "calc(100% - 16px)", // Ajustar el ancho para igualar la ProgressBar
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra sutil
            }}
        >
            {/* Título en la parte izquierda */}
            <Typography
                variant="h6"
                sx={{
                    flex: 1,
                    fontWeight: "bold",
                    marginLeft: "16px", // Alineado con la SidebarFilter
                }}
            >
                Productos
            </Typography>

            {/* Controles a la derecha */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Select
                    value={orden}
                    onChange={handleOrdenChange} // Aplicar automáticamente el orden
                    displayEmpty
                    sx={{
                        minWidth: 200,
                        height: 40,
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra sutil
                    }}
                >
                    <MenuItem value="nombre">Ordenar por Nombre</MenuItem>
                    <MenuItem value="precioAsc">Precio: Menor a Mayor</MenuItem>
                    <MenuItem value="precioDesc">Precio: Mayor a Menor</MenuItem>
                </Select>
                <Button
                    variant="contained"
                    color="success"
                    onClick={isPedidoMode ? GenerarPedido : handleNew}
                    startIcon={!isPedidoMode && <AddIcon />}
                    sx={{
                        minWidth: 200,
                        height: 40,
                    }}
                >
                    {isPedidoMode ? "Generar Pedido" : "Nuevo"}
                </Button>
            </Box>
        </Box>
    );
}