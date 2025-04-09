package isi.dan.ms.pedidos.conf;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String STOCK_UPDATE_QUEUE = "stock-update-queue";
    public static final String EXCHANGE = "stock-update-exchange";
    public static final String ROUTING_KEY = "stock.update";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }
}
