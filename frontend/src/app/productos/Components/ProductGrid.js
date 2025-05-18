import { fetchProductos } from "@/app/APIs/ProductosAPI";
import ModificarProductoModal from "@/app/productos/Components/ModificarProducto";
import ProductCard from "@/app/productos/Components/ProductCard";
import ProvisionProductoModal from "@/app/productos/Components/ProvisionProducto";
import SidebarFilter from "@/app/productos/Components/SidebarFilter";
import TopBar from "@/app/productos/Components/TopBar";
import { handleDelete } from "@/app/productos/controllers/Controllers";
import { Box, Fade, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export default function ProductGrid({ isPedidoMode, onListaProductosSelect }) {
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductoId, setSelectedProductoId] = useState(null);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [orden, setOrden] = useState("nombre");

    const isSmallScreen = useMediaQuery("(max-width: 768px)");

    const [openProvision, setOpenProvision] = useState(false);

    const handleOpenProvision = () => setOpenProvision(true);
    const handleCloseProvision = async () => {
        setOpenProvision(false);
        // Refresca productos después de una provisión
        const updatedProductos = await fetchProductos();
        setProductosOriginales(updatedProductos);
        actualizarProductosFiltrados(updatedProductos);
    };


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
                onProvisionClick={handleOpenProvision}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 1, displayDirection: "row", gap: 1, alignItems: "center" }}>
                <Typography
                    variant="body1"
                    gutterBottom
                    align="center"
                    justifyContent={"center"}
                    sx={{
                        fontWeight: "bold",
                        marginTop: 0.5,
                    }}
                >
                    Ordenar por:
                </Typography>
                <Select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                    displayEmpty
                    variant="standard"
                    sx={{
                        maxWidth: 200,
                        height: 40,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 2,
                        //boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <MenuItem value="nombre">Nombre</MenuItem>
                    <MenuItem value="precioAsc">Menor Precio</MenuItem>
                    <MenuItem value="precioDesc">Mayor Precio</MenuItem>
                </Select>
            </Box>

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
                <Fade in={true} timeout={1000}>
                    <Box
                        sx={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", // Asegura que las tarjetas se alineen correctamente
                            gap: 0, // Espaciado entre tarjetas
                            alignItems: "start", // <-- alinea la card arriba
                            height: 600,
                        }}
                    >
                        {productosFiltrados.map((producto) => {
                            const seleccionado = productosSeleccionados.find(p => p.id === producto.id);
                            const cantidadSeleccionada = seleccionado ? seleccionado.cantidad : 0;
                            return (
                                <Box
                                    key={producto.id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <ProductCard
                                        producto={producto}
                                        cantidadSeleccionada={cantidadSeleccionada}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDeleteProducto}
                                        isPedidoMode={isPedidoMode}
                                        onCantidadChange={handleCantidadChange}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Fade>
            </Box>

            <ProvisionProductoModal open={openProvision} onClose={handleCloseProvision} />
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