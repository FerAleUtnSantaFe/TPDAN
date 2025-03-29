export async function fetchProductos() {
  try {
    const response = await fetch("http://localhost:80/api/productos");
    if (!response.ok) {
      throw new Error(
        `Error al obtener los productos : ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en findProductos:", error);
    throw error;
  }
}
