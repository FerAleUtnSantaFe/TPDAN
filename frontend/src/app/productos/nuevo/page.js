"use client";

import { useRouter } from "next/navigation"; // Importa useRouter
import NavBar from "../../Components/NavBar";
import { createProducto } from "../APIs/ProductosAPI";
import NuevoProductoForm from "../Components/NuevoProductoForm";

export default function NuevoProducto() {
  const router = useRouter(); // Inicializa el hook useRouter

  const handleSubmit = async (formData) => {
    try {
      const result = await createProducto(formData); // Usa el resultado devuelto por createProducto
      console.log("Resultado de createProducto:", result);

      // Si el producto se creó correctamente, redirige a la página principal
      router.push("/productos");
      return { success: true };
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      return {
        success: false,
        message: error.message || "Error al conectar con el servidor",
      };
    }
  };

  return (
    <div>
      <NavBar />
      <NuevoProductoForm handleSubmit={handleSubmit} />
    </div>
  );
}
