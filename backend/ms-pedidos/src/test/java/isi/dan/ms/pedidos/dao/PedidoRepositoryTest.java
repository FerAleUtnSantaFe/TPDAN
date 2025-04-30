package isi.dan.ms.pedidos.dao;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.Pedido;

@ExtendWith(SpringExtension.class)
@DataMongoTest
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PedidoRepositoryTest {

    Logger log = LoggerFactory.getLogger(PedidoRepositoryTest.class);

    @Container
    public static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:latest");

    @Autowired
    private PedidoRepository pedidoRepository;

    private static final Integer CANTIDAD_PEDIDOS = 5;
    private static Pedido pedido;
    private static Estado estado;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @BeforeAll
    static void inicializar() {
        pedido = new Pedido();
        pedido.setNumeroPedido(1);
        pedido.setObra(1);
        estado = Estado.ACEPTADO;
        pedido.setCliente(1);
        pedido.setEstado(estado);
        pedido.setId("1A");
    }

    @BeforeEach
    void init() {
        pedidoRepository.save(pedido);
        log.info("Pedidos guardados: {}", pedidoRepository.count());
        for (int i = 1; i < CANTIDAD_PEDIDOS; i++) {
            Pedido p = new Pedido();
            p.setNumeroPedido(i + 1);
            p.setObra(1);
            p.setCliente(1);
            p.setEstado(Estado.ACEPTADO);
            p.setId("1A" + i); // para que tengan ID único
            pedidoRepository.save(p);
        }
        log.info("Pedidos guardados: {}", pedidoRepository.count());
    }

    @AfterEach
    void clean() {
        pedidoRepository.deleteAll();
    }

    @AfterAll
    static void stopContainer() {
        mongoDBContainer.stop();
    }

    @Test
    @Order(1)
    void testFindAll() {
        List<Pedido> foundPedidos = pedidoRepository.findAll();
        log.info("ENCONTRÉ: {} pedidos", foundPedidos.size());
        assertThat(foundPedidos).hasSize(CANTIDAD_PEDIDOS);
    }

    @Test
    @Order(2)
    void testFind() {
        Pedido foundPedido = pedidoRepository.findById("1A").get();
        log.info("ENCONTRÉ: {}", foundPedido);
        assertThat(foundPedido.getId()).isEqualTo("1A");
    }

}
