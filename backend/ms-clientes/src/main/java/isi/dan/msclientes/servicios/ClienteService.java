package isi.dan.msclientes.servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import isi.dan.msclientes.dao.ClienteRepository;
import isi.dan.msclientes.model.Cliente;
import isi.dan.msclientes.model.Estado;
import isi.dan.msclientes.model.Obra;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> findById(Integer id) {
        return clienteRepository.findById(id);
    }

    public Cliente save(Cliente cliente) {
        habilitarObras(cliente);
        return clienteRepository.save(cliente);
    }

    public Cliente update(Cliente clienteActualizado) {

        Cliente cliente = clienteRepository.findById(clienteActualizado.getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Sincronizar la lista de usuarios con la nueva lista recibida
        cliente.actualizarUsuarios(clienteActualizado.getUsuarios());
        cliente.actualizarObras(clienteActualizado.getObras());

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

    public void actualizarEstadoObra(Cliente cliente, Obra obra, Estado nuevoEstado) {
        switch (nuevoEstado) {
            case FINALIZADA:
                obra.setEstado(Estado.FINALIZADA);
                cliente.setObrasActivas(cliente.getObrasActivas() - 1);
                habilitarObras(cliente); // Intentar habilitar obras pendientes
                break;
    
            case PENDIENTE:
                obra.setEstado(Estado.PENDIENTE);
                // No se habilitan nuevas obras automáticamente
                break;
    
            case HABILITADA:
                if (cliente.getObrasActivas() < cliente.getMaximoDeObras()) {
                    obra.setEstado(Estado.HABILITADA);
                    cliente.setObrasActivas(cliente.getObrasActivas() + 1);
                } else {
                    throw new IllegalStateException("No se puede habilitar la obra. Se alcanzó el máximo permitido.");
                }
                break;
    
            default:
                throw new IllegalArgumentException("Estado no soportado: " + nuevoEstado);
        }
    
        // Guardar los cambios en la obra y el cliente
        clienteRepository.save(cliente);
    }

    public void habilitarObras(Cliente cliente) {
        // Contar las obras actualmente activas (estado HABILITADA)
        long obrasActivas = cliente.getObras().stream()
                .filter(obra -> Estado.HABILITADA == obra.getEstado())
                .count();

        // Si ya alcanzó el máximo permitido, no se puede habilitar más obras
        if (obrasActivas >= cliente.getMaximoDeObras()) {
            return;
        }

        // Recorrer las obras en estado PENDIENTE y tratar de habilitarlas
        for (Obra obra : cliente.getObras()) {
            if (Estado.PENDIENTE == obra.getEstado() && obrasActivas < cliente.getMaximoDeObras()) {
                obra.setEstado(Estado.HABILITADA); // Cambiar el estado a HABILITADA
                obrasActivas++; // Incrementar el contador de obras activas
            }

            // Si ya se alcanzó el máximo permitido, detener el proceso
            if (obrasActivas >= cliente.getMaximoDeObras()) {
                break;
            }
        }

        // Guardar los cambios en el cliente
        clienteRepository.save(cliente);
    }
}
