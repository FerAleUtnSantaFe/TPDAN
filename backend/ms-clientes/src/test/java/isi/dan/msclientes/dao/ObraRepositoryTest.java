package isi.dan.msclientes.dao;
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
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import isi.dan.msclientes.model.Obra;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@Testcontainers
@ActiveProfiles("db")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ObraRepositoryTest {

    Logger log = LoggerFactory.getLogger(ObraRepositoryTest.class);

    @Container
    public static MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private ObraRepository obraRepository;
    private static final Integer CANTIDAD_OBRAS = 5;
    private static List<Obra> obras;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mysqlContainer::getUsername);
        registry.add("spring.datasource.password", mysqlContainer::getPassword);
    }

    @BeforeAll
    static void inicializar(){
        obras = new ArrayList<>();
        for(int i=0; i<CANTIDAD_OBRAS; i++){
            Obra obra = new Obra();
            obra.setDireccion("Test Obra "+i);
            obra.setPresupuesto(BigDecimal.valueOf(100*(i+1)));
            obras.add(obra);
        }
    }

    @BeforeEach
    void init() {
        try {
            obraRepository.saveAll(obras);
            obraRepository.flush();
            log.info("Obras guardadas: {}", obraRepository.count());
        } catch (Exception e) {
            log.error("Error al guardar las obras");
        }
    }

    @AfterEach
    void clean() {
        obraRepository.flush(); // Fuerza la escritura de transacciones pendientes
        obraRepository.deleteAll();
        obraRepository.flush();
    } 

    @AfterAll
    static void stopContainer() {
        mysqlContainer.stop();
    }

    @Test
    @Order(1)
    void testFindById() {
//       List<Obra> todasLasObras = obraRepository.findAll();
//       todasLasObras.forEach(obra -> log.info("Obra ID en DB: {}", obra.getId()));

        Optional<Obra> foundObra = obraRepository.findById(1);
        log.info("ENCONTRE: {} ",foundObra);
        assertThat(foundObra).isPresent();
        assertThat(foundObra.get().getDireccion()).isEqualTo("Test Obra 0");
    }

    @Test
    @Order(2)
    void testUpdate() {

        Optional<Obra> foundObra = obraRepository.findById(6);
        log.info("ENCONTRE: {} ",foundObra);
        Obra obra = foundObra.get();
        obra.setDireccion("Test Obra 1 modificado");
        obraRepository.save(obra);
        foundObra = obraRepository.findById(6);
        assertThat(foundObra).isPresent();
        assertThat(foundObra.get().getDireccion()).isEqualTo("Test Obra 1 modificado");
    }

    @Test
    @Order(3)
    void testDelete() {

        obraRepository.deleteById(11);
        log.info("No se encontro la obra");
        Optional<Obra> foundObra = obraRepository.findById(11);
        assertThat(foundObra).isNotPresent();
    }

    @Test
    @Order(4)
    void testFindAll() {
        List<Obra> foundObra = obraRepository.findAll();
        log.info("ENCONTRE: {} ",foundObra.size());
        log.info("ID obra: {} ",foundObra.get(0).getId());
        assertThat(foundObra).isNotEmpty();
    }

}