import DeleteIcon from "@mui/icons-material/Delete";
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

export default function ProductCard({ producto, handleEdit, handleDelete }) {
  // Ruta dinámica para el ícono basado en la categoría
  const iconPath = `/productos/icons/${producto.categoria.toLowerCase()}.png`;

  // Estado para controlar si el mouse está sobre la tarjeta
  const [isHovered, setIsHovered] = useState(false);

  // Calcular el precio anterior (sin descuento) y el precio actual
  const precioAnterior =
    producto.precio / (1 - producto.descuentoPromocional / 100);
  const tieneDescuento = producto.descuentoPromocional > 0;

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
      open={isHovered} // Controla si el tooltip está visible
    >
      <Card
        sx={{
          height: "100%",
          minWidth: 350,
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)} // Mostrar tooltip al pasar el mouse
        onMouseLeave={() => setIsHovered(false)} // Ocultar tooltip al salir el mouse
      >
        {/* Ícono de categoría */}
        <Box
          component="img"
          src={iconPath}
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
              wordWrap: "break-word", // Permite que el texto haga wrap si es muy largo
              fontSize: "1rem", // Ajusta el tamaño de la fuente si es necesario
              maxWidth: "calc(100% - 120px)", // Evita que el texto solape la imagen (ajusta el ancho máximo)
              whiteSpace: "normal", // Asegura que el texto haga wrap en lugar de desbordarse
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
        </Box>
      </Card>
    </Tooltip>
  );
}
