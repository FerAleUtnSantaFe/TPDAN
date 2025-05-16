import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const CATEGORIAS = [
    "CEMENTOS",
    "PLACAS",
    "PERFILES",
    "MORTEROS",
    "YESERIA"
];

export default function SidebarFilter({ productos, setProductosFiltrados }) {
    const [searchProducto, setSearchProducto] = useState("");
    const [searchCategoria, setSearchCategoria] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Búsqueda reactiva para producto y categoría
    useEffect(() => {
        filtrarProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchProducto, searchCategoria]);

    const filtrarProductos = (precioMin = minPrice, precioMax = maxPrice) => {
        const filtered = productos.filter((producto) => {
            const matchesProducto = searchProducto
                ? producto.nombre.toLowerCase().includes(searchProducto.toLowerCase())
                : true;
            const matchesCategoria = searchCategoria
                ? producto.categoria.toLowerCase() === searchCategoria.toLowerCase()
                : true;
            const matchesPrice =
                (!precioMin || producto.precio >= parseFloat(precioMin)) &&
                (!precioMax || producto.precio <= parseFloat(precioMax));

            return matchesProducto && matchesCategoria && matchesPrice;
        });

        setProductosFiltrados(filtered);
    };

    // Handler para el botón de búsqueda de precio
    const handleBuscarPrecio = () => {
        filtrarProductos();
    };

    // Handler para seleccionar categoría
    const handleCategoriaClick = (categoria) => {
        setSearchCategoria(categoria === searchCategoria ? "" : categoria);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "220px",
                padding: 1,
                borderRight: "1px solid #ccc",
                height: "auto",
                backgroundColor: "#F5F5F5",
            }}
        >
            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, ml: 0.5 }}>
                    Buscar Producto
                </Typography>
                <TextField
                    placeholder="Producto"
                    value={searchProducto}
                    onChange={(e) => setSearchProducto(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                />
            </Box>
            {/* Categorías como lista */}
            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, ml: 0.5 }}>
                    Categorías
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {CATEGORIAS.map((cat) => (
                        <Typography
                            key={cat}
                            onClick={() => handleCategoriaClick(cat)}
                            sx={{
                                cursor: "pointer",
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontWeight: searchCategoria === cat ? "bold" : "normal",
                                backgroundColor: searchCategoria === cat ? "#1976d2" : "transparent",
                                color: searchCategoria === cat ? "#fff" : "#333",
                                transition: "background 0.2s",
                                "&:hover": {
                                    backgroundColor: searchCategoria === cat ? "#1565c0" : "#f0f0f0",
                                },
                                userSelect: "none",
                            }}
                        >
                            {cat}
                        </Typography>
                    ))}
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, ml: 0.5 }}>
                    Precio
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.05 }}>
                    <TextField
                        placeholder="Mínimo"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        size="small"
                        sx={{
                            width: 125,
                            backgroundColor: "#ffffff",
                            borderRadius: 1,
                            marginRight: 1,
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                WebkitAppearance: 'none',
                                margin: 0,
                            },
                            '& input[type=number]': {
                                MozAppearance: 'textfield',
                            },
                        }}
                        InputProps={{
                            sx: { fontSize: 12, textAlign: "center" },
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                        }}
                    />
                    <TextField
                        placeholder="Máximo"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        size="small"
                        sx={{
                            width: 125,
                            backgroundColor: "#ffffff",
                            borderRadius: 1,
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                WebkitAppearance: 'none',
                                margin: 0,
                            },
                            '& input[type=number]': {
                                MozAppearance: 'textfield',
                            },
                        }}
                        InputProps={{
                            sx: { fontSize: 12, textAlign: "center" },
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                        }}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleBuscarPrecio}
                        aria-label="Aplicar filtro de precio"
                        sx={{ p: "8px" }}
                    >
                        <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}