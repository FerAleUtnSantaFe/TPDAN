const BASE_URL = "http://localhost:80/api/pedidos"; // Cambia esto si tu backend tiene otra URL base

// Obtener todos los clientes
export async function findPedidos() {
    try {
        const response = await fetch(`${BASE_URL}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los pedidos: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en findPedidos:', error);
        throw error;
    }
}

// Obtener un pedido por ID
export async function findbyIdpedido(idPedido) {
    try {
        const response = await fetch(`${BASE_URL}/${idPedido}`);
        if (!response.ok) {
            throw new Error(`Error al obtener el pedido con ID ${idPedido}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en findbyIdpedido:', error);
        throw error;
    }
}

// Crear un nuevo pedido
export async function createPedido(pedido) {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        if (!response.ok) {
            throw new Error(`Error al crear el pedido: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createPedido:', error);
        throw error;
    }
}

// Actualizar un pedido existente
export async function updatePedido(idPedido, pedido) {
    try {
        const response = await fetch(`${BASE_URL}/${idPedido}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido)
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar el pedido con ID ${idPedido}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en updatePedido:', error);
      throw error;
    }
  }

// Eliminar un pedido por ID
export async function deletePedido(idPedido) {
    try {
        console.log(idPedido);
        const response = await fetch(`${BASE_URL}/${idPedido}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar el pedido con ID ${idPedido}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en deletePedido:', error);
        throw error;
    }
}