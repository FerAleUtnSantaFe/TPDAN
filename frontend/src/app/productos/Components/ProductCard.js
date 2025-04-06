import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function ProductCard({
  producto,
  handleEdit,
  handleDelete,
  onCantidadChange, // Callback para notificar cambios en la cantidad
  isPedidoMode, // Determina si está en modo carrito
}) {
  const [cantidad, setCantidad] = useState(0);

  // Manejar el incremento de la cantidad
  const handleAdd = () => {
    const nuevaCantidad = cantidad + 1;
    setCantidad(nuevaCantidad);
    if (onCantidadChange) onCantidadChange(producto, nuevaCantidad);
  };

  // Manejar el decremento de la cantidad
  const handleRemove = () => {
    if (cantidad > 0) {
      const nuevaCantidad = cantidad - 1;
      setCantidad(nuevaCantidad);
      if (onCantidadChange) onCantidadChange(producto, nuevaCantidad);
    }
  };

  const tieneDescuento = producto.descuentoPromocional > 0;

  const precioAnterior = tieneDescuento
    ? producto.precio / (1 - producto.descuentoPromocional / 100)
    : producto.precio;

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="h6" color="inherit">
            {producto.nombre}
          </Typography>
          <Typography variant="body2" color="inherit">
            {producto.descripcion}
          </Typography>
        </Box>
      }
      placement="top"
      arrow
    >
      <Card
        sx={{
          height: "100%",
          minWidth: 350,
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={`/productos/icons/${producto.categoria.toLowerCase()}.png`}
          alt={producto.categoria}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 100,
            height: 100,
            objectFit: "contain",
          }}
        />
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{
              wordWrap: "break-word",
              fontSize: "1rem",
              maxWidth: "calc(100% - 120px)",
              whiteSpace: "normal",
            }}
          >
            {producto.nombre}
          </Typography>
          {tieneDescuento ? (
            <>
              {/* Precio anterior tachado */}
              <Typography
                variant="body1"
                color="error"
                sx={{ textDecoration: "line-through" }}
              >
                Precio anterior: ${precioAnterior.toFixed(2)}
              </Typography>
              {/* Precio actual */}
              <Typography variant="body1" color="text.primary">
                Precio actual: ${producto.precio.toFixed(2)}
              </Typography>
            </>
          ) : (
            // Precio sin descuento
            <Typography variant="body1" color="text.primary">
              Precio: ${producto.precio.toFixed(2)}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Stock Actual: {producto.stockActual}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Categoría: {producto.categoria}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            padding: 1,
          }}
        >
          {isPedidoMode ? (
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={handleRemove}
                disabled={cantidad === 0}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1">{cantidad}</Typography>
              <IconButton
                size="small"
                color="primary"
                onClick={handleAdd}
                disabled={cantidad === producto.stockActual}
              >
                <AddIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(producto.id)}
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(producto.id)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Card>
    </Tooltip>
  );
}
