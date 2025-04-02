"use client";

import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import { fetchProductos } from "./APIs/ProductosAPI";
import ProductGrid from "./Components/ProductGrid";
import SearchBar from "./Components/SearchBar";
import { handleDelete, handleSearchProducto } from "./controllers/Controllers";
import ModificarProductoModal from "./modificar/ModificarProducto";

export default function ProductosTarjetas() {
  const [productos, setProductos] = useState([]);
  const [searchProducto, setSearchProducto] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const data = await fetchProductos();
      setProductos(data);
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (
      !searchProducto &&
      !searchCategoria &&
      priceRange[0] === 0 &&
      priceRange[1] === 1000
    ) {
      const data = await fetchProductos();
      setProductos(data);
      return;
    }

    const filteredProductos = handleSearchProducto(
      productos,
      searchProducto,
      searchCategoria,
      priceRange
    );

    setProductos(filteredProductos);
  };

  const handleEdit = (id) => {
    setSelectedProductoId(id); // Guarda el ID del producto seleccionado
    setIsModalOpen(true); // Abre el modal
  };

  const handleDeleteProducto = async (id) => {
    const result = await handleDelete(id);
    alert(result.message);
    if (result.success) {
      const updatedProductos = await fetchProductos();
      setProductos(updatedProductos);
    }
  };

  const handleNew = () => {
    router.push(`/productos/nuevo`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cierra el modal
    setSelectedProductoId(null); // Limpia el producto seleccionado
  };

  const handleProductoUpdated = async () => {
    const updatedProductos = await fetchProductos(); // Recarga la lista de productos
    setProductos(updatedProductos);
    handleModalClose(); // Cierra el modal después de actualizar
  };

  return (
    <div>
      <NavBar />
      <Container>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            margin: 2,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "2.5rem",
            textTransform: "uppercase",
            color: "primary.main",
          }}
        >
          Gestión de Producto
        </Typography>
        <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
          <SearchBar
            searchProducto={searchProducto}
            setSearchProducto={setSearchProducto}
            searchCategoria={searchCategoria}
            setSearchCategoria={setSearchCategoria}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            handleSearch={handleSearch}
            handleNew={handleNew}
          />
          <ProductGrid
            productos={productos}
            handleEdit={handleEdit}
            handleDelete={handleDeleteProducto}
          />
        </Box>
      </Container>

      {/* Modal para modificar producto */}
      {isModalOpen && (
        <ModificarProductoModal
          open={isModalOpen}
          onClose={handleModalClose}
          productoId={selectedProductoId}
          onProductoUpdated={handleProductoUpdated}
        />
      )}
    </div>
  );
}