"use client";

import NavBar from "@/app/Components/NavBar";
import ProductGrid from "@/app/productos/Components/ProductGrid";
import { Container, Typography } from "@mui/material";

export default function ProductosTarjetas() {
  return (
    <div>
      <NavBar />
      <Container>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            margin: 2,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "2.5rem",
            textTransform: "uppercase",
            color: "primary.main",
          }}
        >
          Gestión de Producto
        </Typography>
        <ProductGrid isPedidoMode={false} />
      </Container>
    </div>
  );
}
