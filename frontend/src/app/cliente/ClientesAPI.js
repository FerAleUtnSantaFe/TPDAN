// Simulación de una API que devuelve clientes
export async function fetchClientes() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { nombre: "Juan Pérez", cuil: "20-12345678-9", email: "juan.perez@email.com" },
                { nombre: "María Gómez", cuil: "27-87654321-5", email: "maria.gomez@email.com" },
                { nombre: "Carlos López", cuil: "23-11223344-8", email: "carlos.lopez@email.com" },
                { nombre: "Ana Fernández", cuil: "25-55667788-2", email: "ana.fernandez@email.com" }
            ]);
        }, 1000);
    });
}

// Ejemplo de uso
fetchClientes().then(clientes => console.log(clientes))