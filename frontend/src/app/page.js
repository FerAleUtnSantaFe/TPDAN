'use client';
import Image from "next/image";
import Link from "next/link";
import { Container } from "@mui/material";
import Button from "@mui/material";

export default function Home() {
  return (
      <Container>
        <div>
          <h1>Gestion de Pedidos DAN</h1>
          <Link href="/clientes">
            <button>Go to Clientes</button>
          </Link>
          <Link href="/productos">
            <button>Go to Productos</button>
          </Link>
          <Link href="/pedidos">
            <button>Go to Pedidos</button>
          </Link>
        </div>
      </Container>
  );
}
