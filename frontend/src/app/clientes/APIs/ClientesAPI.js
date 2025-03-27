// Simulación de una API que devuelve clientes
export async function fetchClientes() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                  "nombre": "Juan Pérez",
                  "cuil": "20123456789",
                  "correo": "juan.perez@correo.com",
                  "maximoDescubierto": 50000,
                  "maximoObras": 3,
                  "obras": [
                    { "direccion": "Calle Mitre 123", "latitud": "-34.6037", "longitud": "-58.3816", "presupuesto": "1200000", "estado": "En progreso" },
                    { "direccion": "Avenida Belgrano 456", "latitud": "-34.6101", "longitud": "-58.3772", "presupuesto": "800000", "estado": "Pendiente" }
                  ],
                  "usuarios": [
                    { "dni": 34782653, "nombre": "Carlos", "apellido": "Ramírez", "correo": "carlos.ramirez@algo.com" },
                    { "dni": 35698214, "nombre": "Mariana", "apellido": "López", "correo": "mariana.lopez@algo.com" }
                  ]
                },
                {
                  "nombre": "María Gómez",
                  "cuil": "27876543215",
                  "correo": "maria.gomez@correo.com",
                  "maximoDescubierto": 75000,
                  "maximoObras": 5,
                  "obras": [
                    { "direccion": "Calle San Martín 789", "latitud": "-34.6058", "longitud": "-58.3839", "presupuesto": "1500000", "estado": "En ejecución" },
                    { "direccion": "Avenida Corrientes 1010", "latitud": "-34.5992", "longitud": "-58.3853", "presupuesto": "950000", "estado": "Finalizado" }
                  ],
                  "usuarios": [
                    { "dni": 31254879, "nombre": "Fernando", "apellido": "Sosa", "correo": "fernando.sosa@algo.com" },
                    { "dni": 32897564, "nombre": "Lucía", "apellido": "Martínez", "correo": "lucia.martinez@algo.com" }
                  ]
                },
                {
                  "nombre": "Carlos López",
                  "cuil": "23112233448",
                  "correo": "carlos.lopez@correo.com",
                  "maximoDescubierto": 60000,
                  "maximoObras": 2,
                  "obras": [
                    { "direccion": "Avenida Rivadavia 500", "latitud": "-34.6085", "longitud": "-58.3921", "presupuesto": "1100000", "estado": "En planificación" },
                    { "direccion": "Calle Tucumán 1340", "latitud": "-34.6032", "longitud": "-58.3845", "presupuesto": "700000", "estado": "Pendiente" }
                  ],
                  "usuarios": [
                    { "dni": 33745298, "nombre": "Pablo", "apellido": "Fernández", "correo": "pablo.fernandez@algo.com" },
                    { "dni": 34125987, "nombre": "Sofía", "apellido": "García", "correo": "sofia.garcia@algo.com" }
                  ]
                }
              ]
              );
        }, 500);
    });
}

export async function deleteCliente(clientecuil) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                  "nombre": "Juan Pérez",
                  "cuil": "20123456789",
                  "correo": "juan.perez@correo.com",
                  "maximoDescubierto": 50000,
                  "maximoObras": 3,
                  "obras": [
                    { "direccion": "Calle Mitre 123", "latitud": "-34.6037", "longitud": "-58.3816", "presupuesto": "1200000", "estado": "En progreso" },
                    { "direccion": "Avenida Belgrano 456", "latitud": "-34.6101", "longitud": "-58.3772", "presupuesto": "800000", "estado": "Pendiente" }
                  ],
                  "usuarios": [
                    { "dni": 34782653, "nombre": "Carlos", "apellido": "Ramírez", "correo": "carlos.ramirez@algo.com" },
                    { "dni": 35698214, "nombre": "Mariana", "apellido": "López", "correo": "mariana.lopez@algo.com" }
                  ]
                },
                {
                  "nombre": "María Gómez",
                  "cuil": "27876543215",
                  "correo": "maria.gomez@correo.com",
                  "maximoDescubierto": 75000,
                  "maximoObras": 5,
                  "obras": [
                    { "direccion": "Calle San Martín 789", "latitud": "-34.6058", "longitud": "-58.3839", "presupuesto": "1500000", "estado": "En ejecución" },
                    { "direccion": "Avenida Corrientes 1010", "latitud": "-34.5992", "longitud": "-58.3853", "presupuesto": "950000", "estado": "Finalizado" }
                  ],
                  "usuarios": [
                    { "dni": 31254879, "nombre": "Fernando", "apellido": "Sosa", "correo": "fernando.sosa@algo.com" },
                    { "dni": 32897564, "nombre": "Lucía", "apellido": "Martínez", "correo": "lucia.martinez@algo.com" }
                  ]
                },
                {
                  "nombre": "Carlos López",
                  "cuil": "23112233448",
                  "correo": "carlos.lopez@correo.com",
                  "maximoDescubierto": 60000,
                  "maximoObras": 2,
                  "obras": [
                    { "direccion": "Avenida Rivadavia 500", "latitud": "-34.6085", "longitud": "-58.3921", "presupuesto": "1100000", "estado": "En planificación" },
                    { "direccion": "Calle Tucumán 1340", "latitud": "-34.6032", "longitud": "-58.3845", "presupuesto": "700000", "estado": "Pendiente" }
                  ],
                  "usuarios": [
                    { "dni": 33745298, "nombre": "Pablo", "apellido": "Fernández", "correo": "pablo.fernandez@algo.com" },
                    { "dni": 34125987, "nombre": "Sofía", "apellido": "García", "correo": "sofia.garcia@algo.com" }
                  ]
                }
              ].filter(cliente => cliente.cuil !== clientecuil)
              );
        }, 500);
    });
}

export async function createCliente(cliente){
  try {
    const response = await fetch('/clientes', {  // Reemplaza con la URL real de tu API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    if (!response.ok) {
        throw new Error(`Error al crear el cliente: ${response.statusText}`);
    }

    return await response.json(); // Devuelve el cliente creado
} catch (error) {
    console.error('Error en createCliente:', error);
    throw error;
}
}