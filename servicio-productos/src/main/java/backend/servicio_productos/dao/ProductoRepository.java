package backend.servicio_productos.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.servicio_productos.modelo.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
