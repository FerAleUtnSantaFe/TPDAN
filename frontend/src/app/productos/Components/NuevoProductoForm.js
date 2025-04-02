import {
  Alert,
  Button,
  Container,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CategoriaSelect from "./CategoriaSelect";

export default function NuevoProductoForm({ handleSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    stockMinimo: "",
    precio: "",
    categoria: "",
    descuentoPromocional: 0,
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limitar la descripción a 170 caracteres
    if (name === "descripcion" && value.length > 170) {
      return;
    }

    if (name === "descuentoPromocional") {
      const numericValue = parseFloat(value);
      if (numericValue < 0 || numericValue > 100) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const result = handleSubmit(formData);
    if (result.success) {
      setAlert({
        open: true,
        message: "Producto creado con éxito",
        severity: "success",
      });
      setFormData({
        nombre: "",
        descripcion: "",
        stockMinimo: "",
        precio: "",
        categoria: "",
        descuentoPromocional: 0,
      });
    } else {
      setAlert({ open: true, message: result.message, severity: "error" });
    }
  };

  return (
    <Container>
      <Typography
        variant="h3"
        color="primary"
        gutterBottom
        sx={{ margin: 1, textAlign: "center" }}
      >
        Gestión de productos: Nuevo Producto
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          required
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          required
          fullWidth
          label="Stock Mínimo"
          name="stockMinimo"
          type="number"
          value={formData.stockMinimo}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          required
          fullWidth
          label="Precio"
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          margin="normal"
        />
        <CategoriaSelect
          value={formData.categoria}
          onChange={(value) => setFormData({ ...formData, categoria: value })}
        />
        <TextField
          required
          fullWidth
          label="Descuento Promocional"
          name="descuentoPromocional"
          type="number"
          value={formData.descuentoPromocional}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          helperText="Ingrese un valor entre 0 y 100"
        />
        <TextField
          required
          fullWidth
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          margin="normal"
          helperText={`${formData.descripcion.length}/170 caracteres`}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginTop: 2 }}
        >
          Crear Producto
        </Button>
      </form>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
}
