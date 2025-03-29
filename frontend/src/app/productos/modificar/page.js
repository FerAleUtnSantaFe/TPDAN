"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { handleEdit } from "../controllers/Controllers";

import { Box, Button, TextField, Typography } from "@mui/material";

function ModificarProducto() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Obtener el ID del producto desde la URL

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await handleEdit(id, nombre, descripcion, precio);

    if (result.success) {
      alert(result.message);
      router.push("/productos"); // Redirigir de vuelta a la lista de productos
    } else {
      alert(result.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Modificar Producto
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Campo Nombre */}
          <TextField
            label="Nombre"
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          {/* Campo Descripción */}
          <TextField
            label="Descripción"
            variant="outlined"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />

          {/* Campo Precio */}
          <TextField
            label="Precio"
            type="number"
            variant="outlined"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />

          {/* Botón Guardar Cambios */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ alignSelf: "center" }}
          >
            Guardar Cambios
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default function Modificar() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ModificarProducto />
    </Suspense>
  );
}