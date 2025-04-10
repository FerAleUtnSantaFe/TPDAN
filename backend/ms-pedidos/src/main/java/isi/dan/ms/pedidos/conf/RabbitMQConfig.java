package isi.dan.ms.pedidos.conf;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange pedidoExchange() {
        return new TopicExchange("pedido.exchange");
    }
}
