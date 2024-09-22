package com.backend.servicio_pedidos.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.servicio_pedidos.modelo.Pedido;

public interface PedidoRepository extends MongoRepository<Pedido, String> {
}
