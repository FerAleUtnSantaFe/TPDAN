package isi.dan.ms_productos.rabbit;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import isi.dan.ms_productos.conf.RabbitMQConfig;
import isi.dan.ms_productos.dto.PedidoDTO;
import isi.dan.ms_productos.servicio.ProductoService;

@Component
public class PedidoConsumer {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductoService productoService;

    @RabbitListener(queues = RabbitMQConfig.STOCK_UPDATE_QUEUE)
    public void recibirMensaje(String mensaje) {
        try {
            PedidoDTO pedido = objectMapper.readValue(mensaje, PedidoDTO.class);

            System.out.println("=== Pedido recibido ===");
            System.out.println(pedido); // usa toString()
            System.out.println("Cantidad de productos en el pedido: " + pedido.getListaProductos().size());

            for (PedidoDTO.ProductoDTO prod : pedido.getListaProductos()) {
                productoService.getProductoById(prod.getId()).ifPresentOrElse(producto -> {
                    int nuevoStock = producto.getStockActual() - prod.getCantidad();
                    producto.setStockActual(Math.max(nuevoStock, 0)); // evita stock negativo
                    System.out.println(
                            "Stock actual para producto ID " + producto.getId() + ": " + producto.getStockActual());
                    productoService.updateProducto(producto);
                    System.out.println("Stock actualizado para producto ID " + producto.getId());
                }, () -> {
                    System.err.println("Producto no encontrado: ID " + prod.getId());
                });
            }

        } catch (Exception e) {
            System.err.println("Error procesando mensaje RabbitMQ: " + e.getMessage());
        }
    }
}
