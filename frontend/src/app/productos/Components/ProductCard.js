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
  onCantidadChange,
  isPedidoMode,
}) {
  const [cantidad, setCantidad] = useState(0);

  const handleAdd = () => {
    const nuevaCantidad = cantidad + 1;
    setCantidad(nuevaCantidad);
    if (onCantidadChange) onCantidadChange(producto, nuevaCantidad);
  };

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
          width: 350,
          height: 180,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Imagen en esquina superior derecha */}
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
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Contenido textual */}
        <CardContent
          sx={{
            paddingBottom: 0,
            paddingRight: "110px", // espacio para que el texto no se solape con la imagen
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: "1rem",
              lineHeight: "1.2em",
              marginBottom: 0.5,
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {producto.nombre}
          </Typography>

          {tieneDescuento ? (
            <Typography variant="body1">
              <Box
                component="span"
                sx={{
                  color: "red",
                  textDecoration: "line-through",
                  marginRight: 1,
                }}
              >
                ${precioAnterior.toFixed(2)}
              </Box>
              <Box component="span" sx={{ color: "green" }}>
                ${producto.precio.toFixed(2)}
              </Box>
            </Typography>
          ) : (
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

        {/* Controles */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
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
