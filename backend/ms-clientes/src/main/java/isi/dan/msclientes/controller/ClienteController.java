package isi.dan.msclientes.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import isi.dan.msclientes.aop.LogExecutionTime;
import isi.dan.msclientes.aop.RequireRole;
import isi.dan.msclientes.exception.ClienteNotFoundException;
import isi.dan.msclientes.model.Cliente;
import isi.dan.msclientes.model.Estado;
import isi.dan.msclientes.model.Obra;
import isi.dan.msclientes.servicios.ClienteService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private static final Logger log = LoggerFactory.getLogger(ClienteController.class);

    @Autowired
    private ClienteService clienteService;

    // @Value("${dan.clientes.instancia}")
    // private String instancia;

    @GetMapping("/test")
    @RequireRole("ROLE_NOEXIST")
    public ResponseEntity<String> test(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authHeader);
        return ResponseEntity.ok("Header received");
    }

    @PostMapping
    @LogExecutionTime
    @RequireRole("ROLE_ADMIN")
    public Cliente create(@RequestBody @Validated Cliente cliente) {
        log.info("Creando cliente: {}", cliente);
        return clienteService.save(cliente);
    }

    // @Secured(roles = {"ADMIN", "USER"})
    @GetMapping
    @LogExecutionTime
    public List<Cliente> getAll() {
        List<Cliente> clientes = clienteService.findAll();
        log.info("Obteniendo todos los clientes cantidad = {}", clientes.size());
        return clientes;
    }

    @GetMapping("/{id}")
    @LogExecutionTime
    public ResponseEntity<Cliente> getById(@PathVariable Integer id) throws ClienteNotFoundException {
        log.info("Buscando cliente con ID: {}", id);
        Optional<Cliente> cliente = clienteService.findById(id);
        return ResponseEntity
                .ok(cliente.orElseThrow(() -> new ClienteNotFoundException("Cliente " + id + " no encontrado")));
    }

    @PutMapping("/{id}")
    @LogExecutionTime
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<Cliente> update(@PathVariable final Integer id, @RequestBody Cliente cliente)
            throws ClienteNotFoundException {
        log.info("Actualizando cliente con ID: {}", id);
        if (!clienteService.findById(id).isPresent()) {
            log.warn("Cliente con ID {} no encontrado", id);
            throw new ClienteNotFoundException("Cliente " + id + " no encontrado");
        }
        cliente.setId(id);
        return ResponseEntity.ok(clienteService.update(cliente));
    }

    @DeleteMapping("/{id}")
    @LogExecutionTime
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws ClienteNotFoundException {
        log.info("Eliminando cliente con ID: {}", id);
        if (!clienteService.findById(id).isPresent()) {
            log.warn("Cliente con ID {} no encontrado", id);
            return ResponseEntity.notFound().build();
        }
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{clienteId}/{obraId}/")
    @LogExecutionTime
    public ResponseEntity<Void> actualizarEstadoObra(
            @PathVariable Integer clienteId,
            @PathVariable Integer obraId,
            @RequestBody Estado nuevoEstado) {
        log.info("Actualizando estado de la obra con ID: {} para el cliente con ID: {} a estado: {}", obraId, clienteId,
                nuevoEstado);

        Optional<Cliente> clienteOpt = clienteService.findById(clienteId);
        if (!clienteOpt.isPresent()) {
            log.warn("Cliente con ID {} no encontrado", clienteId);
            return ResponseEntity.notFound().build();
        }

        Cliente cliente = clienteOpt.get();

        Optional<Obra> obraOpt = cliente.getObras().stream()
                .filter(obra -> obra.getId().equals(obraId))
                .findFirst();

        if (!obraOpt.isPresent()) {
            log.warn("Obra con ID {} no encontrada para el cliente con ID {}", obraId, clienteId);
            return ResponseEntity.notFound().build();
        }

        Obra obra = obraOpt.get();

        try {
            clienteService.actualizarEstadoObra(cliente, obra, nuevoEstado);
            log.info("Estado de la obra con ID {} actualizado correctamente a {}", obraId, nuevoEstado);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            log.error("Error al actualizar el estado de la obra: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/4AD4-$y38r6mD5TmqQ6=/{id}/{monto}")
    @LogExecutionTime
    public ResponseEntity<Boolean> verificarSaldo(@PathVariable Integer id, @PathVariable Double monto) {
        log.info("Verificando saldo para cliente con ID: {} y monto: {}", id, monto);

        Optional<Cliente> clienteOpt = clienteService.findById(id);
        if (!clienteOpt.isPresent()) {
            log.warn("Cliente con ID {} no encontrado", id);
            return ResponseEntity.notFound().build();
        }

        Cliente cliente = clienteOpt.get();
        Double saldoDisponible = cliente.getMaximoDescubierto() - monto;

        log.info("Saldo disponible para cliente con ID {}: {}", id, saldoDisponible);

        if (cliente.getMaximoDescubierto() >= monto) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }
}
