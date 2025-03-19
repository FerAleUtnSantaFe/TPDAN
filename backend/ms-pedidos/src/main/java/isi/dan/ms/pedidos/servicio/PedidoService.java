package isi.dan.ms.pedidos.servicio;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import isi.dan.ms.pedidos.dao.PedidoRepository;
import isi.dan.ms.pedidos.modelo.Cliente;
import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.Pedido;
@Service
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    Logger log = LoggerFactory.getLogger(PedidoService.class);

    public Pedido savePedido(Pedido pedido){
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido getPedido(String id) {
        return pedidoRepository.findById(id).orElse(null);
    }
    
    public List<Pedido> getPedido(Integer id) {
        return pedidoRepository.findByCliente(id).orElse(null);
    }

    public List<Pedido> getPedido(Estado estado) {
        return pedidoRepository.findByEstado(estado).orElse(null);
    }

    public List<Pedido> getPedido(Cliente cliente, Estado estado) {
        return pedidoRepository.findByClienteEstado(cliente, estado).orElse(null);
    }

    public void deletePedido(String id) {
        pedidoRepository.deleteById(id);
    }

    public Pedido updateEstado(String id, Estado estado){
        Pedido pedido = pedidoRepository.findById(id).get();
        
        pedido.agregarEstado(estado);

        return pedidoRepository.save(pedido);
    }



}
