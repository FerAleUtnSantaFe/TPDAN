export const handleRowSelection = (selection, setSelectedRow) => {
  setSelectedRow(selection[0]);
};

export const handleEdit = async (id, nombre, descripcion, precio) => {
  try {
    console.log("ID:", id);
    console.log("Nombre:", nombre);  
    const response = await fetch(`http://localhost:80/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        descripcion,
        precio,
      }),
    });

    if (response.ok) {
      return { success: true, message: "Producto modificado con éxito" };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Error al modificar el producto" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Error al conectar con el servidor" };
  }
};

export const handleDelete = async (id) => {
  try {
    // Mostrar cuadro de confirmación
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmDelete) {
      return { success: false, message: "Eliminación cancelada por el usuario" };
    }

    console.log("Eliminando producto con ID:", id);

    // Realizar la solicitud DELETE
    const response = await fetch(`http://localhost:80/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return { success: true, message: "Producto eliminado con éxito" };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Error al eliminar el producto" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Error al conectar con el servidor" };
  }
};

export const handleSearchProducto = async (searchProducto, searchCategoria, priceRange) => {
  try {
    // Construir los parámetros de búsqueda
    const params = new URLSearchParams();

    if (searchProducto) {
      params.append("nombre", searchProducto.toLowerCase()); // Convertir a minúsculas
    }
    if (searchCategoria) {
      params.append("categoria", searchCategoria.toLowerCase()); // Convertir a minúsculas
    }
    if (priceRange && priceRange.length === 2) {
      params.append("precioMin", priceRange[0]);
      params.append("precioMax", priceRange[1]);
    }

    console.log("Buscando con parámetros:", params.toString());

    // Realizar la solicitud GET con los parámetros
    const response = await fetch(`http://localhost:80/api/productos?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al buscar productos: ${response.statusText}`);
    }

    // Devolver los resultados de la búsqueda
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en handleSearchProducto:", error);
    return { success: false, message: "Error al buscar productos" };
  }
};