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
