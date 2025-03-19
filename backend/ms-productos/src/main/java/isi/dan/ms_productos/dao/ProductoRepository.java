package isi.dan.ms_productos.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import isi.dan.ms_productos.modelo.Categoria;
import isi.dan.ms_productos.modelo.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByCategoria(Categoria categoria);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Producto p WHERE p.categoria = :categoria")
    void deleteByCategoria(Categoria categoria);

}

