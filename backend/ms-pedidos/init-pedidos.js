db = db.getSiblingDB('pedidosdb'); // Cambia a la base de datos 'pedidosdb'

db.pedidos.insertOne({
    "id": null,
    "fecha": null,
    "numeroPedido": null,
    "usuario": "",
    "observaciones": "",
    "total": null,
    "obra": null,
    "cliente": null,
    "listaProductos": [],
    "estadosPedido": [],
    "estado": null
});