import { Box, Button, TextField, Typography, MenuItem, Select } from "@mui/material";
import { useState } from "react";

export default function SidebarFilter({ productos, setProductosFiltrados }) {
    const [searchProducto, setSearchProducto] = useState("");
    const [searchCategoria, setSearchCategoria] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const buscarProductos = () => {
        const filtered = productos.filter((producto) => {
            const matchesProducto = searchProducto
                ? producto.nombre.toLowerCase().includes(searchProducto.toLowerCase())
                : true;
            const matchesCategoria = searchCategoria
                ? producto.categoria.toLowerCase() === searchCategoria.toLowerCase()
                : true;
            const matchesPrice =
                (!minPrice || producto.precio >= parseFloat(minPrice)) &&
                (!maxPrice || producto.precio <= parseFloat(maxPrice));

            return matchesProducto && matchesCategoria && matchesPrice;
        });

        setProductosFiltrados(filtered);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "220px",
                padding: 2,
                borderRight: "1px solid #ccc",
                height: "auto",
                backgroundColor: "#f5f5f5",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra sutil
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    marginBottom: 1,
                    marginLeft: "16px", // Alineado con la TopBar
                }}
            >
                Filtros de búsqueda
            </Typography>
            <TextField
                label="Producto"
                value={searchProducto}
                onChange={(e) => setSearchProducto(e.target.value)}
                fullWidth
                size="small"
                sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
            />
            <Select
                value={searchCategoria}
                onChange={(e) => setSearchCategoria(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
            >
                <MenuItem value="">Todas las categorías</MenuItem>
                <MenuItem value="CEMENTOS">CEMENTOS</MenuItem>
                <MenuItem value="PLACAS">PLACAS</MenuItem>
                <MenuItem value="PERFILES">PERFILES</MenuItem>
                <MenuItem value="MORTEROS">MORTEROS</MenuItem>
                <MenuItem value="YESERIA">YESERIA</MenuItem>
            </Select>
            <TextField
                label="Precio Mínimo"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                fullWidth
                size="small"
                sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
            />
            <TextField
                label="Precio Máximo"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                fullWidth
                size="small"
                sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
            />
            <Button variant="contained" color="primary" onClick={buscarProductos}>
                Buscar
            </Button>
        </Box>
    );
}