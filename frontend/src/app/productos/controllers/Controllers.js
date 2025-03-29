export const handleRowSelection = (selection, setSelectedRow) => {
  setSelectedRow(selection[0]);
};

export const handleEdit = async (id, nombre, descripcion, precio) => {
  try {
    console.log("ID:", id);
    console.log("Nombre:", nombre);  
    const response = await fetch(`http://localhost:8080/productos/${id}`, {
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

export const handleDelete = (selectedRow) => {
  if (selectedRow) {
    console.log("Delete product with ID:", selectedRow);
  }
};

export const handleSearchProducto = (searchProducto, searchCodigo, priceRange) => {
  console.log("Buscar con:", {
    producto: searchProducto,
    codigo: searchCodigo,
    rangoPrecios: priceRange,
  });
};