import { fetchProductos } from "@/app/APIs/ProductosAPI";
import ProductCard from "@/app/productos/Components/ProductCard";
import SearchBar from "@/app/productos/Components/SearchBar";
import { handleDelete } from "@/app/productos/controllers/Controllers";
import ModificarProductoModal from "@/app/productos/modificar/ModificarProducto";
import { Box, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";

export default function ProductGrid({ isPedidoMode, onListaProductosSelect}) {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]); // Estado para productos seleccionados

  const handleModalClose = async () => {
    setIsModalOpen(false);
    setSelectedProductoId(null);

    const updatedProductos = await fetchProductos();
    setProductos(updatedProductos);
  };
  
  const handleEdit = (id) => {
    setSelectedProductoId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await fetchProductos();
      setProductos(data);
    }
    fetchData();
  }, []);

  const handleDeleteProducto = async (id) => {
    const result = await handleDelete(id);
    alert(result.message);
    if (result.success) {
      const updatedProductos = await fetchProductos();
      setProductos(updatedProductos);
    }
  };

  const handleCantidadChange = (producto, cantidad) => {
    setProductosSeleccionados((prev) => {
      const index = prev.findIndex((p) => p.id === producto.id);
      if (index !== -1) {
        // Si el producto ya está en la lista, actualiza la cantidad
        const updated = [...prev];
        updated[index].cantidad = cantidad;
        return updated.filter((p) => p.cantidad > 0); // Elimina productos con cantidad 0
      } else {
        // Si el producto no está en la lista, agrégalo
        return [...prev, { ...producto, cantidad }];
      }
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <SearchBar
        productos={productos}
        setProductos={setProductos}
        productosSeleccionados={productosSeleccionados} 
        isPedidoMode={isPedidoMode}
        onListaProductosSelect={onListaProductosSelect} 
      />
      <Grid2
        container
        spacing={3}
        sx={{
          marginTop: 2,
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6.2,
        }}
      >
        {productos.map((producto) => (
          <Grid2 item xs={12} sm={6} md={4} lg={3} key={producto.id}>
            <ProductCard
              producto={producto}
              handleEdit={handleEdit}
              handleDelete={handleDeleteProducto}
              onCantidadChange={handleCantidadChange}
              isPedidoMode={isPedidoMode} // Cambia esto según el modo que necesites
            />
          </Grid2>
        ))}
      </Grid2>

      {isModalOpen && (
        <ModificarProductoModal
          open={isModalOpen}
          onClose={handleModalClose}
          productoId={selectedProductoId}
        />
      )}
    </Box>
  );
}
