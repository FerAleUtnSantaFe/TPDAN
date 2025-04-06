import { fetchProductos } from "@/app/APIs/ProductosAPI";
import {
  SearchProductos,
  SeleccionarProductos,
} from "@/app/productos/controllers/Controllers";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Box, Button, Slider, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../styles/styles";

export default function SearchBar({
  productos,
  setProductos,
  productosSeleccionados,
  isPedidoMode,
  onListaProductosSelect,
}) {
  const [searchProducto, setSearchProducto] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const router = useRouter();

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
      const ReinicioProductos = await fetchProductos();
      setProductos(ReinicioProductos); // Se reinician los campos de busqueda
      return;
    }

    const productosFiltrados = SearchProductos(
      productos,
      searchProducto,
      searchCategoria,
      priceRange
    );

    setProductos(productosFiltrados);
  }

  const GenerarPedido = () => {
    onListaProductosSelect(productosSeleccionados); // Llama a la función con los productos seleccionados
  };

  return (
    <AppBar position="static" sx={{ borderRadius: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Search sx={{ width: 200, gap: 1 }}>
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

        <Search sx={{ width: 200, gap: 1 }}>
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

        <Box sx={{ flexGrow: 0, minWidth: 200, ml: 4 }}>
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
            }}
          />
        </Box>

        <Button
          variant="contained"
          size="large"
          color="info"
          sx={{ ml: "auto", padding: "0.75rem 1.5rem" }}
          onClick={buscarProductos}
        >
          Buscar
        </Button>

        {isPedidoMode ? (
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ ml: "1rem", padding: "0.75rem 1.5rem" }}
            onClick={GenerarPedido}
          >
            Generar Pedido
          </Button>
        ) : (
          <>
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
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
