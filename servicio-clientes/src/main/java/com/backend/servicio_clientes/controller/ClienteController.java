package com.backend.servicio_clientes.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.servicio_clientes.exceptions.ClienteNotFoundException;
import com.backend.servicio_clientes.model.Cliente;
import com.backend.servicio_clientes.servicios.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    
    // Logger log = LoggerFactory.getLogger(ClienteController.class);

    // @Value("${dan.clientes.instancia}")
    // private String instancia;

    
    @Autowired
    private ClienteService clienteService;

    @GetMapping
    //@LogExecutionTime
    public List<Cliente> getAll() {
        return clienteService.findAll();
    }
    
    // @GetMapping("/echo")
    // @LogExecutionTime
    // public String getEcho() {
    //     log.debug("Recibiendo un echo ----- {}",instancia);
    //     return Instant.now()+" - "+instancia;
    // }

    @GetMapping("/{id}")
    //@LogExecutionTime
    public ResponseEntity<Cliente> getById(@PathVariable Integer id)  throws ClienteNotFoundException {
        Optional<Cliente> cliente = clienteService.findById(id);
        return ResponseEntity.ok(cliente.orElseThrow(()-> new ClienteNotFoundException("Cliente "+id+" no encontrado")));
    }

    @PostMapping
    //@LogExecutionTime
    public Cliente create(@RequestBody @Validated Cliente cliente) {
        return clienteService.save(cliente);
    }

    @PutMapping("/{id}")
    //@LogExecutionTime
    public ResponseEntity<Cliente> update(@PathVariable final Integer id, @RequestBody Cliente cliente) throws ClienteNotFoundException {
        if (!clienteService.findById(id).isPresent()) {
            throw new ClienteNotFoundException("Cliente "+id+" no encontrado");
        }
        cliente.setId(id);
        return ResponseEntity.ok(clienteService.update(cliente));
    }

    @DeleteMapping("/{id}")
    //@LogExecutionTime
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws ClienteNotFoundException {
        if (!clienteService.findById(id).isPresent()) {
            throw new ClienteNotFoundException("Cliente "+id+" no encontrado para borrar");
        }
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
