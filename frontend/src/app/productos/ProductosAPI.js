// Simulación de una API que devuelve productos
// export async function fetchProductos() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve([
//                 { 
//                     nombre: "Producto 1", 
//                     descripcion: "Descripción", 
//                     stockActual: 10, 
//                     stockMinimo: 5, 
//                     precio: 100.50, 
//                     categoria: "CEMENTOS" 
//                 },
//                 { 
//                     nombre: "Producto 2", 
//                     descripcion: "Descripción", 
//                     stockActual: 20, 
//                     stockMinimo: 10, 
//                     precio: 200.75, 
//                     categoria: "PLACAS" 
//                 },
//                 { 
//                     id: 3,
//                     nombre: "Producto 3", 
//                     descripcion: "Descripción", 
//                     stockActual: 30, 
//                     stockMinimo: 15, 
//                     precio: 300.00, 
//                     categoria: "PERFILES" 
//                 },
//                 { 
//                     nombre: "Producto 4", 
//                     descripcion: "Descripción", 
//                     stockActual: 40, 
//                     stockMinimo: 20, 
//                     precio: 400.25, 
//                     categoria: "MORTEROS" 
//                 },
//                 { 
//                     nombre: "Producto 5", 
//                     descripcion: "Descripción", 
//                     stockActual: 50, 
//                     stockMinimo: 25, 
//                     precio: 500.50, 
//                     categoria: "YESERIA" 
//                 },
//                 { 
//                     nombre: "Producto 6", 
//                     descripcion: "Descripción", 
//                     stockActual: 15, 
//                     stockMinimo: 7, 
//                     precio: 150.00, 
//                     categoria: "CEMENTOS" 
//                 },
//                 { 
//                     nombre: "Producto 7", 
//                     descripcion: "Descripción", 
//                     stockActual: 25, 
//                     stockMinimo: 12, 
//                     precio: 250.75, 
//                     categoria: "PLACAS" 
//                 },
//                 { 
//                     nombre: "Producto 8", 
//                     descripcion: "Descripción", 
//                     stockActual: 35, 
//                     stockMinimo: 18, 
//                     precio: 350.00, 
//                     categoria: "PERFILES" 
//                 },
//                 { 
//                     nombre: "Producto 9", 
//                     descripcion: "Descripción", 
//                     stockActual: 45, 
//                     stockMinimo: 22, 
//                     precio: 450.25, 
//                     categoria: "MORTEROS" 
//                 },
//                 { 
//                     nombre: "Producto 10", 
//                     descripcion: "Descripción", 
//                     stockActual: 55, 
//                     stockMinimo: 28, 
//                     precio: 550.50, 
//                     categoria: "YESERIA" 
//                 },
//                 { 
//                     nombre: "Producto 11", 
//                     descripcion: "Descripción", 
//                     stockActual: 12, 
//                     stockMinimo: 6, 
//                     precio: 120.00, 
//                     categoria: "CEMENTOS" 
//                 },
//                 { 
//                     nombre: "Producto 12", 
//                     descripcion: "Descripción", 
//                     stockActual: 22, 
//                     stockMinimo: 11, 
//                     precio: 220.75, 
//                     categoria: "PLACAS" 
//                 },
//                 { 
//                     nombre: "Producto 13", 
//                     descripcion: "Descripción", 
//                     stockActual: 32, 
//                     stockMinimo: 16, 
//                     precio: 320.00, 
//                     categoria: "PERFILES" 
//                 },
//                 { 
//                     nombre: "Producto 14", 
//                     descripcion: "Descripción", 
//                     stockActual: 42, 
//                     stockMinimo: 21, 
//                     precio: 420.25, 
//                     categoria: "MORTEROS" 
//                 },
//                 { 
//                     nombre: "Producto 15", 
//                     descripcion: "Descripción", 
//                     stockActual: 52, 
//                     stockMinimo: 26, 
//                     precio: 520.50, 
//                     categoria: "YESERIA" 
//                 }
//             ]);
//         }, 1000);
//     });
// }


export async function fetchProductos() {
    try {
        console.log("entro al fetch pa??");
        console.log("buildeo bien el frontend paa??");
        const response = await fetch('http://localhost:6180/api/productos');
        if (!response.ok) {
            throw new Error(`Error al obtener los productos : ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en findProductos:', error);
        throw error;
    }
  }


// Ejemplo de uso
fetchProductos().then(productos => console.log(productos));