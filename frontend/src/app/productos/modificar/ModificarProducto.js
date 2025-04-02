"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { editProducto, getProductoById } from "../APIs/ProductosAPI";

export default function ModificarProductoModal({
  open,
  onClose,
  productoId,
  onProductoUpdated,
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [errors, setErrors] = useState({}); // Estado para manejar errores

  // Cargar los datos del producto al abrir el modal
  useEffect(() => {
    if (open && productoId) {
      async function fetchProducto() {
        try {
          const producto = await getProductoById(productoId);
          setNombre(producto.nombre);
          setDescripcion(producto.descripcion);
          setPrecio(producto.precio);
          setStockActual(producto.stockActual);
          setStockMinimo(producto.stockMinimo);
        } catch (error) {
          console.error("Error al cargar el producto:", error);
        }
      }
      fetchProducto();
    }
  }, [open, productoId]);

  const validateFields = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre no puede estar vacío.";
    if (!descripcion.trim())
      newErrors.descripcion = "La descripción no puede estar vacía.";
    if (!precio || precio <= 0)
      newErrors.precio = "El precio debe ser mayor a 0.";
    if (!stockActual || stockActual < 0)
      newErrors.stockActual = "El stock actual no puede ser negativo.";
    if (!stockMinimo || stockMinimo < 0)
      newErrors.stockMinimo = "El stock mínimo no puede ser negativo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSave = async () => {
    if (!validateFields()) return; // Detiene la ejecución si hay errores

    try {
      const updatedProducto = {
        nombre,
        descripcion,
        precio,
        stockActual,
        stockMinimo,
      };
      await editProducto(productoId, updatedProducto);
      onProductoUpdated(); // Notifica a la vista principal que el producto fue actualizado
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 170) {
      setDescripcion(value);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modificar Producto</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
        >
          <TextField
            label="Nombre"
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={!!errors.nombre}
            helperText={errors.nombre}
            required
          />
          <TextField
            label="Precio"
            type="number"
            variant="outlined"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            error={!!errors.precio}
            helperText={errors.precio}
            required
          />
          <TextField
            label="Stock Actual"
            type="number"
            variant="outlined"
            value={stockActual}
            onChange={(e) => setStockActual(e.target.value)}
            error={!!errors.stockActual}
            helperText={errors.stockActual}
            required
          />
          <TextField
            label="Stock Mínimo"
            type="number"
            variant="outlined"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            error={!!errors.stockMinimo}
            helperText={errors.stockMinimo}
            required
          />
          <TextField
            label="Descripción"
            variant="outlined"
            value={descripcion}
            onChange={handleDescripcionChange}
            error={!!errors.descripcion}
            helperText={
              errors.descripcion || `${descripcion.length}/170 caracteres`
            }
            multiline // Habilita el modo multiline
            rows={3} // Número de filas visibles
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
