"use client";

import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid2,
  Slider,
  Toolbar,
  Typography,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import * as React from "react";
import NavBar from "../Components/NavBar";
import { handleDelete, handleSearchProducto } from "./controllers/Controllers";
import { fetchProductos } from "./ProductosAPI";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";

export default function ProductosTarjetas() {
  const [productos, setProductos] = React.useState([]);
  const [searchProducto, setSearchProducto] = React.useState("");
  const [searchCategoria, setSearchCategoria] = React.useState("");
  const [priceRange, setPriceRange] = React.useState([0, 1000]);

  const router = useRouter();

  React.useEffect(() => {
    async function fetchData() {
      const data = await fetchProductos();
      setProductos(data);
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    const result = await handleSearchProducto(
      searchProducto,
      searchCategoria,
      priceRange
    );
    if (result.success) {
      setProductos(result.data); // Actualiza la lista de productos con los resultados de la búsqueda
    } else {
      alert(result.message); // Muestra un mensaje de error si ocurre un problema
    }
  };

  const handleEdit = (id) => {
    router.push(`/productos/modificar?id=${id}`);
  };

  const handleDeleteProducto = async (id) => {
    console.log("Eliminar producto con ID:", id);

    // Llamar a la función handleDelete
    const result = await handleDelete(id);

    // Mostrar el mensaje al usuario
    alert(result.message);

    // Si la eliminación fue exitosa, recargar la lista de productos
    if (result.success) {
      const updatedProductos = await fetchProductos();
      setProductos(updatedProductos);
    }
  };

  const handleNew = () => {
    router.push(`/productos/nuevo`);
  };

  return (
    <div>
      <NavBar />
      <Container>
        {/* Título de la página */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            margin: 2,
            textAlign: "center",
            fontWeight: "bold", // Título más destacado
            fontSize: "2.5rem", // Tamaño más grande
            textTransform: "uppercase", // Texto en mayúsculas
            color: "primary.main", // Color principal del tema
          }}
        >
          Gestión de Producto
        </Typography>

        {/* Contenedor común para alinear Toolbar y Cards */}
        <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Barra de búsqueda */}
          <AppBar position="static" sx={{ borderRadius: 2 }}>
            <Toolbar sx>
              {/* Campo de búsqueda por producto */}
              <Search sx={{ width: 200 }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Producto..."
                  inputProps={{ "aria-label": "search" }}
                  value={searchProducto} // Usa el estado correcto
                  onChange={(e) => setSearchProducto(e.target.value)} // Actualiza el estado de producto
                />
              </Search>

              {/* Campo de búsqueda por Categoría */}
              <Search sx={{ width: 200 }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Categoria..."
                  inputProps={{ "aria-label": "search" }}
                  value={searchCategoria} // Usa el estado correcto
                  onChange={(e) => setSearchCategoria(e.target.value)} // Actualiza el estado de categoría
                />
              </Search>

              {/* Slider para rango de precios */}
              <Box
                sx={{
                  flexGrow: 0,
                  minWidth: 200,
                  ml: 4, // Mayor separación a la izquierda
                  display: { xs: "none", sm: "block" }, // Ocultar en pantallas pequeñas
                }}
              >
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  sx={{
                    backgroundColor: "#lightgrey", // Color de fondo personalizado
                    color: "#ffffff", // Color del texto
                    "&:hover": {
                      backgroundColor: "#grey", // Color de fondo al pasar el mouse
                    },
                  }} // Cambiar color del slider // Cambiar color del slider
                />
              </Box>

              {/* Botón Buscar */}
              <Button
                variant="contained"
                size="large"
                color="info" // Cambiar color del botón (opciones: secondary, info, warning, success)
                sx={{ ml: "auto", padding: "0.75rem 1.5rem" }}
                onClick={handleSearch}
              >
                Buscar
              </Button>

              {/* Botón Nuevo */}
              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{ ml: "1rem", padding: "0.75rem 1.5rem" }}
                startIcon={<AddIcon />}
                onClick={handleNew}
              >
                Nuevo
              </Button>
            </Toolbar>
          </AppBar>

          {/* Mostrar productos como tarjetas */}
          <Grid2
            container
            spacing={3}
            sx={{
              marginTop: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {productos.map((producto) => (
              <Grid2 item xs={12} sm={6} md={4} lg={2} key={producto.id}>
                <Card sx={{ height: "100%", minWidth: 350 }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {producto.descripcion}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      Precio: ${producto.precio}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock Actual: {producto.stockActual}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categoría: {producto.categoria}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end", // Alinea los botones al lado izquierdo
                      gap: 1, // Espaciado entre los botones
                      padding: 1,
                    }}
                  >
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
                      onClick={() => handleDeleteProducto(producto.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Container>
    </div>
  );
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));
