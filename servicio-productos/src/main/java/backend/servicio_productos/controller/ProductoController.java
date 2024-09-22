package backend.servicio_productos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.servicio_productos.exception.ProductoNotFoundException;
import backend.servicio_productos.modelo.Producto;
import backend.servicio_productos.servicio.ProductoService;


@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    @Autowired
    private ProductoService productoService;

    //Logger log = LoggerFactory.getLogger(ProductoController.class);

    // @Autowired
    // EchoClientFeign echoSvc;


    @PostMapping
    //@LogExecutionTime
    public ResponseEntity<Producto> createProducto(@RequestBody @Validated Producto producto) {
        Producto savedProducto = productoService.saveProducto(producto);
        return ResponseEntity.ok(savedProducto);
    }

    // @GetMapping("/test")
    // @LogExecutionTime
    // public String getEcho() {
    //     String resultado = echoSvc.echo();
    //     log.info("Log en test 1!!!! {}",resultado);
    //     return resultado;
    // }

    // @GetMapping("/test2")
    // @LogExecutionTime
    // public String getEcho2() {
    //     RestTemplate restTemplate = new RestTemplate();
    //     String gatewayURL = "http://ms-gateway-svc:8080";
    //     String resultado = restTemplate.getForObject(gatewayURL+"/clientes/api/clientes/echo", String.class);
    //     log.info("Log en test 2 {}",resultado);
    //     return resultado;
    // }

    @GetMapping
    //@LogExecutionTime
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/{id}")
    //@LogExecutionTime
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) throws ProductoNotFoundException {
        return  ResponseEntity.ok(productoService.getProductoById(id));
    }

    @DeleteMapping("/{id}")
    //@LogExecutionTime
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }

}

