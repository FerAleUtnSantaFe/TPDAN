import { fetchProductos } from "@/app/APIs/ProductosAPI";
import ProductCard from "@/app/productos/Components/ProductCard";
import SidebarFilter from "@/app/productos/Components/SidebarFilter";
import TopBar from "@/app/productos/Components/TopBar";
import { handleDelete } from "@/app/productos/controllers/Controllers";
import ModificarProductoModal from "@/app/productos/modificar/ModificarProducto";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export default function ProductGrid({ isPedidoMode, onListaProductosSelect }) {
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductoId, setSelectedProductoId] = useState(null);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [orden, setOrden] = useState("nombre");

    const isSmallScreen = useMediaQuery("(max-width: 768px)");

    const ordenarProductos = (lista) => {
        const sorted = [...lista];

        // Ordenar primero por stock y luego por el criterio seleccionado
        sorted.sort((a, b) => {
            if (a.stockActual > 0 && b.stockActual === 0) return -1; // Los que tienen stock primero
            if (a.stockActual === 0 && b.stockActual > 0) return 1; // Los que no tienen stock después

            // Si ambos tienen o no tienen stock, aplicar el criterio de orden
            if (orden === "nombre") {
                return a.nombre.localeCompare(b.nombre);
            } else if (orden === "precioAsc") {
                return a.precio - b.precio; // Menor a Mayor
            } else if (orden === "precioDesc") {
                return b.precio - a.precio; // Mayor a Menor
            }
            return 0;
        });

        return sorted;
    };

    const actualizarProductosFiltrados = (filteredList) => {
        const sortedList = ordenarProductos(filteredList);
        setProductosFiltrados(sortedList);
    };

    const handleEdit = (id) => {
        setSelectedProductoId(id);
        setIsModalOpen(true);
    };

    const handleModalClose = async () => {
        setIsModalOpen(false);
        setSelectedProductoId(null);
        const updatedProductos = await fetchProductos();
        setProductosOriginales(updatedProductos);
        actualizarProductosFiltrados(updatedProductos);
    };

    const handleDeleteProducto = async (id) => {
        const result = await handleDelete(id);
        alert(result.message);
        if (result.success) {
            const updatedProductos = await fetchProductos();
            setProductosOriginales(updatedProductos);
            actualizarProductosFiltrados(updatedProductos);
        }
    };

    const handleCantidadChange = (producto, cantidad) => {
        setProductosSeleccionados((prev) => {
            const index = prev.findIndex((p) => p.id === producto.id);
            if (index !== -1) {
                const updated = [...prev];
                updated[index].cantidad = cantidad;
                return updated.filter((p) => p.cantidad > 0);
            } else {
                return [...prev, { ...producto, cantidad }];
            }
        });
    };
    // Re-sort products whenever the sorting order changes
    useEffect(() => {
        actualizarProductosFiltrados(productosFiltrados);
    }, [orden]);
    useEffect(() => {
        async function fetchData() {
            const data = await fetchProductos();
            setProductosOriginales(data);
            actualizarProductosFiltrados(data);
        }
        fetchData();
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Top Bar */}
            <TopBar
                isPedidoMode={isPedidoMode}
                onListaProductosSelect={onListaProductosSelect}
                productosSeleccionados={productosSeleccionados}
                orden={orden}
                setOrden={setOrden}
            />

            {/* Main Content */}
            <Box sx={{ display: "flex", flex: 1, gap: 2, marginTop: 2 }}>
                {/* Sidebar Filter */}
                {!isSmallScreen && (
                    <Box sx={{ flexShrink: 0 }}>
                        <SidebarFilter
                            productos={productosOriginales}
                            setProductosFiltrados={actualizarProductosFiltrados}
                        />
                    </Box>
                )}

                {/* Product Grid */}
                <Box
                    sx={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Asegura que las tarjetas se alineen correctamente
                        gap: 8, // Espaciado entre tarjetas
                        alignItems: "start", // Alinea las tarjetas al inicio
                    }}
                >
                    {productosFiltrados.map((producto) => (
                        <ProductCard
                            key={producto.id}
                            producto={producto}
                            handleEdit={handleEdit}
                            handleDelete={handleDeleteProducto}
                            isPedidoMode={isPedidoMode}
                            onCantidadChange={handleCantidadChange}
                        />
                    ))}
                </Box>
            </Box>

            {/* Modificar Producto Modal */}
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