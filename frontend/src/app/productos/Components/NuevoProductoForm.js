import {
  Alert,
  Button,
  Container,
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
});

const [alert, setAlert] = useState({ open: false, message: "", severity: "" });

const handleChange = (e) => {
  const { name, value } = e.target;

  // Limitar la descripción a 170 caracteres
  if (name === "descripcion" && value.length > 170) {
    return;
  }

  setFormData({ ...formData, [name]: value });
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const result = handleSubmit(formData);
  if (result.success) {
    setAlert({ open: true, message: "Producto creado con éxito", severity: "success" });
    setFormData({ nombre: "", descripcion: "", stockMinimo: "", precio: "", categoria: "" });
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
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        margin="normal"
        helperText={`${formData.descripcion.length}/170 caracteres`}
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