package com.backend.servicio_clientes.DAO;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.servicio_clientes.model.Obra;

public interface ObraRepository extends JpaRepository<Obra, Integer>{

    List<Obra> findByPresupuestoGreaterThanEqual(BigDecimal price);
    
}
