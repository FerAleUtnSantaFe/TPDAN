package com.backend.servicio_pedidos.servicio;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.servicio_pedidos.conf.RabbitMQConfig;
import com.backend.servicio_pedidos.dao.PedidoRepository;
import com.backend.servicio_pedidos.modelo.DetallePedido;
import com.backend.servicio_pedidos.modelo.Pedido;
@Service
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    Logger log = LoggerFactory.getLogger(PedidoService.class);


    public Pedido savePedido(Pedido pedido) {
        for( DetallePedido dp : pedido.getDetalle()){
            log.info("Enviando {}", dp.getProducto().getId()+";"+dp.getCantidad());
            rabbitTemplate.convertAndSend(RabbitMQConfig.STOCK_UPDATE_QUEUE, dp.getProducto().getId()+";"+dp.getCantidad());
        }
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido getPedidoById(String id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public void deletePedido(String id) {
        pedidoRepository.deleteById(id);
    }
}
