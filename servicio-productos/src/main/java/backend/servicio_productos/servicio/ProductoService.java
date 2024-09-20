package backend.servicio_productos.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.servicio_productos.dao.ProductoRepository;
import backend.servicio_productos.exception.ProductoNotFoundException;
import backend.servicio_productos.modelo.Producto;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;
    // Logger log = LoggerFactory.getLogger(ProductoService.class);

    // @RabbitListener(queues = RabbitMQConfig.STOCK_UPDATE_QUEUE)
    // public void handleStockUpdate(Message msg) {
    //     log.info("Recibido {}", msg);
    //     // buscar el producto
    //     // actualizar el stock
    //     // verificar el punto de pedido y generar un pedido
    // }



    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Producto getProductoById(Long id) throws ProductoNotFoundException{
        return productoRepository.findById(id).orElseThrow(() -> new ProductoNotFoundException(id));
    }

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }
}


