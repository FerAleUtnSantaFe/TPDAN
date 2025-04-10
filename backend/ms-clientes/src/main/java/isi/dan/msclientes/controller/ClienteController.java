
package isi.dan.msclientes.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import isi.dan.msclientes.aop.LogExecutionTime;
import isi.dan.msclientes.exception.ClienteNotFoundException;
import isi.dan.msclientes.model.Cliente;
import isi.dan.msclientes.servicios.ClienteService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private static final Logger log = LoggerFactory.getLogger(ClienteController.class);

    @Autowired
    private ClienteService clienteService;

    @Value("${dan.clientes.instancia}")
    private String instancia;

    @PostMapping
    @LogExecutionTime
    public Cliente create(@RequestBody @Validated Cliente cliente) {
        log.info("Creando cliente: {} en instancia {}", cliente, instancia);
        return clienteService.save(cliente);
    }

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
        log.info("Buscando cliente con ID: {} en instancia {}", id, instancia);
        Optional<Cliente> cliente = clienteService.findById(id);
        return ResponseEntity
                .ok(cliente.orElseThrow(() -> new ClienteNotFoundException("Cliente " + id + " no encontrado")));
    }

    @PutMapping("/{id}")
    @LogExecutionTime
    public ResponseEntity<Cliente> update(@PathVariable final Integer id, @RequestBody Cliente cliente)
            throws ClienteNotFoundException {
        log.info("Actualizando cliente con ID: {} en instancia {}", id, instancia);
        if (!clienteService.findById(id).isPresent()) {
            log.warn("Cliente con ID {} no encontrado en instancia {}", id, instancia);
            throw new ClienteNotFoundException("Cliente " + id + " no encontrado");
        }
        cliente.setId(id);
        return ResponseEntity.ok(clienteService.update(cliente));
    }

    @DeleteMapping("/{id}")
    @LogExecutionTime
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws ClienteNotFoundException {
        log.info("Eliminando cliente con ID: {} en instancia {}", id, instancia);
        if (!clienteService.findById(id).isPresent()) {
            log.warn("Cliente con ID {} no encontrado en instancia {}", id, instancia);
            throw new ClienteNotFoundException("Cliente " + id + " no encontrado para borrar");
        }
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/{monto}")
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
