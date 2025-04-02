package isi.dan.ms.pedidos.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.Pedido;

public interface PedidoRepository extends MongoRepository<Pedido, String> {

    Optional<List<Pedido>> findByCliente(String id);

    Optional<List<Pedido>> findByEstado(Estado estado);

    Optional<List<Pedido>> findByCliente_IdAndEstado(String clienteId, Estado estado);
}

