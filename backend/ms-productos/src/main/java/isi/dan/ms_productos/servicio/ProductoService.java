package isi.dan.ms_productos.servicio;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import isi.dan.ms_productos.dao.ProductoRepository;
import isi.dan.ms_productos.exception.ProductoNotFoundException;
import isi.dan.ms_productos.modelo.Categoria;
import isi.dan.ms_productos.modelo.Producto;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;
    Logger log = LoggerFactory.getLogger(ProductoService.class);

    // @RabbitListener(queues = RabbitMQConfig.STOCK_UPDATE_QUEUE)
    // public void handleStockUpdate(OrderMessage orderMessage) {
    //     log.info("Recibido {}", orderMessage);
    //     orderMessage.getOrderItems().forEach(orderItem -> {
    //         Optional<Producto> productoOptional = productoRepository.findById(orderItem.getProductId());
    //         if (productoOptional.isPresent()) {
    //             Producto producto = productoOptional.get();
    //             // producto.setStockActual(producto.getStockActual() - orderItem.getQuantity());
    //             // // posiblemente necesite el caso de que no haya suficiente stock, aunque
    //             // posiblemente se maneje en frontend
    //             producto.setStockActual(1);
    //             productoRepository.save(producto);
    //         } else {
    //             log.warn("Producto no encontrado con id: {}", orderItem.getProductId());
    //         }
    //     });
    

    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> getProductoById(Integer id) {
        return productoRepository.findById(id);
    }

    public List<Producto> getProductosByCategoria(Categoria categoria) throws ProductoNotFoundException {
        Optional<List<Producto>> productos = Optional.ofNullable(productoRepository.findByCategoria(categoria));

        if (productos.isPresent()) {
            return productos.get();
        } else {
            throw new ProductoNotFoundException(categoria);
        }
    }

    public void deleteProducto(Integer id) {
        productoRepository.deleteById(id);
    }

    public void deleteByCategoria(Categoria categoria) {
        productoRepository.deleteByCategoria(categoria);
    }

    public Producto updateProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public List<Producto> saveAll(List<Producto> productos) {
        return productoRepository.saveAll(productos);
    }
}
