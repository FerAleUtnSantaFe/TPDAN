// Simulación de una API que devuelve productos
export async function fetchProductos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { 
                    nombre: "Producto 1", 
                    descripcion: "Descripción del producto 1", 
                    stockActual: 10, 
                    stockMinimo: 5, 
                    precio: 100.50, 
                    categoria: "CEMENTOS" 
                },
                { 
                    nombre: "Producto 2", 
                    descripcion: "Descripción del producto 2", 
                    stockActual: 20, 
                    stockMinimo: 10, 
                    precio: 200.75, 
                    categoria: "PLACAS" 
                },
                { 
                    nombre: "Producto 3", 
                    descripcion: "Descripción del producto 3", 
                    stockActual: 30, 
                    stockMinimo: 15, 
                    precio: 300.00, 
                    categoria: "PERFILES" 
                },
                { 
                    nombre: "Producto 4", 
                    descripcion: "Descripción del producto 4", 
                    stockActual: 40, 
                    stockMinimo: 20, 
                    precio: 400.25, 
                    categoria: "MORTEROS" 
                },
                { 
                    nombre: "Producto 5", 
                    descripcion: "Descripción del producto 5", 
                    stockActual: 50, 
                    stockMinimo: 25, 
                    precio: 500.50, 
                    categoria: "YESERIA" 
                },
                { 
                    nombre: "Producto 6", 
                    descripcion: "Descripción del producto 6", 
                    stockActual: 15, 
                    stockMinimo: 7, 
                    precio: 150.00, 
                    categoria: "CEMENTOS" 
                },
                { 
                    nombre: "Producto 7", 
                    descripcion: "Descripción del producto 7", 
                    stockActual: 25, 
                    stockMinimo: 12, 
                    precio: 250.75, 
                    categoria: "PLACAS" 
                },
                { 
                    nombre: "Producto 8", 
                    descripcion: "Descripción del producto 8", 
                    stockActual: 35, 
                    stockMinimo: 18, 
                    precio: 350.00, 
                    categoria: "PERFILES" 
                },
                { 
                    nombre: "Producto 9", 
                    descripcion: "Descripción del producto 9", 
                    stockActual: 45, 
                    stockMinimo: 22, 
                    precio: 450.25, 
                    categoria: "MORTEROS" 
                },
                { 
                    nombre: "Producto 10", 
                    descripcion: "Descripción del producto 10", 
                    stockActual: 55, 
                    stockMinimo: 28, 
                    precio: 550.50, 
                    categoria: "YESERIA" 
                },
                { 
                    nombre: "Producto 11", 
                    descripcion: "Descripción del producto 11", 
                    stockActual: 12, 
                    stockMinimo: 6, 
                    precio: 120.00, 
                    categoria: "CEMENTOS" 
                },
                { 
                    nombre: "Producto 12", 
                    descripcion: "Descripción del producto 12", 
                    stockActual: 22, 
                    stockMinimo: 11, 
                    precio: 220.75, 
                    categoria: "PLACAS" 
                },
                { 
                    nombre: "Producto 13", 
                    descripcion: "Descripción del producto 13", 
                    stockActual: 32, 
                    stockMinimo: 16, 
                    precio: 320.00, 
                    categoria: "PERFILES" 
                },
                { 
                    nombre: "Producto 14", 
                    descripcion: "Descripción del producto 14", 
                    stockActual: 42, 
                    stockMinimo: 21, 
                    precio: 420.25, 
                    categoria: "MORTEROS" 
                },
                { 
                    nombre: "Producto 15", 
                    descripcion: "Descripción del producto 15", 
                    stockActual: 52, 
                    stockMinimo: 26, 
                    precio: 520.50, 
                    categoria: "YESERIA" 
                }
            ]);
        }, 1000);
    });
}

// Ejemplo de uso
fetchProductos().then(productos => console.log(productos));