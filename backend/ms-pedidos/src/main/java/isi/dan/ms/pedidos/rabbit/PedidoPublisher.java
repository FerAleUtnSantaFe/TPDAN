package isi.dan.ms.pedidos.rabbit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import isi.dan.ms.pedidos.conf.RabbitMQConfig;
import isi.dan.ms.pedidos.modelo.Pedido;


@Component
public class PedidoPublisher {
    
    private static final Logger log = LoggerFactory.getLogger(PedidoPublisher.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void enviarPedido(Pedido pedido) {
        try {
            log.info("Enviando pedido a RabbitMQ: {}", pedido.getId());
            String mensaje = objectMapper.writeValueAsString(pedido);
            log.info("Mensaje serializado: {}", mensaje);

            // Enviar al exchange correcto con la routing key
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE, // Exchange declarado
                    RabbitMQConfig.ROUTING_KEY, // Routing key que enlaza con la cola
                    mensaje);

            System.out.println("Mensaje enviado a RabbitMQ: " + mensaje);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializando el pedido para RabbitMQ", e);
        }
    }
}
