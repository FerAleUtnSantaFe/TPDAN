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

import isi.dan.msclientes.model.Usuario;
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
public class UsuarioRepositoryTest {

    Logger log = LoggerFactory.getLogger(ObraRepositoryTest.class);

    @Container
    public static MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private UsuarioRepository usuarioRepository;
    private static final Integer CANTIDAD_USUARIOS = 5;
    private static List<Usuario> usuarios;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mysqlContainer::getUsername);
        registry.add("spring.datasource.password", mysqlContainer::getPassword);
    }

    @BeforeAll
    static void inicializar(){
        usuarios = new ArrayList<>();
        for(int i=0; i<CANTIDAD_USUARIOS; i++){
            Usuario usuario = new Usuario();
            usuario.setNombre("Test Usuario "+i);
            usuario.setDni("1234567"+i);
            usuario.setApellido("Apellido "+i);
            usuario.setCorreoElectronico("test" + i + "@test.com");
            usuarios.add(usuario);
        }
    }

    @BeforeEach
    void init() {
        try {
            usuarioRepository.saveAll(usuarios);
            usuarioRepository.flush();
            log.info("Usuarios guardados: {}", usuarioRepository.count());
        } catch (Exception e) {
            log.error("Error al guardar los usuarios");
        }
    }

    @AfterEach
    void clean() {
        usuarioRepository.flush(); // Fuerza la escritura de transacciones pendientes
        usuarioRepository.deleteAll();
        usuarioRepository.flush();
    } 

    @AfterAll
    static void stopContainer() {
        mysqlContainer.stop();
    }

    @Test
    @Order(1)
    void testFindById() {
//       List<Usuario> todasLasObras = usuarioRepository.findAll();
//       todasLasObras.forEach(usuario -> log.info("Usuario ID en DB: {}", usuario.getId()));

        Optional<Usuario> foundObra = usuarioRepository.findById(1);
        log.info("ENCONTRE: {} ",foundObra);
        assertThat(foundObra).isPresent();
        assertThat(foundObra.get().getNombre()).isEqualTo("Test Usuario 0");
    }

    @Test
    @Order(2)
    void testUpdate() {

        Optional<Usuario> foundObra = usuarioRepository.findById(6);
        log.info("ENCONTRE: {} ",foundObra);
        Usuario usuario = foundObra.get();
        usuario.setNombre("Test Usuario 1 modificado");
        usuarioRepository.save(usuario);
        foundObra = usuarioRepository.findById(6);
        assertThat(foundObra).isPresent();
        assertThat(foundObra.get().getNombre()).isEqualTo("Test Usuario 1 modificado");
    }

    @Test
    @Order(3)
    void testDelete() {
        usuarioRepository.deleteById(11);
        log.info("No se encontro la usuario");
        Optional<Usuario> foundObra = usuarioRepository.findById(11);
        assertThat(foundObra).isNotPresent();
    }

    @Test
    @Order(4)
    void testFindAll() {
        List<Usuario> foundObra = usuarioRepository.findAll();
        log.info("ENCONTRE: {} ",foundObra.size());
        log.info("ID usuario: {} ",foundObra.get(0).getId());
        assertThat(foundObra).isNotEmpty();
    }

}

