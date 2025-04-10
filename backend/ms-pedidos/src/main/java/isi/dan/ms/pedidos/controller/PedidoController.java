package isi.dan.ms.pedidos.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import isi.dan.ms.pedidos.exception.PedidoNotFoundException;
import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.Pedido;
import isi.dan.ms.pedidos.servicio.PedidoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private RestTemplate restTemplate;
    private static final String URL_MS_CLIENTES = "http://ms-gateway-svc:8080/api/clientes/";
    private static final String URL_MS_PRODUCTOS = "http://ms-gateway-svc:8080/api/productos/actualizar-stock";
    private static final Logger log = LoggerFactory.getLogger(PedidoController.class);


    // EJEMPLO DE RUTA /api/pedidos/?clienteId=5&estado=EN_PROCESO
    @GetMapping
    public List<Pedido> getAllPedidos(
            @RequestParam(required = false) Integer clienteId,
            @RequestParam(required = false) Estado estado) {

        if (clienteId != null && estado != null) {
            return pedidoService.getPedidos(clienteId, estado);
        } else if (clienteId != null) {
            return pedidoService.getPedidos(clienteId);
        } else if (estado != null) {
            return pedidoService.getPedidos(estado);
        }

        return pedidoService.getAllPedidos(); // Devuelve todos si no hay filtros
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable String id) {
        Pedido pedido = pedidoService.getPedido(id);
        return pedido != null ? ResponseEntity.ok(pedido) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Pedido createPedido(@RequestBody @Validated Pedido pedidoNuevo) {
        // Verificar saldo con ms-clientes
        boolean saldoSuficiente = verificarSaldoConCliente(pedidoNuevo.getCliente(), pedidoNuevo.getTotal());
        if (!saldoSuficiente) {
            pedidoNuevo.setEstado(Estado.RECHAZADO);
            return pedidoService.savePedido(pedidoNuevo);
        }
    
        // Actualizar stock con ms-productos
        boolean stockSuficiente = actualizarStockConProductos(pedidoNuevo);
        if (stockSuficiente) {
            pedidoNuevo.setEstado(Estado.EN_PREPARACION);
        } else {
            pedidoNuevo.setEstado(Estado.ACEPTADO);
        }
    
        return pedidoService.savePedido(pedidoNuevo);
    }

    private boolean verificarSaldoConCliente(Integer clienteId, Double totalPedido) {
        // Calcula el total de los pedidos en estado "ACEPTADO" o "EN_PREPARACION"
        Double totalPedidosCliente = calcularTotalPedidosCliente(clienteId);

        // Construye la URL con el total acumulado
        String url = URL_MS_CLIENTES + clienteId + "/" + (totalPedidosCliente + totalPedido);
        try {
            ResponseEntity<Boolean> response = restTemplate.getForEntity(url, Boolean.class);
            log.info("Respuesta de verificacion de saldo con cliente: {}", response.getStatusCode());
            return response.getBody() != null && response.getBody();
        } catch (Exception e) {
            log.error("Error al verificar saldo con ms-clientes para clienteId {}: {}", clienteId, e.getMessage());
            return false; // Si hay un error, asumimos que no hay saldo suficiente
        }
    }

    private Double calcularTotalPedidosCliente(Integer clienteId) {
        List<Pedido> pedidosCliente = pedidoService.getPedidos(clienteId);
        return pedidosCliente.stream()
                .filter(pedido -> pedido.getEstado() == Estado.ACEPTADO || pedido.getEstado() == Estado.EN_PREPARACION)
                .mapToDouble(Pedido::getTotal)
                .sum();
    }

    private boolean actualizarStockConProductos(Pedido pedido) {
        try {
            ResponseEntity<Boolean> response = restTemplate.exchange(
                URL_MS_PRODUCTOS, // URL del endpoint
                HttpMethod.PUT,   // Método HTTP
                new HttpEntity<>(pedido.getListaProductos()), // Cuerpo de la solicitud
                Boolean.class     // Tipo de respuesta esperada
        );
            return response.getBody() != null && response.getBody();
        } catch (Exception e) {
            log.error("Error al actualizar stock con ms-productos para pedidoId {}: {}", pedido.getId(), e.getMessage());
            return false; // Si hay un error, asumimos que no hay stock suficiente
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> updateEstadoPedido(@PathVariable final String id, @RequestBody Estado estado)
            throws PedidoNotFoundException {
        if (pedidoService.getPedido(id) == null) {
            throw new PedidoNotFoundException("Pedido " + id + " no encontrado");
        }
        return ResponseEntity.ok(pedidoService.updateEstado(id, estado));
    }

}
