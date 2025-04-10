package isi.dan.ms.pedidos.servicio;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import isi.dan.ms.pedidos.dao.PedidoRepository;
import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.Pedido;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    Logger log = LoggerFactory.getLogger(PedidoService.class);

    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido getPedido(String id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public List<Pedido> getPedidos(Integer cliente) {
        return pedidoRepository.findByCliente(cliente).orElse(null);
    }

    public List<Pedido> getPedidos(Estado estado) {
        return pedidoRepository.findByEstado(estado).orElse(null);
    }

    public List<Pedido> getPedidos(Integer clienteId, Estado estado) {
        return pedidoRepository.findByClienteAndEstado(clienteId, estado).orElse(null);
    }

    public Pedido savePedido(Pedido pedido) {
        Pedido pedidoNuevo = pedidoRepository.save(pedido);
        log.info("EN MS-PEDIDOS CREADO PEDIDO : {}", pedido);
        return pedidoNuevo;
    }

    public Pedido updateEstado(String id, Estado estado) {
        Pedido pedido = pedidoRepository.findById(id).get();
        pedido.agregarEstado(estado);
        return pedidoRepository.save(pedido);
    }

}
