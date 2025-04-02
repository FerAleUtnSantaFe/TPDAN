import { deleteProducto, editProducto } from "../APIs/ProductosAPI";

// Editar producto

export const handleEdit = async (
  id,
  nombre,
  descripcion,
  precio,
  stockActual,
  stockMinimo
) => {
  try {
    const producto = { nombre, descripcion, precio, stockActual, stockMinimo };
    const result = await editProducto(id, producto);

    return {
      success: true,
      message: "Producto modificado con éxito",
      data: result,
    };
  } catch (error) {
    console.error("Error en handleEdit:", error);
    return {
      success: false,
      message: error.message || "Error al modificar el producto",
    };
  }
};

// Eliminar producto
export const handleDelete = async (id) => {
  try {
    // Mostrar cuadro de confirmación
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirmDelete) {
      return {
        success: false,
        message: "Eliminación cancelada por el usuario",
      };
    }

    console.log("Eliminando producto con ID:", id);

    const result = await deleteProducto(id);
    return result;
  } catch (error) {
    console.error("Error en handleDelete:", error);
    return {
      success: false,
      message: error.message || "Error al eliminar el producto",
    };
  }
};

// Filtrar productos
export const handleSearchProducto = (
  productos,
  searchProducto,
  searchCategoria,
  priceRange
) => {
  // Convertir los valores de búsqueda a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
  const lowerCaseSearchProducto = searchProducto.toLowerCase();
  const lowerCaseSearchCategoria = searchCategoria.toLowerCase();

  // Filtrar los productos
  const filteredProductos = productos.filter((producto) => {
    const matchesNombre = searchProducto
      ? producto.nombre?.toLowerCase() === lowerCaseSearchProducto // Comparación exacta
      : true; // Si no se especifica el nombre, coinciden todos

    const matchesCategoria = searchCategoria
      ? producto.categoria?.toLowerCase().includes(lowerCaseSearchCategoria)
      : true; // Si no se especifica la categoría, coinciden todos

    const matchesPrecio =
      producto.precio >= priceRange[0] && producto.precio <= priceRange[1]; // Verificar si el precio está dentro del rango

    return matchesNombre && matchesCategoria && matchesPrecio;
  });

  return filteredProductos;
};
