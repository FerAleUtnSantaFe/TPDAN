const BASE_URL = "http://localhost:80/api/clientes"; // Cambia esto si tu backend tiene otra URL base

// Obtener todos los clientes
export async function findClientes() {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
        if (!response.ok) {
            throw new Error(`Error al obtener los clientes: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en findClientes:', error);
        throw error;
    }
}

// Obtener un cliente por ID
export async function findbyIdCliente(idCli) {
    try {
        const response = await fetch(`${BASE_URL}/${idCli}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error al obtener el cliente con ID ${idCli}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en findbyIdCliente:', error);
        throw error;
    }
}

// Crear un nuevo cliente
export async function createCliente(cliente) {

    const obrasLimpias = cliente.obras.map(({ tempId, ...obra }) => obra); // Eliminar tempId de cada obra
    const usuariosLimpios = cliente.usuarios.map(({ tempId, ...usuario }) => usuario); // Eliminar tempId de cada usuario

    const clienteCompleto = {
        ...cliente,
        obras: obrasLimpias,
        usuarios: usuariosLimpios
    };

    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteCompleto)

        });
        if (!response.ok) {
            throw new Error(`Error al crear el cliente: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createCliente:', error);
        throw error;
    }
}

// Actualizar un cliente existente
export async function updateCliente(idCli, cliente) {

    const obrasLimpias = cliente.obras.map(({ tempId, ...obra }) => obra); // Eliminar tempId de cada obra
    const usuariosLimpios = cliente.usuarios.map(({ tempId, ...usuario }) => usuario); // Eliminar tempId de cada usuario

    const clienteCompleto = {
        ...cliente,
        obras: obrasLimpias,
        usuarios: usuariosLimpios
    };

    try {
        const response = await fetch(`${BASE_URL}/${idCli}`, {
            method: 'PUT',
            headers: {

                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteCompleto)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el cliente con ID ${idCli}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en updateCliente:', error);
        throw error;
    }
}

// Eliminar un cliente por ID
export async function deleteCliente(idCli) {
    try {

        const response = await fetch(`${BASE_URL}/${idCli}`, {
            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Error al eliminar el cliente con ID ${idCli}: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error en deleteCliente:', error);
        throw error;
    }
}

export async function updateEstadoObra(idCli, idObra, estado) {
    try {
        const response = await fetch(`${BASE_URL}/${idCli}/${idObra}`, {
            method: 'PUT',
            headers: {

                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estado)
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar el estado de la obra: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateEstadoObra:', error);
        throw error;
    }
}