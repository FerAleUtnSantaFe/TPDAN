import { useState, useEffect, useCallback, useMemo } from "react";
import { findPedidos, updatePedido } from "@/app/APIs/PedidosAPI";

/**
 * Custom hook to manage the state and logic for the DataGridPedidos component.
 * Handles fetching, filtering, and updating pedidos.
 */
export const usePedidos = () => {
  // State for pedidos data
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ nroPedido: "", estado: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch pedidos on component mount
  useEffect(() => {
    cargarPedidos();
  }, []);

  /**
   * Fetches pedidos from the API and formats them for the DataGrid.
   */
  const cargarPedidos = useCallback(async () => {
    try {
      const data = await findPedidos();
      const formattedData = data.map((pedido) => ({
        id: pedido.id,
        numeroPedido: pedido.numeroPedido,
        fecha: pedido.fecha,
        cliente: pedido.cliente,
        obra: pedido.obra,
        estado: pedido.estado,
        total: pedido.total,
      }));
      setPedidos(formattedData);
    } catch (error) {
      console.error("Error fetching pedidos:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar los pedidos",
        severity: "error",
      });
    }
  }, []);

  /**
   * Handles search input changes and updates the search term state.
   * @param {object} event - The input change event.
   */
  const handleSearch = useCallback((event) => {
    const { name, value } = event.target;
    setSearchTerm((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Filters pedidos based on the search term.
   */
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((pedido) => {
      const matchesEstado =
        !searchTerm.estado || pedido.estado === searchTerm.estado;
      const matchesId =
        !searchTerm.nroPedido || pedido.numeroPedido.toString().includes(searchTerm.nroPedido);
      return matchesEstado && matchesId;
    });
  }, [pedidos, searchTerm]);

  /**
   * Handles the selection of a pedido for editing.
   * Opens the edit modal for the selected pedido.
   * @param {object} pedido - The pedido to edit.
   */
  const handleEdit = useCallback((pedido) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  }, []);

  /**
   * Saves the updated estado for the selected pedido.
   * @param {string} newEstado - The new estado to save.
   */
  const handleSaveEstado = useCallback(
    async (newEstado) => {
      try {
        const updatedPedido = await updatePedido(selectedPedido.id, newEstado);
        setPedidos((prevPedidos) =>
          prevPedidos.map((p) =>
            p.id === selectedPedido.id ? { ...p, estado: newEstado } : p
          )
        );
        setSnackbar({
          open: true,
          message: `Estado actualizado a ${newEstado}`,
          severity: "success",
        });
        setModalOpen(false);
      } catch (error) {
        console.error("Error updating pedido:", error);
        setSnackbar({
          open: true,
          message: "Error al actualizar el estado",
          severity: "error",
        });
      }
    },
    [selectedPedido]
  );

  /**
   * Closes the snackbar notification.
   */
  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    pedidos: filteredPedidos,
    searchTerm,
    snackbar,
    modalOpen,
    selectedPedido,
    handleSearch,
    handleEdit,
    handleSaveEstado,
    closeSnackbar,
    setModalOpen,
  };
};