// Obtener productos
export async function fetchProductos() {
  try {
    const response = await fetch("http://localhost:80/api/productos");
    if (!response.ok) {
      throw new Error(
        `Error al obtener los productos: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en fetchProductos:", error);
    throw error;
  }
}

// Crear producto
export async function createProducto(producto) {
  try {
    const response = await fetch("http://localhost:80/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error al crear el producto: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createProducto:", error);
    throw error;
  }
}

// Obtener producto por ID
export async function getProductoById(id) {
  try {
    const response = await fetch(`http://localhost:80/api/productos/${id}`);
    if (!response.ok) {
      throw new Error(
        `Error al obtener el producto con ID ${id}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getProductoById:", error);
    throw error;
  }
}


// Editar producto
export async function editProducto(id, producto) {
  const productoAModificar = await getProductoById(id);
  const categoriaActual = productoAModificar.categoria; // Obtén la categoría actual del producto

  try {
    // Incluye la categoría previa en el cuerpo de la solicitud
    const response = await fetch(`http://localhost:80/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...producto, // Incluye los datos del producto (nombre, descripción, precio, etc.)
        categoria: categoriaActual, // Mantén la categoría previa
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error al editar el producto: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en editProducto:", error);
    throw error;
  }
}

// Eliminar producto
export async function deleteProducto(id) {
  try {
    const response = await fetch(`http://localhost:80/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error al eliminar el producto: ${response.statusText}`
      );
    }

    return { success: true, message: "Producto eliminado con éxito" };
  } catch (error) {
    console.error("Error en deleteProducto:", error);
    throw error;
  }
}