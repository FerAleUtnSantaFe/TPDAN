package isi.dan.ms.pedidos.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
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

import isi.dan.ms.pedidos.aop.LogExecutionTime;
import isi.dan.ms.pedidos.exception.PedidoNotFoundException;
import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.EstadoDTO;
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

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final String URL_MS_CLIENTES = "http://ms-gateway-svc:8080/api/clientes/4AD4-$y38r6mD5TmqQ6=/";
    private static final String URL_MS_PRODUCTOS = "http://ms-gateway-svc:8080/api/productos/4AD4-$y38r6mD5TmqQ6=/actualizar-stock";
    private static final Logger log = LoggerFactory.getLogger(PedidoController.class);

    // EJEMPLO DE RUTA /api/pedidos/?clienteId=5&estado=EN_PROCESO
    @GetMapping
    @LogExecutionTime
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
    @LogExecutionTime
    public ResponseEntity<Pedido> getPedidoById(@PathVariable String id) {
        Pedido pedido = pedidoService.getPedido(id);
        return pedido != null ? ResponseEntity.ok(pedido) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @LogExecutionTime
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

    @PutMapping("/{id}")
    @LogExecutionTime
    public ResponseEntity<Pedido> updatePedido(@PathVariable final String id, @RequestBody EstadoDTO nuevoEstado)
            throws PedidoNotFoundException {
        Pedido pedido = pedidoService.getPedido(id);
        if (pedido == null) {
            throw new PedidoNotFoundException("Pedido " + id + " no encontrado");
        }

        Estado estadoActual = pedido.getEstado();
        log.info("Nuevo estado recibido: {}", nuevoEstado.getEstado());
        log.info("Estado actual del pedido: {}", estadoActual);
        // Si pasa de EN_PREPARACION a CANCELADO, enviar mensaje a RabbitMQ
        if (estadoActual == Estado.EN_PREPARACION && "CANCELADO".equals(nuevoEstado.getEstado())) {
            log.info("Creando mensaje RABBIT para pedidoId {}", id);
            List<Map<String, Object>> productosParaActualizar = pedido.getListaProductos().stream()
                    .map(producto -> {
                        Map<String, Object> productoMap = new HashMap<>();
                        productoMap.put("id", producto.getId());
                        productoMap.put("cantidad", producto.getCantidad());
                        return productoMap;
                    })
                    .toList();

            rabbitTemplate.convertAndSend("cola_actualizar-stock", productosParaActualizar);
            log.info("Mensaje enviado a cola_actualizar-stock para pedidoId {}: {}", id, productosParaActualizar);
        }

        // Actualizar el estado del pedido
        if ("ENTREGADO".equals(nuevoEstado.getEstado())) {
            pedido.setEstado(Estado.ENTREGADO);
        } else if ("CANCELADO".equals(nuevoEstado.getEstado())) {
            pedido.setEstado(Estado.CANCELADO);
        } else {
            return ResponseEntity.badRequest().body(null); // Si el estado no es válido, devolver 400
        }
        Pedido pedidoActualizado = pedidoService.savePedido(pedido);

        return ResponseEntity.ok(pedidoActualizado);
    }

    @LogExecutionTime
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

    @LogExecutionTime
    private Double calcularTotalPedidosCliente(Integer clienteId) {
        List<Pedido> pedidosCliente = pedidoService.getPedidos(clienteId);
        return pedidosCliente.stream()
                .filter(pedido -> pedido.getEstado() == Estado.ACEPTADO || pedido.getEstado() == Estado.EN_PREPARACION)
                .mapToDouble(Pedido::getTotal)
                .sum();
    }

    @LogExecutionTime
    private boolean actualizarStockConProductos(Pedido pedido) {
        try {
            ResponseEntity<Boolean> response = restTemplate.exchange(
                    URL_MS_PRODUCTOS, // URL del endpoint
                    HttpMethod.PUT, // Método HTTP
                    new HttpEntity<>(pedido.getListaProductos()), // Cuerpo de la solicitud
                    Boolean.class // Tipo de respuesta esperada
            );
            return response.getBody() != null && response.getBody();
        } catch (Exception e) {
            log.error("Error al actualizar stock con ms-productos para pedidoId {}: {}", pedido.getId(),
                    e.getMessage());
            return false; // Si hay un error, asumimos que no hay stock suficiente
        }
    }

}
