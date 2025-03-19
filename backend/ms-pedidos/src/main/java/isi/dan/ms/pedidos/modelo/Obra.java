package isi.dan.ms.pedidos.modelo;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Obra {

    private Integer id;
    private String direccion;
    private Boolean esRemodelacion;
    private Double latitud, longitud;
    private BigDecimal presupuesto;
    
}
