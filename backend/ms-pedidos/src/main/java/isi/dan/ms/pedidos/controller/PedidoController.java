package isi.dan.ms.pedidos.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.Pedido;
import isi.dan.ms.pedidos.servicio.PedidoService;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable String id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }
}

