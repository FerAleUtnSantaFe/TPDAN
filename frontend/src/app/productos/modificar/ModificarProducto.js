"use client";

import { editProducto, getProductoById } from "@/app/APIs/ProductosAPI";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function ModificarProductoModal({
  open,
  onClose,
  productoId,
}) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [descuentoPromocional, setDescuentoPromocional] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({}); // Estado para manejar errores

  // Cargar los datos del producto al abrir el modal
  useEffect(() => {
    if (open && productoId) {
      async function fetchProducto() {
        try {
          const producto = await getProductoById(productoId);
          setNombre(producto.nombre);
          setPrecio(producto.precio);
          setStockActual(producto.stockActual);
          setStockMinimo(producto.stockMinimo);
          setDescuentoPromocional(producto.descuentoPromocional);
          setDescripcion(producto.descripcion);
        } catch (error) {
          console.error("Error al cargar el producto:", error);
        }
      }
      fetchProducto();
    }
  }, [open, productoId]);

  const validarCampos = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre no puede estar vacío.";
    if (!descripcion.trim())
      newErrors.descripcion = "La descripción no puede estar vacía.";
    if (!precio || precio <= 0) newErrors.precio = "Valor de precio no válido.";
    if (!stockActual || stockActual < 0)
      newErrors.stockActual = "Valor de stock actual no válido.";
    if (!stockMinimo || stockMinimo < 0)
      newErrors.stockMinimo = "Valor de stock mínimo no válido.";
    if (descuentoPromocional < 0)
      newErrors.descuentoPromocional =
        "Valor de descuento promocional no válido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const guardarProducto = async () => {
    if (!validarCampos()) return; // Detiene la ejecución si hay errores

    try {

      const productoActualizado = {
        nombre,
        precio,
        stockActual,
        stockMinimo,
        descuentoPromocional,
        descripcion,
      };

      await editProducto(productoId, productoActualizado);
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  const validacionDescripcion = (e) => {
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
            label="Descuento Promocional"
            type="number"
            value={descuentoPromocional}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 0 && value <= 100) {
                setDescuentoPromocional(value); // Actualiza el estado directamente
              }
            }}
            error={!!errors.descuentoPromocional}
            margin="normal"
            slotProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText="Ingrese un valor entre 0 y 100"
            required
          />
          <TextField
            label="Descripción"
            variant="outlined"
            value={descripcion}
            onChange={validacionDescripcion}
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
        <Button onClick={guardarProducto} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}