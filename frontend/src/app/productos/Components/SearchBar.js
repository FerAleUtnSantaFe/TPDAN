import { fetchProductos } from "@/app/APIs/ProductosAPI";
import { SearchProductos } from "@/app/productos/controllers/Controllers";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/app/styles/styles";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  productos,
  setProductosFiltrados, // Ensure this is included
  productosSeleccionados,
  isPedidoMode,
  onListaProductosSelect,
  orden,
  setOrden,
}) {
  const [searchProducto, setSearchProducto] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const router = useRouter();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleNew = () => {
    router.push("/productos/nuevo");
  };

  async function buscarProductos() {
    if (
      !searchProducto &&
      !searchCategoria &&
      priceRange[0] === 0 &&
      priceRange[1] === 1000
    ) {
      const reinicio = await fetchProductos();
      setProductosFiltrados(reinicio); // This should work if the prop is passed correctly
      return;
    }

    const productosFiltrados = SearchProductos(
      productos,
      searchProducto,
      searchCategoria,
      priceRange
    );

    setProductosFiltrados(productosFiltrados); // This should also work
  }

  const GenerarPedido = () => {
    onListaProductosSelect(productosSeleccionados);
  };

  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: 2,
        maxWidth: "1200px",
        margin: "auto",
        px: 0, // quitar padding interno del AppBar
        py: 0.5,
      }}
    >
      <Toolbar
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          pl: 1.5, // padding izquierda global real
          pr: 1.5, // padding derecha global real
          [theme.breakpoints.up("md")]: {
            gap: 1, // más separado en pantallas más grandes
            flexWrap: "nowrap",
          },
        })}
      >
        <Search
          sx={{
            width: isSmallScreen ? 140 : 200,
            height: 40,
            px: 1,
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Producto..."
            inputProps={{ "aria-label": "search" }}
            value={searchProducto}
            onChange={(e) => setSearchProducto(e.target.value)}
          />
        </Search>

        <Search
          sx={{
            width: isSmallScreen ? 140 : 200,
            height: 40,
            px: 1,
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Categoría..."
            inputProps={{ "aria-label": "search" }}
            value={searchCategoria}
            onChange={(e) => setSearchCategoria(e.target.value)}
          />
        </Search>

        {!isMediumScreen && (
          <Box sx={{ minWidth: 200, px: 1 }}>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              sx={{
                backgroundColor: "#lightgrey",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#grey",
                },
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            minWidth: isSmallScreen ? 120 : 140,
            height: 40,
            px: 0.5, // menos separación
          }}
        >
          <Select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            renderValue={() => "Ordenar por"}
            variant="outlined"
            size="small"
            sx={{
              height: "100%",
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: 1,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="nombre">
              <ListItemText primary="Nombre" />
              {orden === "nombre" && (
                <ListItemIcon sx={{ justifyContent: "flex-end", minWidth: 0 }}>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
              )}
            </MenuItem>
            <MenuItem value="precioAsc">
              <ListItemText primary="Precio: Menor a Mayor" />
              {orden === "precioAsc" && (
                <ListItemIcon sx={{ justifyContent: "flex-end", minWidth: 0 }}>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
              )}
            </MenuItem>
            <MenuItem value="precioDesc">
              <ListItemText primary="Precio: Mayor a Menor" />
              {orden === "precioDesc" && (
                <ListItemIcon sx={{ justifyContent: "flex-end", minWidth: 0 }}>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
              )}
            </MenuItem>
          </Select>
        </Box>

        <Box
          sx={{
            minWidth: isSmallScreen ? 80 : 120,
            height: 40,
            px: 0.5, // menos separación
          }}
        >
          <Button
            variant="contained"
            size="small"
            color="info"
            fullWidth
            onClick={buscarProductos}
            sx={{ height: "100%", gap: 1 }}
          >
            Buscar
          </Button>
        </Box>

        <Box
          sx={{
            minWidth: isSmallScreen ? 100 : 130,
            height: 40,
            px: 0.5, // menos separación
          }}
        >
          <Button
            variant="contained"
            size="small"
            color="success"
            fullWidth
            onClick={isPedidoMode ? GenerarPedido : handleNew}
            startIcon={!isPedidoMode && <AddIcon />}
            sx={{ height: "100%", gap: 1 }}
          >
            {isPedidoMode ? "Generar Pedido" : "Nuevo"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
