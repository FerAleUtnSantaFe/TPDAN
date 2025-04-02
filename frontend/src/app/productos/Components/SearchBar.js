import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Box, Button, Slider, Toolbar } from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../styles/styles";

export default function SearchBar({
  searchProducto,
  setSearchProducto,
  searchCategoria,
  setSearchCategoria,
  priceRange,
  setPriceRange,
  handleSearch,
  handleNew,
}) {
  return (
    <AppBar position="static" sx={{ borderRadius: 2 }}>
      <Toolbar sx>
        {/* Campo de búsqueda por producto */}
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

        {/* Campo de búsqueda por Categoría */}
        <Search sx={{ width: 200, gap: 1 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Categoria..."
            inputProps={{ "aria-label": "search" }}
            value={searchCategoria}
            onChange={(e) => setSearchCategoria(e.target.value)}
          />
        </Search>

        {/* Slider para rango de precios */}
        <Box
          sx={{
            flexGrow: 0,
            minWidth: 200,
            ml: 4,
            display: { xs: "none", sm: "block" },
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
            }}
          />
        </Box>

        {/* Botón Buscar */}
        <Button
          variant="contained"
          size="large"
          color="info"
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
  );
}
