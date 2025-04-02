import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Card, CardContent, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

export default function ProductCard({ producto, handleEdit, handleDelete }) {
  // Ruta dinámica para el ícono basado en la categoría
  const iconPath = `/productos/icons/${producto.categoria.toLowerCase()}.png`;

  // Estado para controlar si el mouse está sobre la tarjeta
  const [isHovered, setIsHovered] = useState(false);

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
          <Typography variant="h6" component="div">
            {producto.nombre}
          </Typography>
          <Typography variant="body1" color="text.primary">
            Precio: ${producto.precio}
          </Typography>
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