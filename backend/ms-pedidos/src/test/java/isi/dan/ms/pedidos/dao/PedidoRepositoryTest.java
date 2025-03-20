package isi.dan.ms.pedidos.dao;

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

import isi.dan.ms.pedidos.modelo.Cliente;
import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.Obra;
import isi.dan.ms.pedidos.modelo.Pedido;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

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
    private static Cliente cliente;
    private static Obra obra;
    private static Estado estado;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @BeforeAll
    static void inicializar() {
        pedido = new Pedido();
        cliente = new Cliente();
        pedido.setNumeroPedido(1);
        cliente.setId(1);
        obra = new Obra();
        obra.setId(1);
        pedido.setObra(obra);
        estado = Estado.ACEPTADO;
        pedido.setCliente(cliente);
        pedido.setEstado(estado);
        pedido.setId("1A");
    }

    @BeforeEach
    void init() {
        pedidoRepository.save(pedido);
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
    @Order(1)
    void testFind() {
        Pedido foundPedido = pedidoRepository.findById("1A").get();
        log.info("ENCONTRÉ: {}", foundPedido);
        assertThat(foundPedido.getId()).isEqualTo("1A");
    }

}

