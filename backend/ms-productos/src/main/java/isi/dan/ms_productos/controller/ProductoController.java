package isi.dan.ms_productos.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import isi.dan.ms_productos.aop.LogExecutionTime;
import isi.dan.ms_productos.exception.ProductoNotFoundException;
import isi.dan.ms_productos.modelo.Categoria;
import isi.dan.ms_productos.modelo.Producto;
import isi.dan.ms_productos.servicio.ProductoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    @Autowired
    private ProductoService productoService;

    Logger log = LoggerFactory.getLogger(ProductoController.class);

    @PostMapping
    @LogExecutionTime
    public ResponseEntity<Producto> createProducto(@RequestBody @Validated Producto producto) {
        Producto savedProducto = productoService.saveProducto(producto);
        return ResponseEntity.ok(savedProducto);
    }

    @GetMapping
    @LogExecutionTime
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/{id}")
    @LogExecutionTime
    public ResponseEntity<Producto> getProductoById(@PathVariable Integer id) {
        Optional<Producto> producto = productoService.getProductoById(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get by Categoria
    @GetMapping("/categoria/{categoria}")
    @LogExecutionTime
    public List<Producto> getProductosByCategoria(@PathVariable String categoria) throws ProductoNotFoundException {
        try {
            Categoria cat = Categoria.valueOf(categoria.toUpperCase());
            return productoService.getProductosByCategoria(cat);
        } catch (IllegalArgumentException e) {
            throw new ProductoNotFoundException(categoria);
        }
    }

    @DeleteMapping("/{id}")
    @LogExecutionTime
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }

    // Delete by Categoria
    @DeleteMapping("/categoria/{categoria}")
    @LogExecutionTime
    public ResponseEntity<Void> deleteByCategoria(@PathVariable String categoria) throws ProductoNotFoundException {
        try {
            Categoria cat = Categoria.valueOf(categoria.toUpperCase());
            productoService.deleteByCategoria(cat);
            return ResponseEntity.noContent().build();
        } catch(IllegalArgumentException e ){
            throw new ProductoNotFoundException(categoria);
        }
    }

    @PutMapping("/{id}")
    @LogExecutionTime
    public ResponseEntity<Producto> updateProducto(@PathVariable final Integer id, @RequestBody Producto producto) throws ProductoNotFoundException{
        if(!productoService.getProductoById(id).isPresent()){
            throw new ProductoNotFoundException("Producto "+id+" no encontrado");
        }
        producto.setId(id);
        return ResponseEntity.ok(productoService.updateProducto(producto));
    }

}

