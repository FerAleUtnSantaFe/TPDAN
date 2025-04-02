package isi.dan.ms.pedidos.controller;
import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.qos.logback.classic.Logger;
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

    // EJEMPLO DE RUTA /api/pedidos/?clienteId=5&estado=EN_PROCESO
    @GetMapping
    public List<Pedido> getAllPedidos( 
        @RequestParam(required = false) String clienteId,
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable String id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public Pedido createPedido(@RequestBody @Validated Pedido pedido) {
        return pedidoService.savePedido(pedido);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> updateEstadoPedido(@PathVariable final String id, @RequestBody Estado estado) throws PedidoNotFoundException {
        if (pedidoService.getPedido(id) == null) {
            throw new PedidoNotFoundException("Pedido "+id+" no encontrado");
        }
        return ResponseEntity.ok(pedidoService.updateEstado(id, estado));
    }

}

