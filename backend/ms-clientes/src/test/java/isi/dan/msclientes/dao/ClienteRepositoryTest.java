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

import isi.dan.msclientes.model.Cliente;
import isi.dan.msclientes.model.Obra;
import isi.dan.msclientes.model.Usuario;

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
public class ClienteRepositoryTest {

    Logger log = LoggerFactory.getLogger(ObraRepositoryTest.class);

    @Container
    public static MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private ClienteRepository clienteRepository;
    private static final Integer CANTIDAD_CLIENTES = 5;
    private static List<Cliente> clientes;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mysqlContainer::getUsername);
        registry.add("spring.datasource.password", mysqlContainer::getPassword);
    }

    @BeforeAll
    static void inicializar(){
        clientes = new ArrayList<>();
        for(int i=0; i<CANTIDAD_CLIENTES; i++){
            Cliente cliente = new Cliente();
            cliente.setNombre("Test Cliente " + i);
            cliente.setCuit("1234567" + i);
            cliente.setMaximoDescubierto( 10000.00 + i*200.02);
            cliente.setMaximoDeObras(i+2);
            cliente.setCorreoElectronico("test" + i + "@test.com");
            cliente.setObrasActivas(0);
            clientes.add(cliente);
        }
    }

    @BeforeEach
    void init() {
        try {
            clienteRepository.saveAll(clientes);
            clienteRepository.flush();
            log.info("Clientes guardados: {}", clienteRepository.count());
        } catch (Exception e) {
            log.error("Error al guardar los clientes");
            System.out.println(e);
        }
    }

    @AfterEach
    void clean() {
        clienteRepository.flush(); // Fuerza la escritura de transacciones pendientes
        clienteRepository.deleteAll();
        clienteRepository.flush();
    } 

    @AfterAll
    static void stopContainer() {
        mysqlContainer.stop();
    }

    @Test
    @Order(1)
    void testFindById() {

        Optional<Cliente> foundCliente = clienteRepository.findById(1);
        log.info("ENCONTRE: {} ",foundCliente);
        assertThat(foundCliente).isPresent();
        assertThat(foundCliente.get().getNombre()).isEqualTo("Test Cliente 0");
    }

    @Test
    @Order(2)
    void testUpdateDatos() {
 
        Optional<Cliente> foundCliente = clienteRepository.findById(6);
        log.info("ENCONTRE: {} ",foundCliente);
        Cliente cliente = foundCliente.get();
        cliente.setNombre("Test Cliente 6 modificado");
        clienteRepository.save(cliente);
        foundCliente = clienteRepository.findById(6);
        assertThat(foundCliente).isPresent();
        assertThat(foundCliente.get().getNombre()).isEqualTo("Test Cliente 6 modificado");
    }

    @Test
    @Order(3)
    void testDelete() {
        
        clienteRepository.deleteById(11);
        log.info("No se encontro el cliente");
        Optional<Cliente> foundCliente = clienteRepository.findById(11);
        assertThat(foundCliente).isNotPresent();
    }

    @Test
    @Order(4)
    void testFindAll() {
        List<Cliente> foundCliente = clienteRepository.findAll();
        log.info("ENCONTRE: {} ",foundCliente.size());
        log.info("ID cliente: {} ",foundCliente.get(0).getId());
        assertThat(foundCliente).isNotEmpty();
    }

    @Test
    @Order(5)
    void AgregarObra(){

        Cliente foundCliente = clienteRepository.findAll().get(0);
        Integer id = foundCliente.getId();
        Obra obra = new Obra();
        obra.setDireccion("Test Obra");
        obra.setPresupuesto(BigDecimal.valueOf(1000.00));
        obra.setCliente(foundCliente);
        foundCliente.getObras().add(obra);
        clienteRepository.save(foundCliente);
        Optional<Cliente> clienteConObra = clienteRepository.findById(id);
        assertThat(clienteConObra).isPresent();
        assertThat(clienteConObra.get().getObras().size()).isEqualTo(1);
        assertThat(clienteConObra.get().getObras().get(0).getDireccion()).isEqualTo("Test Obra");

    }

    @Test
    @Order(6)
    void AgregarUsuarios(){

        Cliente foundCliente = clienteRepository.findAll().get(0);
        Integer id = foundCliente.getId();
        Usuario usuario = new Usuario();
        usuario.setNombre("Test Usuario ");
        usuario.setDni("1234567");
        usuario.setApellido("Apellido");
        usuario.setCorreoElectronico("test@test.com");
        foundCliente.getUsuarios().add(usuario);
        clienteRepository.save(foundCliente);
        Optional<Cliente> clienteConUsuario = clienteRepository.findById(id);
        assertThat(clienteConUsuario).isPresent();
        assertThat(clienteConUsuario.get().getUsuarios().size()).isEqualTo(1);
        assertThat(clienteConUsuario.get().getUsuarios().get(0).getNombre()).isEqualTo("Test Usuario ");
        log.info(foundCliente.toString());
    }


}
