"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Slider from "@mui/material/Slider";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation"; // Importar useRouter
import * as React from "react";
import NavBar from "../Components/NavBar";
import {
  handleRowSelection,
  handleSearchProducto,
} from "./controllers/Controllers";
import { fetchProductos } from "./ProductosAPI";

const columns = [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  { field: "descripcion", headerName: "Descripción", flex: 1 },
  { field: "stockActual", headerName: "Stock Actual", flex: 1 },
  { field: "stockMinimo", headerName: "Stock Mínimo", flex: 1 },
  { field: "precio", headerName: "Precio", flex: 1 },
  { field: "categoria", headerName: "Categoría", flex: 1 },
];

export default function SingleRowSelectionGrid() {
  const [rows, setRows] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchProducto, setSearchProducto] = React.useState("");
  const [searchCodigo, setSearchCodigo] = React.useState("");
  const [priceRange, setPriceRange] = React.useState([0, 1000]);

  const router = useRouter(); // Inicializar el router

  React.useEffect(() => {
    async function fetchData() {
      const data = await fetchProductos();
      const formattedData = data.map((producto, index) => ({
        id: index + 1,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        stockActual: producto.stockActual,
        stockMinimo: producto.stockMinimo,
        precio: producto.precio,
        categoria: producto.categoria,
      }));
      setRows(formattedData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleRowSelectionInternal = (selection) => {
    handleRowSelection(selection, setSelectedRow);
  };

  const handleEditInternal = () => {
    if (selectedRow) {
      router.push(`/productos/modificar?id=${selectedRow}`); // Redirigir a la página modificar con el ID del producto
    }
  };

  const handleDeleteInternal = () => {
    handleDelete(selectedRow);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSearch = () => {
    handleSearchProducto(searchProducto, searchCodigo, priceRange);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: isLoading ? 300 : rows.length * 30,
        transition: "height 0.3s ease-in-out",
      }}
    >
      <NavBar />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 0 }}>
            <Search>
              <StyledInputBase
                placeholder="Producto..."
                inputProps={{ "aria-label": "search" }}
                value={searchProducto}
                onChange={(e) => setSearchProducto(e.target.value)}
              />
            </Search>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Search>
              <StyledInputBase
                type="number"
                placeholder="Código..."
                inputProps={{
                  "aria-label": "search",
                  min: 0,
                  step: 1,
                }}
                value={searchCodigo}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setSearchCodigo(value);
                  }
                }}
              />
            </Search>
          </Box>
          <Box sx={{ flexGrow: 0, minWidth: 200 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </Box>
        </Box>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onSelectionModelChange={handleRowSelectionInternal}
        selectionModel={selectedRow ? [selectedRow] : []}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
      />
      <Button
        onClick={handleEditInternal}
        disabled={!selectedRow}
        variant="contained"
        color="primary"
      >
        Modificar
      </Button>
      <Button
        onClick={handleDeleteInternal}
        disabled={!selectedRow}
        variant="contained"
        color="secondary"
      >
        Eliminar
      </Button>
    </Box>
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));