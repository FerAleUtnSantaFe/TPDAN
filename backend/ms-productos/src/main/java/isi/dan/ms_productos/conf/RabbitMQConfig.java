package isi.dan.ms_productos.conf;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange pedidoExchange() {
        return new TopicExchange("pedido.exchange");
    }

    @Bean
    public Queue pedidoConfirmadoQueue() {
        return new Queue("pedido.confirmado.productos", true);
    }

    @Bean
    public Queue stockDescontadoQueue() {
        return new Queue("pedido.stock-descontado", true);
    }

    @Bean
    public Queue pedidoFallidoQueue() {
        return new Queue("pedido.confirmado-fallido", true);
    }

    @Bean
    public Binding bindingPedidoConfirmado(Queue pedidoConfirmadoQueue, TopicExchange pedidoExchange) {
        return BindingBuilder.bind(pedidoConfirmadoQueue).to(pedidoExchange).with("pedido.confirmado");
    }

    @Bean
    public Binding bindingPedidoFallido(Queue pedidoFallidoQueue, TopicExchange pedidoExchange) {
        return BindingBuilder.bind(pedidoFallidoQueue).to(pedidoExchange).with("pedido.confirmado-fallido");
    }

    @Bean
    public Binding bindingStockDescontado(Queue stockDescontadoQueue, TopicExchange pedidoExchange) {
        return BindingBuilder.bind(stockDescontadoQueue).to(pedidoExchange).with("pedido.stock-descontado");
    }
}