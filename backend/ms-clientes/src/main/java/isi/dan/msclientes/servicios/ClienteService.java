package isi.dan.msclientes.servicios;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import isi.dan.msclientes.dao.ClienteRepository;
import isi.dan.msclientes.model.Cliente;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;
    private static final Logger log = LoggerFactory.getLogger(ClienteService.class);

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> findById(Integer id) {
        return clienteRepository.findById(id);
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente update(Cliente clienteActualizado) {

        Cliente cliente = clienteRepository.findById(clienteActualizado.getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Sincronizar la lista de usuarios con la nueva lista recibida
        cliente.actualizarUsuarios(clienteActualizado.getUsuarios());

        // Ahora puedes actualizar las demás propiedades del cliente
        cliente.setNombre(clienteActualizado.getNombre());
        cliente.setCorreoElectronico(clienteActualizado.getCorreoElectronico());
        cliente.setCuit(clienteActualizado.getCuit());
        cliente.setMaximoDescubierto(clienteActualizado.getMaximoDescubierto());
        cliente.setMaximoDeObras(clienteActualizado.getMaximoDeObras());
        cliente.setObrasActivas(clienteActualizado.getObrasActivas());
        cliente.setObras(clienteActualizado.getObras());

        return clienteRepository.save(cliente);
    }

    public void deleteById(Integer id) {
        clienteRepository.deleteById(id);
    }

    public boolean checkSaldoCliente(Cliente clienteActual, Double saldoTotal) {
        Cliente cliente = clienteRepository.findById(clienteActual.getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (cliente.getMaximoDescubierto() >= saldoTotal) {
            return true;
        } else {
            return false;
        }
    }
}
