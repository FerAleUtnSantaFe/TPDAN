"use client";

import { Container, Typography } from "@mui/material";
import NavBar from "../Components/NavBar";
import DataGridPedidos from "./Components/DataGridPedidos";

export default function PedidosPage() {
  return (
    <div>
      <NavBar />
      <Container>
        <Typography
          variant="h1"
          gutterBottom
          sx={{ margin: 2, textAlign: "center" }}
        >
          Gestión de pedidos
        </Typography>
            <DataGridPedidos />
      </Container>
    </div>
  );
}
